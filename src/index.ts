import { z } from 'zod';
import { GoogleService } from './services/google.js';
import { API_PATHS, APP_CONFIG } from './config.js';

// 参数类型定义
const AddParamsSchema = z.object({
	a: z.number(),
	b: z.number(),
});

const GmailSendParamsSchema = z.object({
	to: z.string(),
	subject: z.string(),
	message: z.string(),
});

const GmailReadParamsSchema = z.object({
	count: z.number().optional(),
});

const CalendarCreateParamsSchema = z.object({
	summary: z.string(),
	description: z.string(),
	start: z.string(),
	end: z.string(),
});

const CalendarListParamsSchema = z.object({
	days: z.number().optional(),
});

type AddParams = z.infer<typeof AddParamsSchema>;
type GmailSendParams = z.infer<typeof GmailSendParamsSchema>;
type GmailReadParams = z.infer<typeof GmailReadParamsSchema>;
type CalendarCreateParams = z.infer<typeof CalendarCreateParamsSchema>;
type CalendarListParams = z.infer<typeof CalendarListParamsSchema>;

// 工具定义接口
interface Tool {
	name: string;
	description: string;
	schema: z.ZodType<any>;
	handler: (params: any) => Promise<any>;
}

// MCP服务器实现
export class MyMCP {
	private googleService: GoogleService;
	private tools: Map<string, Tool>;
	private name: string;
	private version: string;
	
	// Cloudflare Durable Object状态
	private state: DurableObjectState | null = null;

	constructor(state?: DurableObjectState, env?: any) {
		this.name = APP_CONFIG.serverName;
		this.version = APP_CONFIG.serverVersion;
		this.googleService = new GoogleService();
		this.tools = new Map();
		
		if (state) {
			this.state = state;
		}
		
		// 注册工具
		this.registerTools();
	}
	
	// 注册工具
	private registerTool(tool: Tool) {
		this.tools.set(tool.name, tool);
	}
	
	// 注册所有工具
	private registerTools() {
		// 添加工具
		this.registerTool({
			name: 'add',
			description: '将两个数字相加',
			schema: AddParamsSchema,
			handler: async (params: AddParams) => {
				return params.a + params.b;
			}
		});
		
		this.registerTool({
			name: 'name',
			description: '获取服务器名称',
			schema: z.object({}),
			handler: async () => {
				return this.name;
			}
		});
		
		this.registerTool({
			name: 'cloudflarePromise',
			description: '异步延迟响应示例',
			schema: z.object({}),
			handler: async () => {
				return new Promise<string>((resolve) => {
					setTimeout(() => {
						resolve('Hello from Cloudflare Worker!');
					}, 1000);
				});
			}
		});
		
		// Gmail 工具
		this.registerTool({
			name: 'gmailSend',
			description: '发送Gmail邮件',
			schema: GmailSendParamsSchema,
			handler: async (params: GmailSendParams) => {
				return this.googleService.sendEmail(
					params.to,
					params.subject,
					params.message
				);
			}
		});
		
		this.registerTool({
			name: 'gmailRead',
			description: '读取Gmail邮件',
			schema: GmailReadParamsSchema,
			handler: async (params: GmailReadParams) => {
				return this.googleService.readLatestEmails(params.count);
			}
		});
		
		// 日历工具
		this.registerTool({
			name: 'calendarCreate',
			description: '创建Google日历事件',
			schema: CalendarCreateParamsSchema,
			handler: async (params: CalendarCreateParams) => {
				return this.googleService.createCalendarEvent(
					params.summary,
					params.description,
					params.start,
					params.end
				);
			}
		});
		
		this.registerTool({
			name: 'calendarList',
			description: '列出Google日历事件',
			schema: CalendarListParamsSchema,
			handler: async (params: CalendarListParams) => {
				return this.googleService.listCalendarEvents(params.days);
			}
		});
	}
	
	// 获取工具列表
	getTools(): Tool[] {
		return Array.from(this.tools.values());
	}
	
	// 执行工具调用
	async executeToolCall(name: string, params: unknown) {
		const tool = this.tools.get(name);
		if (!tool) {
			throw new Error(`未知工具: ${name}`);
		}
		
		// 验证参数
		const validatedParams = tool.schema.parse(params);
		
		// 执行处理程序
		return await tool.handler(validatedParams);
	}

