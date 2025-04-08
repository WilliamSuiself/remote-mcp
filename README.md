# Remote MCP

Remote MCP 是一个基于 Cloudflare Workers 的远程控制面板服务。

## 功能特点

- 基于 Cloudflare Workers 构建
- 支持 Google OAuth2.0 认证
- 提供 API 接口服务
- 支持跨域请求
- 集成 Gmail 发送和读取功能
- 集成 Google Calendar 事件创建和列表查询功能

## MCP工具

本服务提供以下MCP工具：

1. **基础工具**
   - `add` - 简单的加法运算
   - `name` - 获取服务器名称
   - `cloudflarePromise` - 测试Cloudflare异步功能

2. **Gmail工具**
   - `gmailSend` - 发送Gmail邮件
   - `gmailRead` - 读取最新的Gmail邮件

3. **Calendar工具**
   - `calendarCreate` - 创建Google Calendar事件
   - `calendarList` - 列出Google Calendar事件

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

## OAuth2.0认证流程

1. 重定向用户到 `/oauth/gmail` 进行授权
2. 用户确认后会被重定向到 `/oauth/gmail/callback?code=xxxx`
3. 系统处理授权码并获取访问令牌
4. 使用访问令牌调用Gmail和Calendar API

## 技术栈

- Cloudflare Workers
- TypeScript
- Zod 类型验证
- Google OAuth2.0
- Google Gmail API
- Google Calendar API

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License