import app from "./app";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { google } from 'googleapis';

export class MyMCP {
	server = new McpServer({
		name: "Demo",
		version: "1.0.0",
	});

	async init() {
		this.server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
			content: [{ type: "text", text: String(a + b) }],
		}));

		// 添加提供名字的服务（优化版本）
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

		// 添加Cloudflare承诺服务
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

		// Gmail服务
		this.server.tool(
			"gmail_send", 
			{
				to: z.string(),
				subject: z.string(),
				message: z.string()
			},
			async ({ to, subject, message }) => {
				try {
					console.log("gmail_send工具被调用");
					// TODO: 实现Gmail发送逻辑
					return {
						content: [{ type: "text", text: `邮件已发送到 ${to}` }]
					};
				} catch (error) {
					console.error("gmail_send工具出错:", error);
					return {
						content: [{ type: "text", text: "发送邮件时出错" }]
					};
				}
			},
			{
				description: "发送Gmail邮件，需要提供收件人、主题和内容"
			}
		);

		// Gmail读取最新邮件
		this.server.tool(
			"gmail_read_latest",
			{
				count: z.number().optional()
			},
			async ({ count = 5 }) => {
				try {
					console.log("gmail_read_latest工具被调用");
					// TODO: 实现Gmail读取逻辑
					return {
						content: [{ type: "text", text: `已读取最新的 ${count} 封邮件` }]
					};
				} catch (error) {
					console.error("gmail_read_latest工具出错:", error);
					return {
						content: [{ type: "text", text: "读取邮件时出错" }]
					};
				}
			},
			{
				description: "读取最新的Gmail邮件，可选参数count指定读取数量"
			}
		);

		// Google Calendar创建事件
		this.server.tool(
			"calendar_create_event",
			{
				summary: z.string(),
				description: z.string().optional(),
				start: z.string(),
				end: z.string()
			},
			async ({ summary, description = "", start, end }) => {
				try {
					console.log("calendar_create_event工具被调用");
					// TODO: 实现Calendar创建事件逻辑
					return {
						content: [{ type: "text", text: `已创建日历事件: ${summary}` }]
					};
				} catch (error) {
					console.error("calendar_create_event工具出错:", error);
					return {
						content: [{ type: "text", text: "创建日历事件时出错" }]
					};
				}
			},
			{
				description: "在Google Calendar中创建新事件，需要提供事件标题、开始时间和结束时间"
			}
		);

		// Google Calendar读取事件
		this.server.tool(
			"calendar_list_events",
			{
				days: z.number().optional()
			},
			async ({ days = 7 }) => {
				try {
					console.log("calendar_list_events工具被调用");
					// TODO: 实现Calendar读取事件逻辑
					return {
						content: [{ type: "text", text: `已读取未来 ${days} 天的日历事件` }]
					};
				} catch (error) {
					console.error("calendar_list_events工具出错:", error);
					return {
						content: [{ type: "text", text: "读取日历事件时出错" }]
					};
				}
			},
			{
				description: "读取Google Calendar中的事件，可选参数days指定读取未来几天的事件"
			}
		);
	}

	static mount(path: string) {
		return async (request: Request) => {
			const mcp = new MyMCP();
			await mcp.init();
			return mcp.server.handle(request);
		};
	}
}

// Export the OAuth handler as the default
export default new OAuthProvider({
	apiRoute: "/sse",
	apiHandler: MyMCP.mount("/sse"),
	defaultHandler: app,
	authorizeEndpoint: "/authorize",
	tokenEndpoint: "/token",
	clientRegistrationEndpoint: "/register",
});