import { z } from 'zod';
import { GoogleService } from './services/google.js';

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

interface RequestBody {
  tool: string;
  params: unknown;
}

class MyMCP {
  private googleService: GoogleService;
  private serverName: string;
  private version: string;

  constructor(name: string, version: string) {
    this.serverName = name;
    this.version = version;
    this.googleService = new GoogleService();
  }

  async handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname.startsWith('/oauth')) {
      return this.handleOAuth(request);
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const body = await request.json() as RequestBody;
      const result = await this.executeToolCall(body.tool, body.params);
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

  private async executeToolCall(tool: string, params: unknown) {
    switch (tool) {
      case 'add':
        const addParams = AddParamsSchema.parse(params);
        return addParams.a + addParams.b;

      case 'name':
        return this.serverName;

      case 'cloudflarePromise':
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve('Hello from Cloudflare Worker!');
          }, 1000);
        });

      case 'gmailSend':
        const gmailParams = GmailSendParamsSchema.parse(params);
        return await this.googleService.sendEmail(
          gmailParams.to,
          gmailParams.subject,
          gmailParams.message
        );

      case 'gmailRead':
        const readParams = GmailReadParamsSchema.parse(params);
        return await this.googleService.readLatestEmails(readParams.count);

      case 'calendarCreate':
        const calendarParams = CalendarCreateParamsSchema.parse(params);
        return await this.googleService.createCalendarEvent(
          calendarParams.summary,
          calendarParams.description,
          calendarParams.start,
          calendarParams.end
        );

      case 'calendarList':
        const listParams = CalendarListParamsSchema.parse(params);
        return await this.googleService.listCalendarEvents(listParams.days);

      default:
        throw new Error(`Unknown tool: ${tool}`);
    }
  }

  private async handleOAuth(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/oauth/gmail/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing code parameter', { status: 400 });
      }
      const tokens = await this.googleService.getToken(code);
      return new Response(JSON.stringify({ tokens }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (pathname === '/oauth/gmail') {
      const authUrl = this.googleService.getAuthUrl();
      return Response.redirect(authUrl, 302);
    }

    return new Response('Not found', { status: 404 });
  }
}

const mcp = new MyMCP('Demo', '1.0.0');

export default {
  fetch: (request: Request) => mcp.handleRequest(request),
};