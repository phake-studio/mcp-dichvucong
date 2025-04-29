import { z } from "zod";
import { dichVuCongRequest } from "../utils/fetch.js";

// Schema definations
export const GetBriefcaseStatusRequestSchema = z.object({
  briefcase_id: z.string(),
});

interface StatusData {
  code?: string;
  applicant?: {
    data?: {
      fullname?: string;
    };
  };
  procedure?: {
    translate?: {
      [key: string]: {
        name?: string;
      };
    };
  };
  statusCurrentTask?: string;
  applyMethod?: {
    name?: string;
  };
  appliedDate?: string;
  completedDate?: string;
  appointmentDate?: string;
}

const getNestedValue = <T>(obj: any, path: string[], defaultValue: T): T => {
  let current = obj;
  for (const key of path) {
    if (current === null || typeof current !== "object" || !(key in current)) {
      return defaultValue;
    }
    current = current[key];
  }
  return current ?? defaultValue;
};

// Function implementations
export async function getBriefcaseStatus(briefcase_id: string) {
  // Get config
  const config = await dichVuCongRequest(
    `https://dichvucong.hochiminhcity.gov.vn/vi/assets/app.config.json?t=${Date.now()}`,
    {
      method: "GET",
    }
  );

  // Get client token from config
  const clientSecret: string | any =
    typeof config === "object" && config !== null && "CLIENT_SECRET" in config
      ? config.CLIENT_SECRET
      : null;
  const clientId: string | any =
    typeof config === "object" && config !== null && "CLIENT_ID" in config
      ? config.CLIENT_ID
      : null;

  if (!clientId || !clientSecret) {
    throw new Error("Không tìm thấy clientId hoặc clientSecret");
  }

  const getTokenBody = new URLSearchParams({
    grant_type: "client_credentials",
  });
  const tokenData = await dichVuCongRequest(
    "https://ssodvcmc.hochiminhcity.gov.vn/auth/realms/digo/protocol/openid-connect/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: getTokenBody,
    }
  );
  const accessToken =
    typeof tokenData === "object" &&
    tokenData !== null &&
    "access_token" in tokenData
      ? tokenData.access_token
      : null;

  if (!accessToken) {
    throw new Error("Không tìm thấy access token");
  }

  //   Get status
  const statusResponse = await dichVuCongRequest(
    `https://apigatewaydvcmc.hochiminhcity.gov.vn/pa/dossier-search/dvc?page=0&size=10&spec=slice&code=${briefcase_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (
    !statusResponse ||
    typeof statusResponse !== "object" ||
    !("content" in statusResponse) ||
    !Array.isArray(statusResponse.content) ||
    statusResponse.content.length === 0
  ) {
    throw new Error("Không tìm thấy dữ liệu");
  }

  const [statusData] = statusResponse.content as [StatusData];

  const responseData = {
    code: getNestedValue<string | null>(statusData, ["code"], null),
    application_user_full_name: getNestedValue<string | null>(
      statusData,
      ["applicant", "data", "fullname"],
      null
    ),
    type: getNestedValue<string | null>(
      statusData,
      ["procedure", "translate", "0", "name"],
      null
    ),
    current_status: getNestedValue<string | null>(
      statusData,
      ["statusCurrentTask"],
      null
    ),
    apply_method: getNestedValue<string | null>(
      statusData,
      ["applyMethod", "name"],
      null
    ),
    applied_at: getNestedValue<string | null>(
      statusData,
      ["appliedDate"],
      null
    ),
    completed_at: getNestedValue<string | null>(
      statusData,
      ["completedDate"],
      null
    ),
    appointment_at: getNestedValue<string | null>(
      statusData,
      ["appointmentDate"],
      null
    ),
  };

  return responseData;
}
