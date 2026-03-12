---
version: 1.0.0
last_updated: 2026-03-12
maintainer: Codex
---

# CLAUDE.md

> 面向本项目 AI 执行者的具体工作说明。

## 指令优先级
1. 项目规范文档：`AGENTS.md`、`docs/*`
2. 当前任务上下文中的用户要求
3. 已安装技能说明
4. 默认知识

## 开始前先读
1. `AGENTS.md`
2. `docs/PLANS.md`
3. 按需阅读：
   - UI 开发：`docs/FRONTEND.md` + `docs/DESIGN.md`
   - 状态流改动：`docs/frontend/state.md`
   - Mock/BFF：`docs/frontend/api.md`
   - 验收：`docs/QUALITY.md`

## 默认工作原则
- 最小改动，不做无关重构。
- 先建立契约，再扩展实现。
- 前端优先保证状态完整和交互连贯。
- 自测必须看实际页面效果与截图，不只依赖命令。
- 发现机制问题立刻补充到 `改进意见.md`。

## 问题记录机制
- 遇到架构冲突、需求缺口、阻塞性不确定项，先写入 `CHANGELOG.md` 的待决策章节，再继续能确定的部分。
- 常规 bug 修复和样式调整不需要升级为人工决策。

## 文件修改规则
- 允许修改：业务代码、测试、相关文档。
- 禁止修改：生成文件、无关模块、未确认的全局配置。
- 新增模式时同步更新文档。

## 校验要求
- UI 改动：`pnpm lint && pnpm typecheck`
- 逻辑改动：`pnpm lint && pnpm typecheck && pnpm test`
- 跨页面流程改动：`pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e`

## 本项目常见坑位
- 当前项目无真实后端，所有异步行为要明确标注 mock 边界。
- 文档问答必须严格按当前文档过滤，不能出现跨文档设定。
- PDF 预览与引用跳转允许 mock，但交互链路必须完整可演示。
- 开发服务启动前先检查端口占用和现有进程。

## 输出要求
- 先说明用户可感知变化，再补一句实现方式。
- 如果未运行测试或截图验证，必须直接说明。
