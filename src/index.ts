#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { VERSION } from "./constants/version.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as briefcase from "./operations/briefcase.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

if (!globalThis.fetch) {
  globalThis.fetch = fetch as unknown as typeof global.fetch;
}

const server = new Server(
  {
    name: "mcp-dichvucong",
    version: VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_briefcase_status",
        description: "Lấy trạng thái của hồ sơ",
        inputSchema: zodToJsonSchema(briefcase.GetBriefcaseStatusRequestSchema),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "get_briefcase_status":
        const { briefcase_id } =
          briefcase.GetBriefcaseStatusRequestSchema.parse(args);
        const content = await briefcase.getBriefcaseStatus(briefcase_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(content),
            },
          ],
        };

      default:
        throw new Error("Không tìm thấy công cụ");
    }
  } catch (error) {
    console.error('server.setRequestHandler()', error);
    throw new Error("Lỗi khi gọi công cụ");
  }
});


async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 DichVuCong MCP Server is running...")
}

runServer().catch((error) => {
  console.error('main()', error);
  process.exit(1)
})