# Remote MCP

Remote MCP 是一个基于 Cloudflare Workers 的远程控制面板服务。

## 功能特点

- 基于 Cloudflare Workers 构建
- 支持 Google OAuth2.0 认证
- 提供 API 接口服务
- 支持跨域请求

## 快速开始

1. 克隆仓库：
```bash
git clone https://github.com/WilliamSuiself/remote-mcp.git
cd remote-mcp
```

2. 安装依赖：
```bash
npm install
```

3. 本地开发：
```bash
npm run dev
```

4. 构建部署：
```bash
npm run build
npm run deploy
```

## 环境变量

项目需要以下环境变量：

- `GOOGLE_CLIENT_ID`: Google OAuth 客户端 ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth 客户端密钥
- `GOOGLE_REDIRECT_URI`: OAuth 回调 URL

## 技术栈

- Cloudflare Workers
- TypeScript
- Hono Framework
- Google OAuth2.0

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License