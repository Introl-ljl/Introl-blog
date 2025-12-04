# Blog MCP Server

用于管理博客内容的 MCP 服务器，支持文章和友链的读取、创建和修改。

## 功能

### 文章管理
- `list_posts` - 列出所有博客文章
- `get_post` - 获取指定文章的内容和元数据
- `create_post` - 创建新文章
- `update_post` - 更新现有文章

### 友链管理
- `get_friends` - 获取友链列表
- `add_friend` - 添加友链

## 配置

在 Q CLI 的配置文件中添加此 MCP 服务器：

```json
{
  "mcpServers": {
    "blog": {
      "command": "node",
      "args": ["/mnt/c/Users/LEGION/Desktop/blog/mcp-blog-server/index.js"],
      "cwd": "/mnt/c/Users/LEGION/Desktop/blog/mcp-blog-server"
    }
  }
}
```

## 使用示例

### 列出所有文章
```
使用 list_posts 工具
```

### 获取文章内容
```
使用 get_post 工具，参数：
- filename: "CF1988A-Split-the-Multiset-题解.md"
```

### 创建新文章
```
使用 create_post 工具，参数：
- filename: "new-post.md"
- title: "新文章标题"
- description: "文章描述"
- tags: ["标签1", "标签2"]
- category: "分类"
- content: "# 文章内容\n\n这是正文..."
- draft: false
```

### 更新文章
```
使用 update_post 工具，参数：
- filename: "existing-post.md"
- title: "更新后的标题"
- content: "更新后的内容"
```

### 获取友链
```
使用 get_friends 工具
```

### 添加友链
```
使用 add_friend 工具，参数：
- name: "网站名称"
- description: "网站描述"
- url: "https://example.com"
- avatar: "https://example.com/avatar.png"
- tags: ["博客"]
```

## 注意事项

1. 服务器会自动处理文章的 frontmatter（YAML 格式）
2. 创建文章时会自动设置发布日期为当前日期
3. 友链会被添加到 `src/pages/friends.astro` 文件中
4. 所有操作都是本地文件操作，需要手动使用 git 提交更改
