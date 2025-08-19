# 🍥 Fuwari Blog

![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen)
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)

A static blog template built with [Astro](https://astro.build).

[**🖥️ Live Demo (Vercel)**](https://fuwari.vercel.app)

![Preview Image](https://raw.githubusercontent.com/saicaca/resource/main/fuwari/home.png)

## ✨ Features

- [x] Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
- [x] Smooth animations and page transitions
- [x] Light / dark mode
- [x] Customizable theme colors & banner
- [x] Responsive design
- [x] Search functionality with [Pagefind](https://pagefind.app/)
- [x] [Markdown extended features](https://github.com/saicaca/fuwari?tab=readme-ov-file#-markdown-extended-syntax)
- [x] Table of contents
- [x] RSS feed

## 🚀 Getting Started

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd blog
    ```

2.  **Install dependencies:**
    Make sure you have [pnpm](https://pnpm.io) installed (`npm install -g pnpm`).
    ```sh
    pnpm install
    ```

3.  **Customize your blog:**
    Edit the config file `src/config.ts` to personalize your blog's title, description, and other settings.

4.  **Create a new post:**
    Run the following command to create a new blog post. The new file will be located in `src/content/posts/`.
    ```sh
    pnpm new-post <filename>
    ```

5.  **Run the development server:**
    ```sh
    pnpm dev
    ```
    Your blog will be available at `http://localhost:4321`.

## ⚡ Commands

All commands are run from the root of the project in a terminal:

| Command | Action |
| :--- | :--- |
| `pnpm install` | Installs dependencies |
| `pnpm dev` | Starts local dev server at `localhost:4321` |
| `pnpm build` | Build your production site to `./dist/` |
| `pnpm preview` | Preview your build locally, before deploying |
| `pnpm check` | Run checks for errors in your code |
| `pnpm format` | Format your code using Biome |
| `pnpm new-post <filename>` | Create a new post |

## 部署

This project is configured for deployment on [EdgeOne Pages](https://cloud.tencent.com/document/product/1552/100070).

The `vercel.json` file is included for compatibility with Vercel, but for EdgeOne, you can follow their official documentation for Astro projects.

## 📄 License

This project is licensed under the MIT License.
