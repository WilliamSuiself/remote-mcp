# Remote MCP 服务器

这是一个基于Cloudflare Worker的MCP (Model Context Protocol) 服务器，用于提供各种工具API，包括Gmail、Google Calendar等功能。该项目使用TypeScript开发，并使用@remote-mcp/server库来简化MCP服务器的实现。

## 功能特点

- 基于 Cloudflare Workers 的无服务器架构
- 提供Gmail邮件发送和读取功能
- 提供Google Calendar事件创建和列表功能
- 集成OAuth2认证
- 使用Durable Objects进行状态管理

## 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/remote-mcp-server.git
cd remote-mcp-server

# 安装依赖
npm install
```

## 配置

### OAuth 配置

1. 在 [Google Cloud Console](https://console.cloud.google.com/) 创建一个项目
2. 启用 Gmail API 和 Google Calendar API
3. 创建 OAuth 客户端ID和密钥
4. 修改 `src/config.ts` 文件中的 OAuth 配置

```typescript
export const GOOGLE_OAUTH_CONFIG = {
  clientId: '你的客户端ID',
  clientSecret: '你的客户端密钥',
  redirectUri: 'https://your-worker.your-subdomain.workers.dev/oauth/gmail/callback',
  scopes: [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ]
};
```

### Cloudflare KV 命名空间配置

对于生产环境，你需要配置KV命名空间来存储OAuth令牌：

1. 在Cloudflare Dashboard创建KV命名空间
2. 获取KV命名空间ID
3. 取消注释`wrangler.jsonc`中的KV配置部分，并添加你的命名空间ID：

```json
"kv_namespaces": [
  {
    "binding": "OAUTH_KV",
    "id": "你的KV命名空间ID"
  }
]
```

## 构建和部署

### 本地开发

```bash
# 运行开发服务器
npm run dev
```

### 部署到Cloudflare Workers

```bash
# 构建并部署
npm run deploy
```

## 项目结构

```
remote-mcp-server/
├── src/                  # 源代码
│   ├── index.ts          # 主入口文件
│   ├── config.ts         # 配置文件
│   ├── services/         # 服务实现
│   │   └── google.ts     # Google服务(Gmail, Calendar)
│   └── utils.ts          # 工具函数
├── dist/                 # 编译后的文件
├── static/               # 静态资源
├── build.js              # 构建脚本
└── wrangler.jsonc        # Cloudflare Workers配置
```

## API端点

- `/tools` - 获取可用工具列表
- `/api/mcp` - MCP API端点
- `/oauth/gmail` - Gmail OAuth认证
- `/oauth/gmail/callback` - Gmail OAuth回调

## 故障排除

### 常见问题

- **部署错误 - KV命名空间无效**: 确保在`wrangler.jsonc`中配置了正确的KV命名空间ID，或者暂时注释掉KV配置部分进行测试部署
- **OAuth错误**: 检查重定向URI是否正确配置在Google Cloud Console和项目配置中
- **编译错误**: 确保TypeScript配置中`noEmit`设置为`false`，允许生成JavaScript文件

### 日志和调试

使用Cloudflare Workers控制台查看日志和调试信息。

## 贡献指南

1. Fork仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

MIT