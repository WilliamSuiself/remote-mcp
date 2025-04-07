import { Hono } from 'hono';
import { z } from 'zod';
import { google } from 'googleapis';

const app = new Hono();

// 定义MCP工具接口
interface Tool {
  name: string;
  description: string;
  schema: z.ZodType<any>;
  handler: (params: any) => Promise<{ content: Array<{ type: string; text: string }> }>;
}

// 工具列表
const tools: Tool[] = [
  {
    name: 'add',
    description: '将两个数字相加',
    schema: z.object({ a: z.number(), b: z.number() }),
    handler: async ({ a, b }) => ({
      content: [{ type: 'text', text: String(a + b) }],
    }),
  },
  {
    name: 'provide-name',
    description: '随机返回一个名字，不需要任何参数',
    schema: z.object({}),
    handler: async () => {
      try {
        console.log('provide-name工具被调用');
        const names = ['Tom', 'William', 'Jones', 'Gates', 'Tom'];
        const randomIndex = Math.floor(Math.random() * names.length);
        const selectedName = names[randomIndex];
        console.log('返回的名字:', selectedName);
        
        return {
          content: [{ type: 'text', text: selectedName }],
        };
      } catch (error) {
        console.error('provide-name工具出错:', error);
        return {
          content: [{ type: 'text', text: '生成名字时出错' }],
        };
      }
    },
  },
  {
    name: 'cloudflare_promise',
    description: '返回Cloudflare的隐私承诺，不需要任何参数',
    schema: z.object({}),
    handler: async () => {
      try {
        console.log('cloudflare_promise工具被调用');
        const promise = 'Our mission to help build a better Internet is rooted in the importance we place on establishing trust with our Customers, users, and the Internet community globally. To earn and maintain that trust, we commit to communicating transparently, providing security, and protecting the privacy of data on our systems. We keep your personal information personal and private. We will not sell or rent your personal information. We will only share or otherwise disclose your personal information as necessary to provide our Services or as otherwise described in this Policy, except in cases where we first provide you with notice and the opportunity to consent.';
        
        return {
          content: [{ type: 'text', text: promise }],
        };
      } catch (error) {
        console.error('cloudflare_promise工具出错:', error);
        return {
          content: [{ type: 'text', text: '获取Cloudflare承诺时出错' }],
        };
      }
    },
  },
  {
    name: 'gmail_send',
    description: '发送Gmail邮件，需要提供收件人、主题和内容',
    schema: z.object({
      to: z.string(),
      subject: z.string(),
      message: z.string(),
    }),
    handler: async ({ to, subject, message }) => {
      try {
        console.log('gmail_send工具被调用');
        // TODO: 实现Gmail发送逻辑
        return {
          content: [{ type: 'text', text: `邮件已发送到 ${to}` }],
        };
      } catch (error) {
        console.error('gmail_send工具出错:', error);
        return {
          content: [{ type: 'text', text: '发送邮件时出错' }],
        };
      }
    },
  },
  {
    name: 'gmail_read_latest',
    description: '读取最新的Gmail邮件，可选参数count指定读取数量',
    schema: z.object({
      count: z.number().optional(),
    }),
    handler: async ({ count = 5 }) => {
      try {
        console.log('gmail_read_latest工具被调用');
        // TODO: 实现Gmail读取逻辑
        return {
          content: [{ type: 'text', text: `已读取最新的 ${count} 封邮件` }],
        };
      } catch (error) {
        console.error('gmail_read_latest工具出错:', error);
        return {
          content: [{ type: 'text', text: '读取邮件时出错' }],
        };
      }
    },
  },
  {
    name: 'calendar_create_event',
    description: '在Google Calendar中创建新事件，需要提供事件标题、开始时间和结束时间',
    schema: z.object({
      summary: z.string(),
      description: z.string().optional(),
      start: z.string(),
      end: z.string(),
    }),
    handler: async ({ summary, description = '', start, end }) => {
      try {
        console.log('calendar_create_event工具被调用');
        // TODO: 实现Calendar创建事件逻辑
        return {
          content: [{ type: 'text', text: `已创建日历事件: ${summary}` }],
        };
      } catch (error) {
        console.error('calendar_create_event工具出错:', error);
        return {
          content: [{ type: 'text', text: '创建日历事件时出错' }],
        };
      }
    },
  },
  {
    name: 'calendar_list_events',
    description: '读取Google Calendar中的事件，可选参数days指定读取未来几天的事件',
    schema: z.object({
      days: z.number().optional(),
    }),
    handler: async ({ days = 7 }) => {
      try {
        console.log('calendar_list_events工具被调用');
        // TODO: 实现Calendar读取事件逻辑
        return {
          content: [{ type: 'text', text: `已读取未来 ${days} 天的日历事件` }],
        };
      } catch (error) {
        console.error('calendar_list_events工具出错:', error);
        return {
          content: [{ type: 'text', text: '读取日历事件时出错' }],
        };
      }
    },
  },
];

// MCP服务器路由
app.post('/mcp', async (c) => {
  try {
    const body = await c.req.json();
    const { tool: toolName, parameters } = body;

    const tool = tools.find((t) => t.name === toolName);
    if (!tool) {
      return c.json({ error: '工具不存在' }, 404);
    }

    try {
      const validatedParams = tool.schema.parse(parameters);
      const result = await tool.handler(validatedParams);
      return c.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ error: '参数验证失败', details: error.errors }, 400);
      }
      throw error;
    }
  } catch (error) {
    console.error('MCP服务器错误:', error);
    return c.json({ error: '服务器内部错误' }, 500);
  }
});

// 工具列表路由
app.get('/tools', (c) => {
  const toolList = tools.map(({ name, description, schema }) => ({
    name,
    description,
    parameters: schema.description,
  }));
  return c.json(toolList);
});

export default app;