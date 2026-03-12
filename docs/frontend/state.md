---
version: 1.0.0
last_updated: 2026-03-12
maintainer: Codex
---

# state.md

## 状态分类
- 局部状态：输入内容、反馈面板开关、目录抽屉开关、拖拽悬浮态。
- 全局状态：当前文档、解析阶段、聊天消息、当前高亮引用、布局折叠状态。
- 服务端状态：摘要、推荐问题、mock 聊天回答、目录数据。

## Zustand store 约束
- 一个根 store 管当前会话即可，避免过早拆多个 store。
- Action 命名使用动词：`setDocument`、`appendMessage`、`jumpToCitation`。
- 长链路状态变化通过 action 串联，不在多个组件里各写一套。

## 状态来源原则
- 能推导出来的状态不重复存储。
- `docId` 是所有问答和引用的主过滤键。
- 最近 10 轮消息保留在主列表，旧消息折叠策略交由 selector 计算。