	async handleRequest(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const pathname = url.pathname;

		// 处理 OAuth 请求
		if (pathname.startsWith('/oauth')) {
			return this.handleOAuth(request);
		}

		// 处理MCP API请求
		if (pathname === API_PATHS.mcpEndpoint) {
			if (request.method !== 'POST') {
				return new Response('Method not allowed', { status: 405 });
			}

			try {
				const body = await request.json() as { name: string, params: unknown };
				const result = await this.executeToolCall(body.name, body.params);
				
				// 格式化响应
				return new Response(JSON.stringify({ result }), {
					headers: { 'Content-Type': 'application/json' },
				});
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				return new Response(JSON.stringify({ error: errorMessage }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				});
			}
		}

		// 处理工具列表API请求
		if (pathname === API_PATHS.toolsEndpoint) {
			const tools = this.getTools().map(tool => ({
				name: tool.name,
				description: tool.description
			}));
			
			return new Response(JSON.stringify({ tools }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// 默认返回工具列表页面
		return this.renderHomePage();
	}

	private renderHomePage(): Response {
		const tools = this.getTools();
		
		return new Response(
			`<!DOCTYPE html>
			<html lang="zh-CN">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>${this.name}</title>
					<style>
						body {
							font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
							line-height: 1.6;
							max-width: 900px;
							margin: 0 auto;
							padding: 20px;
							color: #333;
						}
						h1 {
							color: #2c3e50;
							border-bottom: 2px solid #eee;
							padding-bottom: 10px;
						}
						.tool {
							background: #f8f9fa;
							border-left: 4px solid #4285f4;
							padding: 12px;
							margin-bottom: 15px;
							border-radius: 0 4px 4px 0;
						}
						.tool h3 {
							margin: 0 0 8px 0;
						}
						.tool p {
							margin: 0;
							color: #555;
						}
						.badges {
							margin-bottom: 20px;
						}
						.badge {
							display: inline-block;
							background: #e0e0e0;
							border-radius: 12px;
							padding: 4px 10px;
							font-size: 12px;
							margin-right: 8px;
						}
						.badge.version {
							background: #4285f4;
							color: white;
						}
						footer {
							margin-top: 40px;
							border-top: 1px solid #eee;
							padding-top: 20px;
							font-size: 14px;
							color: #666;
						}
					</style>
				</head>
				<body>
					<h1>${this.name}</h1>
					<div class="badges">
						<span class="badge version">版本: ${this.version}</span>
						<span class="badge">环境: ${APP_CONFIG.environment}</span>
					</div>
					
					<h2>可用工具:</h2>
					
					${tools.map(tool => `
					<div class="tool">
						<h3>${tool.name}</h3>
						<p>${tool.description}</p>
					</div>
					`).join('')}
					
					<footer>
						&copy; ${new Date().getFullYear()} - 基于Cloudflare Worker构建
					</footer>
				</body>
			</html>`,
			{
				headers: { 'Content-Type': 'text/html; charset=UTF-8' },
			}
		);
	}

	private async handleOAuth(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const pathname = url.pathname;

		if (pathname === API_PATHS.oauthGmailCallback) {
			const code = url.searchParams.get('code');
			if (!code) {
				return new Response('Missing code parameter', { status: 400 });
			}
			const tokens = await this.googleService.getToken(code);
			return new Response(JSON.stringify({ tokens }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		if (pathname === API_PATHS.oauthGmail) {
			const authUrl = this.googleService.getAuthUrl();
			return Response.redirect(authUrl, 302);
		}

		return new Response('Not found', { status: 404 });
	}
	
	// Cloudflare Worker处理请求的入口点
	async fetch(request: Request): Promise<Response> {
		return this.handleRequest(request);
	}
}

interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  MCP_OBJECT: {
    idFromName: (name: string) => DurableObjectId;
    get: (id: DurableObjectId) => DurableObjectStub;
  };
}

// 创建OAuth配置
const oauthConfig = {
	gmail: {
		scopes: [
			'https://www.googleapis.com/auth/gmail.send',
			'https://www.googleapis.com/auth/gmail.readonly'
		]
	},
	calendar: {
		scopes: [
			'https://www.googleapis.com/auth/calendar',
			'https://www.googleapis.com/auth/calendar.events'
		]
	}
};

// 导出Worker默认处理函数
export default {
	fetch: (request: Request, env: Env, ctx: any) => {
		// 创建或获取Durable Object实例
		const id = env.MCP_OBJECT.idFromName('default');
		const mcpObject = env.MCP_OBJECT.get(id);
		
		// 将请求转发到Durable Object
		return mcpObject.fetch(request);
	},
	// 导出OAuth配置
	googleOAuth: oauthConfig
};