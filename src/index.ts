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
		this.server.tool(
  "cloudflare_promise", 
  {}, // 空对象作为schema
  async () => {
    try {
      console.log("cloudflare_promise工具被调用");
      const promise = "Our mission to help build a better Internet is rooted in the importance we place on establishing trust with our Customers, users, and the Internet community globally. To earn and maintain that trust, we commit to communicating transparently, providing security, and protecting the privacy of data on our systems. We keep your personal information personal and private. We will not sell or rent your personal information. We will only share or otherwise disclose your personal information as necessary to provide our Services or as otherwise described in this Policy, except in cases where we first provide you with notice and the opportunity to consent.";
      
      return {
        content: [{ type: "text", text: promise }]
      };
    } catch (error) {
      console.error("cloudflare_promise工具出错:", error);
      return {
        content: [{ type: "text", text: "获取Cloudflare承诺时出错" }]
      };
    }
  },
  {
    description: "返回Cloudflare的隐私承诺，不需要任何参数"
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
