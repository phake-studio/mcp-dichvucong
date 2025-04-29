import { getUserAgent } from "universal-user-agent";
import { VERSION } from "../constants/version.js";

type RequestOptions = {
    method?: string;
    body?: RequestInit["body"] | URLSearchParams;
    headers?: Record<string, string>;
  }

  const USER_AGENT = `mcp-dichvucong/${VERSION} ${getUserAgent()}`;

export async function dichVuCongRequest(url: string, options: RequestOptions): Promise<unknown> {
    const headers = {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
        ...options.headers,
    }

    const response = await fetch(url, {
        method: options.method,
        body: options.body,
        headers,
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} ${await response.text()}`);
    }

    return response.json()
}