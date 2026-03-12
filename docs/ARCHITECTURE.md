---
version: 1.0.0
last_updated: 2026-03-12
maintainer: Codex
---

# ARCHITECTURE.md

## 1. 文档目的
定义 ChatFile Demo 的系统边界、目录分层、依赖方向和 mock BFF 结构，保证 AI 能在清晰契约下持续迭代。

## 2. 项目概览
- 项目名称：ChatFile Demo
- 业务目标：上传单个 PDF 后完成解析状态展示、摘要推荐、问答交互、引用跳转和 PDF 预览联动
- 当前阶段：前端 MVP Demo
- 核心技术栈：Next.js 15 App Router、TypeScript、Tailwind、Shadcn/UI、Zustand、Playwright、Vitest

## 3. 架构原则
- 以前端体验为中心，后端依赖通过 BFF mock 封装。
- 业务按上传、对话、预览三个核心域拆分。
- 依赖方向单向流动，页面只做装配。
- 异步边界统一做类型定义和状态转换。
- UI 演示优先完整交互链路，再扩展真实能力。

## 4. 目录结构
```txt
src/
├── app/                 # 路由、layout、providers、route handlers
├── features/
│   ├── upload/          # 上传与解析流程
│   ├── chat/            # 对话区、消息流、反馈
│   └── preview/         # PDF 预览、目录、高亮跳转
├── entities/
│   ├── document/        # 文档元数据、解析状态、引用类型
│   └── message/         # 消息与反馈领域模型
├── shared/
│   ├── api/             # mock BFF 客户端与 route 协议
│   ├── config/          # design tokens、常量
│   ├── lib/             # 工具函数
│   ├── stores/          # Zustand store
│   └── ui/              # 基础组件
└── generated/           # 预留自动生成目录
```

## 5. 分层规则
推荐依赖方向：
```txt
app -> features -> entities -> shared
```

约束：
- `shared` 不能依赖 `features` 和 `entities`。
- `entities` 不能依赖页面实现。
- `features` 之间通过 `entities` 类型或 `shared` 协调，不直接调用内部私有模块。
- `app` 不写业务逻辑，只做装配、路由和 route handler 暴露。

## 6. 数据边界
- 上传、解析进度、摘要、问答结果都先经过 `shared/api` 类型化。
- 所有 mock 响应结构在 route handler 内转换成前端友好格式。
- 页面组件不直接处理原始 `FormData` 或未校验 JSON。

## 7. 状态划分
- 全局状态：当前文档、解析状态、聊天记录、预览跳转目标、布局折叠状态。
- 页面级状态：拖拽上传态、反馈面板显隐、发送中输入、目录面板显隐。
- 表单状态：问题输入、反馈标签和补充说明。
- 服务端状态：文档详情、推荐问题、聊天回答流，由 mock BFF 产生。

## 8. 核心约束
- 不接真实第三方服务前，不引入重量级数据层。
- 问答检索必须显式带 `docId`，避免跨文档语义泄漏。
- 所有异步流程都必须有 loading、success、error、empty 分支。
- PDF 预览跳转采用可替换实现，当前允许基于 mock page anchor。

## 9. 新功能落点指南
1. 上传和解析链路改动落 `features/upload`。
2. 问答生成、流式渲染和反馈落 `features/chat`。
3. 预览联动、目录、缩放落 `features/preview`。
4. 跨模块共享的类型落 `entities/*`。
5. 基础 UI 和工具落 `shared/*`。

## 10. 质量与守门
- 类型与 lint 作为架构守门第一层。
- 关键纯逻辑使用 Vitest。
- 上传到问答主链路使用 Playwright 截图验证。
- 任何新模式都要回写文档。
