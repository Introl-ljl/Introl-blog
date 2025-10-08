# 🍥 Introl 的博客

![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen)
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)

基于 [Astro](https://astro.build) 构建的个人博客网站，记录OI学习历程和技术思考。


## ✨ 功能特性

- [x] 基于 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 构建
- [x] 流畅的动画效果和页面过渡
- [x] 支持浅色/深色主题切换
- [x] 可自定义主题颜色和横幅图片
- [x] 响应式设计，适配各种设备
- [x] 基于 [Pagefind](https://pagefind.app/) 的搜索功能
- [x] 增强的 [Markdown 语法支持](https://github.com/saicaca/fuwari?tab=readme-ov-file#-markdown-extended-syntax)
- [x] 自动生成文章目录
- [x] RSS 订阅支持
- [x] GitHub 贡献热力图展示
- [x] Giscus 评论系统集成

## 🚀 快速开始

1.  **克隆仓库：**
    ```bash
    git clone https://github.com/Introl-ljl/Introl-blog.git
    cd Introl-blog
    ```

2.  **安装依赖：**
    确保已安装 [pnpm](https://pnpm.io) (`npm install -g pnpm`)。
    ```bash
    pnpm install
    ```

3.  **个性化配置：**
    编辑配置文件 `src/config.ts`，自定义博客标题、描述等信息。

4.  **创建新文章：**
    运行以下命令创建新的博客文章，文件将保存在 `src/content/posts/` 目录。
    ```bash
    pnpm new-post <文章文件名>
    ```

5.  **启动开发服务器：**
    ```bash
    pnpm dev
    ```
    博客将在 `http://localhost:4321` 地址运行。

## ⚡ 可用命令

所有命令都需要在项目根目录的终端中执行：

| 命令 | 说明 |
| :--- | :--- |
| `pnpm install` | 安装项目依赖 |
| `pnpm dev` | 启动本地开发服务器，地址为 `localhost:4321` |
| `pnpm build` | 构建生产版本到 `./dist/` 目录 |
| `pnpm preview` | 本地预览构建结果 |
| `pnpm check` | 检查代码中的错误 |
| `pnpm format` | 使用 Biome 格式化代码 |
| `pnpm lint` | 使用 Biome 检查代码质量 |
| `pnpm new-post <文件名>` | 创建新文章 |
| `pnpm create-post` | 交互式创建文章 |
| `pnpm list-posts` | 列出所有文章 |
| `pnpm blog-helper` | 博客助手工具 |

### 文章格式
文章使用 Markdown 格式，支持以下扩展语法：
- 数学公式（KaTeX）
- 代码高亮和行号
- 提示框（note、tip、warning、caution、important）
- GitHub 风格的通知
- 自定义组件

## 🚀 部署方案

本项目已配置支持多种部署方式：

### Netlify 部署（推荐）
点击上方的 "部署到 Netlify" 按钮即可快速部署。

### 其他平台
本项目同时支持部署到 Vercel、GitHub Pages 等平台。构建命令为 `pnpm build`，输出目录为 `dist/`。

### EdgeOne Pages
也支持部署到腾讯云的 EdgeOne Pages，具体配置参考其官方文档。

## 🔧 环境配置

### 必需环境变量
- `NODE_VERSION`: 20
- `PNPM_VERSION`: 9

### 可选环境变量
- `GITHUB_TOKEN`: GitHub 个人访问令牌，用于获取真实的贡献数据
- `HEATMAP_DATA_SOURCE`: 热力图数据源（mock/github-api/local-git/combined）
- `LOCAL_GIT_REPO_PATH`: 本地 Git 仓库路径

## 📄 开源协议

本项目采用 MIT 协议开源。基于 [Fuwari](https://github.com/saicaca/fuwari) 主题模板开发。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进博客。具体贡献方式请参考 [CONTRIBUTING.md](CONTRIBUTING.md) 文件。

## 📧 联系方式

- GitHub: [@Introl-ljl](https://github.com/Introl-ljl)
- 邮箱: introl-ljl@qq.com
- 博客地址: https://blog.introl.top
