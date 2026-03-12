---
version: 1.0.0
last_updated: 2026-03-12
maintainer: Codex
---

# api.md

## API 分层
- `app/api/*`：Next.js Route Handlers，承担 mock BFF 职责。
- `shared/api/client.ts`：统一请求入口。
- `features/*/api`：业务域请求封装。

## 本项目接口建议
- `POST /api/document/upload`
- `GET /api/document/:id`
- `GET /api/document/:id/recommendations`
- `POST /api/chat`
- `POST /api/feedback`

## 约束
- 所有请求和响应都定义 TypeScript 类型。
- 流式回答统一由 BFF 输出前端可消费的文本块流。
- 失败响应包含可展示错误文案和 requestId。
