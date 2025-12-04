#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import { spawn, exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(BLOG_ROOT, "src", "content", "posts");
const FRIENDS_FILE = path.join(BLOG_ROOT, "src", "pages", "friends.astro");

const server = new Server({ name: "blog-mcp", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_posts",
      description: "列出所有博客文章",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "get_post",
      description: "获取指定文章的内容和元数据",
      inputSchema: {
        type: "object",
        properties: { filename: { type: "string", description: "文章文件名（如：CF1988A-Split-the-Multiset-题解.md）" } },
        required: ["filename"]
      }
    },
    {
      name: "create_post",
      description: "创建新文章",
      inputSchema: {
        type: "object",
        properties: {
          filename: { type: "string", description: "文件名（不含路径）" },
          title: { type: "string", description: "文章标题" },
          description: { type: "string", description: "文章描述" },
          tags: { type: "array", items: { type: "string" }, description: "标签数组" },
          category: { type: "string", description: "分类" },
          content: { type: "string", description: "文章正文内容（Markdown格式）" },
          draft: { type: "boolean", description: "是否为草稿", default: false }
        },
        required: ["filename", "title", "content"]
      }
    },
    {
      name: "update_post",
      description: "更新现有文章",
      inputSchema: {
        type: "object",
        properties: {
          filename: { type: "string", description: "文件名" },
          title: { type: "string", description: "文章标题" },
          description: { type: "string", description: "文章描述" },
          tags: { type: "array", items: { type: "string" }, description: "标签数组" },
          category: { type: "string", description: "分类" },
          content: { type: "string", description: "文章正文内容" },
          draft: { type: "boolean", description: "是否为草稿" }
        },
        required: ["filename"]
      }
    },
    {
      name: "get_friends",
      description: "获取友链列表",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "add_friend",
      description: "添加友链",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "网站名称" },
          description: { type: "string", description: "网站描述" },
          url: { type: "string", description: "网站链接" },
          avatar: { type: "string", description: "头像链接" },
          tags: { type: "array", items: { type: "string" }, description: "标签数组" }
        },
        required: ["name", "description", "url", "avatar"]
      }
    },
    {
      name: "dev_preview",
      description: "启动本地开发预览服务器（pnpm dev）",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "git_commit",
      description: "提交更改到 git",
      inputSchema: {
        type: "object",
        properties: {
          message: { type: "string", description: "提交信息" },
          files: { type: "array", items: { type: "string" }, description: "要提交的文件路径（可选，默认提交所有更改）" }
        },
        required: ["message"]
      }
    },
    {
      name: "git_push",
      description: "推送到 blog-server main 分支",
      inputSchema: { type: "object", properties: {} }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_posts": {
        const posts = [];
        async function scan(dir, rel = "") {
          const files = await fs.readdir(dir);
          for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
              await scan(filePath, path.join(rel, file));
            } else if (file.endsWith(".md")) {
              const content = await fs.readFile(filePath, "utf-8");
              const { data } = matter(content);
              posts.push({ filename: path.join(rel, file), title: data.title, published: data.published, category: data.category, tags: data.tags });
            }
          }
        }
        await scan(POSTS_DIR);
        return { content: [{ type: "text", text: JSON.stringify(posts, null, 2) }] };
      }

      case "get_post": {
        const filePath = path.join(POSTS_DIR, args.filename);
        const content = await fs.readFile(filePath, "utf-8");
        const { data, content: markdown } = matter(content);
        return { content: [{ type: "text", text: JSON.stringify({ metadata: data, content: markdown }, null, 2) }] };
      }

      case "create_post": {
        const frontmatter = {
          title: args.title,
          published: new Date().toISOString().split("T")[0],
          description: args.description || "",
          tags: args.tags || [],
          category: args.category || "",
          draft: args.draft || false
        };
        const fileContent = matter.stringify(args.content, frontmatter);
        const filePath = path.join(POSTS_DIR, args.filename);
        await fs.writeFile(filePath, fileContent, "utf-8");
        return { content: [{ type: "text", text: `文章已创建：${args.filename}` }] };
      }

      case "update_post": {
        const filePath = path.join(POSTS_DIR, args.filename);
        const existing = await fs.readFile(filePath, "utf-8");
        const { data, content } = matter(existing);
        const updated = {
          ...data,
          ...(args.title && { title: args.title }),
          ...(args.description && { description: args.description }),
          ...(args.tags && { tags: args.tags }),
          ...(args.category && { category: args.category }),
          ...(args.draft !== undefined && { draft: args.draft })
        };
        const newContent = matter.stringify(args.content || content, updated);
        await fs.writeFile(filePath, newContent, "utf-8");
        return { content: [{ type: "text", text: `文章已更新：${args.filename}` }] };
      }

      case "get_friends": {
        const content = await fs.readFile(FRIENDS_FILE, "utf-8");
        const match = content.match(/const friends = \[([\s\S]*?)\];/);
        if (match) {
          const friendsData = match[1];
          return { content: [{ type: "text", text: friendsData }] };
        }
        return { content: [{ type: "text", text: "未找到友链数据" }] };
      }

      case "add_friend": {
        let content = await fs.readFile(FRIENDS_FILE, "utf-8");
        const eol = content.includes('\r\n') ? '\r\n' : '\n';
        const newFriend = `\t{\n\t\tname: "${args.name}",\n\t\tdescription: "${args.description}",\n\t\turl: "${args.url}",\n\t\tavatar: "${args.avatar}",\n\t\ttags: ${JSON.stringify(args.tags || [])},\n\t}`.replace(/\n/g, eol);
        const updated = content.replace(new RegExp(`(\\t\\})${eol}(\\t\\/\\/ 可以在这里添加更多友链)`), `$1,${eol}${newFriend}${eol}$2`);
        await fs.writeFile(FRIENDS_FILE, updated, "utf-8");
        return { content: [{ type: "text", text: `友链已添加：${args.name}` }] };
      }

      case "dev_preview": {
        return new Promise((resolve) => {
          const proc = spawn("pnpm", ["dev"], { cwd: BLOG_ROOT, shell: true });
          let output = "";
          proc.stdout.on("data", (data) => {
            output += data.toString();
            const match = output.match(/Local:\s+(http:\/\/[^\s]+)/);
            if (match) {
              resolve({ content: [{ type: "text", text: `开发服务器已启动\n\n访问链接: ${match[1]}\n\n${output}` }] });
            }
          });
          proc.stderr.on("data", (data) => { output += data.toString(); });
          setTimeout(() => {
            if (!output.includes("Local:")) {
              resolve({ content: [{ type: "text", text: `开发服务器已启动\n访问链接: http://localhost:4321\n\n${output}` }] });
            }
          }, 5000);
        });
      }

      case "git_commit": {
        const files = args.files || ["."];
        const addCmd = `git add ${files.join(" ")}`;
        const commitCmd = `git commit -m "${args.message.replace(/"/g, '\\"')}"`;
        try {
          await execAsync(addCmd, { cwd: BLOG_ROOT });
          const { stdout, stderr } = await execAsync(commitCmd, { cwd: BLOG_ROOT });
          return { content: [{ type: "text", text: `提交成功\n${stdout}${stderr}` }] };
        } catch (error) {
          return { content: [{ type: "text", text: `提交失败\n${error.message}` }], isError: true };
        }
      }

      case "git_push": {
        try {
          const { stdout, stderr } = await execAsync("git push blog-server main", { cwd: BLOG_ROOT });
          return { content: [{ type: "text", text: `推送成功到 blog-server main\n${stdout}${stderr}` }] };
        } catch (error) {
          return { content: [{ type: "text", text: `推送失败\n${error.stdout || ""}${error.stderr || ""}${error.message}` }], isError: true };
        }
      }

      default:
        throw new Error(`未知工具：${name}`);
    }
  } catch (error) {
    return { content: [{ type: "text", text: `错误：${error.message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
