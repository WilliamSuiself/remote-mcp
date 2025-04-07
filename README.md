# Remote MCP Server on Cloudflare

Let's get a remote MCP server up-and-running on Cloudflare Workers complete with OAuth login!

## Available MCP Services
* **add** - 提供简单的加法运算功能
* **provide-name** - 随机返回一个名字（从预定义列表："Tom"、"William"、"Jones"、"Gates"、"Tom"中选择）
* **cloudflare_promise** - 返回Cloudflare的隐私承诺，不需要任何参数

### Gmail Services
* **gmail_send** - 发送Gmail邮件
  - 参数：
    - to: 收件人邮箱地址
    - subject: 邮件主题
    - message: 邮件内容
* **gmail_read_latest** - 读取最新的Gmail邮件
  - 参数：
    - count: (可选) 要读取的邮件数量，默认为5

### Google Calendar Services
* **calendar_create_event** - 创建日历事件
  - 参数：
    - summary: 事件标题
    - description: (可选) 事件描述
    - start: 开始时间
    - end: 结束时间
* **calendar_list_events** - 读取日历事件
  - 参数：
    - days: (可选) 要读取未来几天的事件，默认为7天

## 使用前准备
1. 在[Google Cloud Console](https://console.cloud.google.com/)创建项目
2. 启用Gmail API和Google Calendar API
3. 创建OAuth 2.0凭据
4. 设置授权重定向URI
5. 配置必要的环境变量：
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET

## Develop locally

```bash
# clone the repository
git clone git@github.com:cloudflare/ai.git

# install dependencies
cd ai
npm install

# run locally
npx nx dev remote-mcp-server
```

You should be able to open [`http://localhost:8787/`](http://localhost:8787/) in your browser