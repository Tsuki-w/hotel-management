# 酒店管理后台系统

> **线上体验地址**: [http://39.97.235.227](http://39.97.235.227)
>
> **注意**: 由于域名备案问题，线上环境目前无法使用 PWA 功能。如果想在本地体验 PWA 离线访问和安装功能，请在 `vite.config.ts` 中注释掉 `selfDestroying: true` 配置。

这是一个专为酒店设计的内部管理后台应用。该系统允许酒店员工高效地管理预订、房间、住客信息，并实时查看酒店运营的统计数据。

## ✨ 功能特性

- 📊 仪表盘 (Dashboard)
  - 实时概览关键指标（预订数、销售额、入住率等）。

  - 可视化销售统计和入住时长分布图表。

  - 实时展示今日待处理的入住和退房活动。

- 🏠 房间管理 (Cabins)
  - 查看房间列表及其详细信息（容量、价格、折扣）。

  - 创建、编辑、复制和删除房间。

  - 支持上传和管理房间图片。

- 📅 预订管理 (Bookings)
  - 查看所有预订的详细列表。

  - 支持按状态（未入住、已入住、已退房）筛选和按金额/日期排序。

  - 处理住客入住和退房流程。

  - 预订详情查看与管理。

- 🔐 身份认证 (Authentication)
  - 仅限授权员工访问系统。

  - 个人资料更新（头像、密码）。

- ⚙️ 系统设置 (Settings)
  - 灵活配置全局参数：早餐价格、最小/最大预订天数、最大人数等。

- 🎨 用户体验
  - 暗黑模式: 支持一键切换明亮/暗黑主题。

  - 交互反馈: 使用 Toast 通知提供操作反馈。

## 🛠️ 技术栈

本项目使用现代前端技术栈构建：

- 核心框架: React 19 + TypeScript

- 构建工具: Vite
  - 集成 PWA (vite-plugin-pwa) 实现离线访问和应用安装。
  - 配置 Gzip 压缩 (vite-plugin-compression) 优化加载速度。
  - 使用 rollup-plugin-visualizer 进行构建包体积分析。

- 状态管理 & 数据请求: TanStack Query (React Query) + Loader- 预取数据并缓存。

- 路由: React Router DOM

- 样式方案: Styled Components - CSS-in-JS 解决方案。

- 数据可视化: ECharts

- 其他工具:
  - date-fns: 日期处理

  - react-hot-toast: 消息通知

  - react-icons: 图标库

## 🚀 前置要求

- Node.js v20.19.5

## ⚙️ 环境配置

本项目依赖环境变量进行 API 通信。请参照根目录下的 `.env.example` 文件创建 `.env` 文件。

1. 复制 `.env.example` 为 `.env`：

2. 在 `.env` 文件中填入您的 Supabase 配置信息：
   ```
   VITE_SUPABASE_KEY=your_supabase_key
   VITE_SUPABASE_URL=your_supabase_url
   ```

## 📂 项目结构

```

src/

├── context/       # React Context (暗黑模式状态)

├── data/          # 模拟数据

├── features/      # 业务功能模块 (Auth, Bookings, Cabins, etc.)

├── hooks/         # 自定义 Hooks

├── pages/         # 页面组件

├── services/      # API 服务层

├── styles/        # 全局样式

├── ui/            # 可复用的基础 UI 组件

└── utils/         # 工具函数和常量
```
