# Changelog

## [Unreleased]
### 添加
- 新增`provide-name`服务，随机返回一个名字（从预定义列表中选择）
- 新增`cloudflare_promise`服务，返回Cloudflare的隐私承诺
- 新增Gmail服务：
  - `gmail_send`: 发送Gmail邮件
  - `gmail_read_latest`: 读取最新的Gmail邮件
- 新增Google Calendar服务：
  - `calendar_create_event`: 创建日历事件
  - `calendar_list_events`: 读取日历事件
### 优化
- 优化`provide-name`服务的实现，增加错误处理和日志
### 依赖
- 添加`googleapis`包用于Google服务集成
- 添加`@google-cloud/local-auth`包用于本地认证