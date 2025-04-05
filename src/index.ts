import app from "./app";
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import OAuthProvider from "@cloudflare/workers-oauth-provider";

export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Demo",
		version: "1.0.0",
	});

	async init() {
		this.server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
			content: [{ type: "text", text: String(a + b) }],
		}));
		   // 添加提供名字的服务
this.server.tool(
  "provide-name", 
  {}, // 空对象作为schema
  async () => {
    try {
      console.log("provide-name工具被调用");
      const names = ["Tom", "William", "Jones", "Gates", "Tom"];
      const randomIndex = Math.floor(Math.random() * names.length);
      const selectedName = names[randomIndex];
      console.log("返回的名字:", selectedName);
      
      return {
        content: [{ type: "text", text: selectedName }]
      };
    } catch (error) {
      console.error("provide-name工具出错:", error);
      return {
        content: [{ type: "text", text: "生成名字时出错" }]
      };
    }
  },
  {
    description: "随机返回一个名字，不需要任何参数"
  }
);
	}
}

// Export the OAuth handler as the default
export default new OAuthProvider({
	apiRoute: "/sse",
	// TODO: fix these types
	// @ts-ignore
	apiHandler: MyMCP.mount("/sse"),
	// @ts-ignore
	defaultHandler: app,
	authorizeEndpoint: "/authorize",
	tokenEndpoint: "/token",
	clientRegistrationEndpoint: "/register",
});
