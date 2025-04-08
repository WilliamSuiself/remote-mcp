# Remote MCP Server

这是一个基于Cloudflare Worker的MCP (Model Context Protocol) 服务器，用于提供各种工具API，包括Gmail、Google Calendar等功能。该项目使用TypeScript开发，并使用@remote-mcp/server库来简化MCP服务器的实现。

## 功能特性

- Google服务集成
  - Gmail发送和阅读邮件
  - Google日历事件管理
- OAuth2认证流程
- 基于Cloudflare Workers的部署

## 安装

克隆仓库并安装依赖：

```bash
git clone https://github.com/WilliamSuiself/remote-mcp.git
cd remote-mcp
npm install
```

## 配置

1. 确保在`src/config.ts`中设置了正确的Google OAuth2凭据：
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`

2. 根据需要调整其他配置参数，如端口号和API路径。

## 构建和部署

### 本地开发

```bash
# 编译TypeScript代码
npm run build

# 启动开发服务器
npm run dev
```

### 部署到Cloudflare Workers

```bash
# 编译并部署
npm run build
npm run deploy
```

## 项目结构

```
remote-mcp/
├── src/
│   ├── index.ts          # 主入口文件，定义了MyMCP类和请求处理逻辑
│   ├── config.ts         # 配置文件，包含OAuth和应用设置
│   ├── services/
│   │   └── google.ts     # Google服务实现（Gmail和Calendar）
├── dist/                 # 编译后的JavaScript文件
├── build.js              # 构建脚本
├── wrangler.jsonc        # Cloudflare Wrangler配置
└── tsconfig.json         # TypeScript配置
```

## API端点

- `/oauth/gmail` - Gmail的OAuth认证入口
- `/oauth/calendar` - Google Calendar的OAuth认证入口
- `/api/tools` - 可用工具列表
- `/` - 主页，显示可用工具

## 排障指南

如果遇到构建或部署问题：

1. 确保TypeScript编译成功，并检查`dist`目录中是否存在编译后的文件
2. 验证`wrangler.jsonc`中的`main`字段指向正确的入口文件 (`dist/index.js`)
3. 检查OAuth配置是否正确设置

## 贡献

欢迎提交Issue和Pull Request。

## 许可证

ISC