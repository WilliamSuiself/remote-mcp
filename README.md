# Remote MCP Server

这是一个基于Cloudflare Worker的MCP (Model Context Protocol) 服务器，用于提供各种工具API，包括Gmail、Google Calendar等功能。该项目使用TypeScript开发，并使用Cloudflare Durable Objects实现状态持久化。

## 功能特性

- **基础工具**：
  - 简单的数学计算功能
  - 服务器信息查询
  - 异步Promise示例

- **Google服务集成**：
  - Gmail邮件发送与读取
  - Google Calendar事件创建与列表查询

- **OAuth认证**：
  - 支持Google OAuth 2.0认证流程
  - 通过Cloudflare Worker处理OAuth回调
  
- **Durable Objects**:
  - 使用Cloudflare Durable Objects存储状态
  - 支持多实例无缝扩展

- **自定义工具管理**:
  - 动态工具注册和管理
  - 使用Map和接口实现工具调用

## 更新日志

最近更新（v0.4.0）:
- 重构了MCP服务器实现，不再依赖外部库
- 优化了工具的定义和处理方式，使用接口和Map结构管理工具
- 添加了`/api/tools`端点用于以JSON格式列出所有可用工具
- 优化了首页展示，动态生成工具列表

## 项目结构

```
remote-mcp-server/
├── src/
│   ├── index.ts        # 主入口文件，定义MCP服务和工具实现
│   ├── app.ts          # Hono应用实现，处理OAuth认证流程
│   ├── config.ts       # 配置文件，包含OAuth和应用配置
│   ├── types.d.ts      # 类型定义文件
│   ├── utils.ts        # 工具函数
│   └── services/
│       └── google.ts   # Google服务实现
├── static/             # 静态资源文件
├── dist/               # 编译输出目录
├── tsconfig.json       # TypeScript配置
├── wrangler.jsonc      # Cloudflare Worker配置
└── package.json        # 项目依赖
```

## 环境要求

- Node.js 18+
- Cloudflare账户
- Wrangler CLI (`npm install -g wrangler`)
- Google Cloud项目和API凭证

## 安装与设置

1. **克隆仓库并安装依赖**

```bash
git clone https://github.com/WilliamSuiself/remote-mcp.git
cd remote-mcp
npm install
```

2. **配置环境变量**

在Cloudflare Worker中设置以下环境变量：

- `GOOGLE_CLIENT_ID`: Google OAuth客户端ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth客户端密钥
- `GOOGLE_REDIRECT_URI`: OAuth重定向URI (默认: `http://localhost:8787/oauth/gmail/callback`)
- `SERVER_NAME`: 服务器名称 (可选)
- `SERVER_VERSION`: 服务器版本 (可选)

3. **创建KV命名空间**

```bash
wrangler kv:namespace create OAUTH_KV
```

然后将生成的ID复制到`wrangler.jsonc`文件中。

4. **开发模式**

```bash
npm run dev
```

5. **部署**

```bash
npm run deploy
```

## 使用指南

### 工具API

该服务器提供以下工具API:

1. **add** - 将两个数字相加
   - 参数: `a`, `b` (数字)
   - 返回: 计算结果

2. **name** - 返回服务器名称
   - 无参数
   - 返回: 服务器名称字符串

3. **cloudflarePromise** - 异步延迟响应示例
   - 无参数
   - 返回: 延迟消息

4. **gmailSend** - 发送Gmail邮件
   - 参数: `to`, `subject`, `message`
   - 返回: 发送结果

5. **gmailRead** - 读取Gmail邮件
   - 参数: `count` (可选，默认10)
   - 返回: 邮件列表

6. **calendarCreate** - 创建日历事件
   - 参数: `summary`, `description`, `start`, `end`
   - 返回: 创建的事件信息

7. **calendarList** - 列出日历事件
   - 参数: `days` (可选，默认7)
   - 返回: 事件列表

### API端点

- **`/api/mcp`** - 主要的MCP API端点，接收工具调用请求
- **`/api/tools`** - 返回所有可用工具的列表
- **`/oauth/gmail`** - Gmail OAuth授权端点
- **`/oauth/gmail/callback`** - Gmail OAuth回调端点

### API请求示例

```javascript
// 调用工具示例
fetch('https://your-worker.workers.dev/api/mcp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'gmailSend',
    params: {
      to: 'recipient@example.com',
      subject: 'Test Email',
      message: 'Hello from Remote MCP!'
    }
  })
})
.then(response => response.json())
.then(data => console.log(data));

// 获取工具列表
fetch('https://your-worker.workers.dev/api/tools')
  .then(response => response.json())
  .then(data => console.log(data.tools));
```

## 开发注意事项

- 使用 `npm run build` 编译项目
- TypeScript编译输出位于 `dist/` 目录
- 使用 `npm run lint:fix` 修复代码格式问题
- 所有导入的模块路径应该包含`.js`扩展名，以支持ESM

## 贡献指南

欢迎提交Pull Request或Issue来改进此项目。请确保您的代码通过了格式检查并遵循项目的编码规范。

## 许可证

MIT

---

**注意**: 在使用Google API之前，确保您已在Google Cloud Console中创建了项目并启用了相应的API。