# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

React 19 + Vite + TypeScript 企业级模板项目，使用 Ant Design 6 作为 UI 框架，Tailwind CSS 4 作为样式方案，Zustand 作为状态管理。

## 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm lint         # ESLint 检查
```

## 架构概述

### 路径别名
- `@/*` → `src/*`
- `@views/*` → `src/views/*`

### 核心配置文件
- `project.config.ts` - 项目配置（基础路径 `/react`、API 前缀、登录模式等）
- `vite.config.ts` - Vite 构建配置（代理、插件、分包策略）

### 路由结构 (`src/router/index.tsx`)
- 主布局路由 `/` - 包含系统管理、业务模块等
- 认证路由 `/auth/*` - 登录、注册、忘记密码等
- 权限控制：基于 `userStore` 的权限列表过滤菜单
- 路由 loader 中获取用户信息

### 状态管理 (`src/store/index.ts`)
使用 `useSyncExternalStore` 模式的自定义 userStore：
```typescript
userStore.set({...})        // 设置用户信息
userStore.fetch()           // 异步获取用户信息
userStore.getSnapshot()     // 获取当前状态
```

### API 封装 (`src/util/api.ts`)
`baseFetch()` 函数 - 统一的请求封装：
- 支持 GET/POST、JSON/FormData
- 支持文件下载、mock 数据、请求中断
- 响应格式：`{ code: 200, msg?: string, data: {...} }`

### 布局组件 (`src/views/layout-page/`)
- `LayoutPageContent.tsx` - 主布局容器
- `menuRouteListToMenuComp.ts` - 根据路由配置生成 Ant Design 菜单

### 通用组件 (`src/components/`)
- `base-form/useBaseForm.ts` - 表单状态管理 Hook
- `base-table/useBaseTable.ts` - 表格状态管理 Hook
- `base-dialog/useFeedback.ts` - 对话框反馈 Hook
- `base-fullscreen/` - 全屏组件及状态
- `draggable-modal/` - 可拖拽对话框

### 工具函数 (`src/util/`)
- `api.ts` - 请求封装
- `excel.ts` - Excel 导入导出
- `file.ts` - 文件操作
- `tree.ts` - 树形结构处理
- `hooks/useBaseFetch.ts` - 数据获取 Hook

## 代码风格

- 单引号，无分号，2 空格缩进
- 尾逗号允许（便于 diff）
- 以 `_` 开头的变量忽略未使用警告
- TypeScript 非严格模式，允许 any 类型

## 开发代理

- `/api` → `http://localhost:8080`
- `/mock` → `http://localhost:3000`