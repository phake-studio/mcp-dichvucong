# 🇻🇳 Dịch Vụ Công MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server that connects to the Vietnamese government's Dịch Vụ Công (Public Services) API. This MCP server enables AI assistants to retrieve information about administrative procedures and document status through a standardized interface, allowing models to access real-time data from Vietnam's public service portal without direct API integration.

## Use case
This MCP server enables AI assistants to:

- **Check document status**: Retrieve the current status of submitted administrative documents and applications using the document ID.
- **Provide real-time updates**: Allow users to track their applications without leaving the chat interface.

For example, users can ask their AI assistant questions like:
- "Kiêm tra trạng thái hồ sơ số HS.000.000.000?"
- "Khi nào thì hồ sơ số HS.000.000.000 sẽ có kết quả?"
- "Hồ sơ số HS.000.000.000 đã có kết quả chưa, và thời gian hẹn lấy là khi nào?"

The assistant can then use this MCP server to fetch the latest information directly from Vietnam's public service portal and provide accurate, up-to-date responses.

## Installation

### Usage with Claude Desktop
To use this with Claude Desktop, add the following to your claude_desktop_config.json:

#### NPX
```json
{
  "mcpServers": {
    "dichvucong-vietnam": {
      "command": "npx",
      "args": [
        "-y",
        "@phakestudio/mcp-dichvucong"
      ]
    }
  }
}
```
## License
This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the [LICENSE](LICENSE) file in the project repository.