---
version: 1.0.0
last_updated: 2026-03-12
maintainer: Codex
---

# PLANS.md

## 当前目标
完成 ChatFile Demo 的文档初始化、前端工程搭建、核心交互实现与本地自测截图留档。

## 分阶段计划

### Phase 1: 文档与规范
- 整理参考资料
- 初始化项目规范文档
- 建立改进意见记录

### Phase 2: 工程初始化
- 初始化 Next.js 15 + TypeScript + Tailwind 项目
- 接入必要依赖：Zustand、Shadcn/UI 基础能力、测试工具
- 建立目录结构与 mock 数据层

### Phase 3: MVP 实现
- 上传与解析流程 UI
- 文档就绪态摘要和推荐问题
- 聊天区流式回答、引用来源、反馈交互
- PDF 预览区、目录面板、引用跳转联动

### Phase 4: 验证与收尾
- 单测与 e2e
- 浏览器截图留档
- 更新 README、CHANGELOG、改进意见

## 当前默认假设
- 无真实后端，采用本地 mock 数据。
- PDF 预览可先使用演示资源和锚点高亮模拟。
- 首版目标是高保真交互演示，不追求真实 PDF 解析和向量检索。
