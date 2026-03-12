# 样式开发规范

> 当样式复杂度增加时，从 FRONTEND.md 拆分到此文件。

## 核心原则

- **Design Tokens 优先**：使用设计令牌，不硬编码
- **单一方案**：不混用多套样式系统
- **组件化**：样式跟随组件，避免全局污染
- **响应式**：统一断点，移动端优先

## Design Tokens

```css
/* 颜色 */
--color-primary: #3b82f6;
--color-danger: #ef4444;
--color-text: #1f2937;
--color-bg: #ffffff;

/* 间距 */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-4: 1rem;
--space-8: 2rem;

/* 圆角 */
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 1rem;
```

## Tailwind 使用规范

```tsx
// ✅ 使用 Tailwind + Tokens
<button className="bg-primary text-white px-4 py-2 rounded-md">
  提交
</button>

// ❌ 避免：硬编码颜色
<button style={{ backgroundColor: '#3b82f6' }}>
  提交
</button>
```

## 响应式断点

```tsx
// 统一断点
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
}

// Tailwind 响应式
<div className="w-full md:w-1/2 lg:w-1/3">
  内容
</div>
```

## 禁止事项

- 不在组件内硬编码品牌色
- 不混用 Tailwind 和传统 CSS Modules
- 不使用内联样式（除非动态计算）
