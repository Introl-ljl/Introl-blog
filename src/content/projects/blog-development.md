---
title: 博客开发
description: 基于Astro框架的个人技术博客开发项目
longDescription: |
  这是一个使用Astro框架构建的现代化个人技术博客，集成了多种功能模块，包括文章管理、项目展示、友链系统等。
  项目采用TypeScript开发，支持暗色模式，具有响应式设计，并集成了多种实用功能。
image: /assets/images/blog-development.png
url: https://github.com/example/blog
tags: ["Astro", "TypeScript", "博客", "前端开发", "个人项目"]
category: "Web开发"
progress: 85
startDate: 2025-08-19
lastUpdate: 2025-10-09
status: "进行中"
contributors:
  - name: "Introl"
    role: "全栈开发"
    avatar: "src/assets/images/avatar.png"
links:
  github: "."
  demo: "/"

technologies:
  - name: Astro
    icon: simple-icons:astro
  - name: TypeScript
    icon: simple-icons:typescript
  - name: Tailwind CSS
    icon: simple-icons:tailwindcss
  - name: Svelte
    icon: simple-icons:svelte
  - name: Node.js
    icon: fa6-brands:node-js
timeline:
  - date: "2025-08-19T14:36:40Z"
    type: "milestone"
    title: "项目搭建"
    content: |
      由于之前的服务器炸了，博客也直接倒闭了。。
      还好之前的文章还在，就是最新写的几篇没了，之后有时间再补。
      新版博客基于**fawari**，并在其基础上修改了大量内容。
    icon: "material-symbols:rocket-launch"
    iconColor: "text-indigo-500"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-08-19T15:30:37Z"
    type: "deployment"
    title: "~~搬去 Netlify~~"
    content: |
      ~~把构建脚本塞进 Netlify，配置了环境变量与静态资源路径，之后推送就能自动上线，再也不用手动 rsync。~~
      感觉有点难用，还是用回自己的服务器吧。
    icon: "material-symbols:cloud-upload"
    iconColor: "text-sky-500"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"
  - date: "2025-08-19T20:00:00Z"
    type: "feature"
    title: "部署到nginx"
    content: |
      思考许久，最终还是决定用nginx反代静态网页来完成部署。
    icon: "material-symbols:web"
    iconColor: "text-purple-500"
  - date: "2025-08-19T20:00:00Z"
    type: "feature"
    title: "启用Edgeonecdn加速"
    content: |
      搞到一个edgeone的邀请码，直接干脆用它的CDN服务，虽然没有国内加速但速度还是很可以的。
    icon: "material-symbols:cloud"
    iconColor: "text-pink-500"
  - date: "2025-08-20T03:50:13Z"
    type: "feature"
    title: "热力图接入本地仓库"
    content: |
      在主页把热力图接进来了，同时还把本地的私有git数据也混合在里面。
      整这个东西太费劲了，在Trae的加持下仍然改了好长时间，一定是Trae太难用了（确信。
    icon: "material-symbols:heat-pump-balance"
    iconColor: "text-orange-600"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-08-20T08:12:44Z"
    type: "feature"
    title: "项目页重做"
    content: |
      项目页重构，增加了相关文章，终于不像 PPT 截图了。。
    icon: "material-symbols:architecture"
    iconColor: "text-blue-500"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-08-20T10:34:54Z"
    type: "improvement"
    title: "导航和资料对齐"
    content: |
      顺手把导航栏和个人资料的配置修完，之前的占位文案全都换成正式内容。
    icon: "material-symbols:menu"
    iconColor: "text-blue-400"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-08-20T10:50:28Z"
    type: "feature"
    title: "公告模块上线"
    content: |
      添加了一个公告模块，还挺好用的。
    icon: "material-symbols:campaign"
    iconColor: "text-yellow-500"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"
  - date: "2025-08-20T11:19:41Z"
    type: "feature"
    title: "友链系统上线"
    content: |
      完善了友链，加了一两个人，推广什么的之后再说吧。
    icon: "material-symbols:people"
    iconColor: "text-green-500"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-09-02T04:50:02Z"
    type: "content"
    title: "发了篇平衡树笔记"
    content: |
      复习平衡树，顺便测试了一遍 Markdown 渲染和封面图链路。
    icon: "material-symbols:article"
    iconColor: "text-lime-500"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"
  - date: "2025-09-19T14:52:51Z"
    type: "fix"
    title: "热力图尾端偏移修补"
    content: |
      修复热力图数据计算，解决了尾端偏移的问题。
    icon: "material-symbols:speed"
    iconColor: "text-green-500"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-09-19T22:16:49+08:00"
    type: "maintenance"
    title: "友链清理整顿"
    content: |
      把过期的友链条目都移掉，只留下活跃的站点，顺便整理了顺序。
    icon: "material-symbols:format-list-bulleted"
    iconColor: "text-slate-500"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-10-01T14:58:38+08:00"
    type: "improvement"
    title: "友链头像统一尺寸"
    content: |
      感觉友链的头像太小了，放大了一点。
    icon: "material-symbols:account-circle"
    iconColor: "text-purple-400"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-10-01T15:03:36+08:00"
    type: "maintenance"
    title: "扫除旧测试资源"
    content: |
      把一堆测试用的脚本和文件全删了，目录也顺手整理了一下。
    icon: "material-symbols:cleaning-services"
    iconColor: "text-gray-500"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-10-05T01:07:11+08:00"
    type: "feature"
    title: "项目看板视图"
    content: |
      之前的项目越看越觉得奇怪，感觉挺没用的。
      在codex&claude code的联手下，重构了整个项目页面，项目页总算有点用处了。
    icon: "material-symbols:dashboard"
    iconColor: "text-emerald-500"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-10-05T10:39:34+08:00"
    type: "improvement"
    title: "切换逻辑修复"
    content: |
      切换页面的时候一直觉得很卡，尝试修复，但无果。
    icon: "material-symbols:motion-photos-auto"
    iconColor: "text-rose-500"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-10-09T02:14:25+08:00"
    type: "docs"
    title: "README"
    content: |
      不要骂我，我才想起来这个README没改。。
    icon: "material-symbols:menu-book"
    iconColor: "text-emerald-600"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-10-09T02:47:18Z"
    type: "feature"
    title: "Footer 与备案"
    content: |
      ~~我的站点终于备案了！虽然是萌国ICP~~
    icon: "material-symbols:layers"
    iconColor: "text-teal-500"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-10-09T02:57:42Z"
    type: "improvement"
    title: "热力图布局再调"
    content: |
      codex真强啊，把遗留的热力图问题一下就干掉了。

      调整了热力图的宽度和滚动策略，小屏设备也能轻松横向拖动。
    icon: "material-symbols:grid-on"
    iconColor: "text-amber-400"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"

  - date: "2025-10-09T23:03:03+08:00"
    type: "fix"
    title: "Swup 卡顿处理"
    content: |
      codex还是太牛逼了，把我的陈年老bug修复了。

      现在切换页面的时候终于不会一卡一卡的闪页了。
    icon: "material-symbols:troubleshoot"
    iconColor: "text-red-500"
    author:
      name: "Introl"
      avatar: "src/assets/images/avatar.png"
      role: "开发者"
      
draft: false
---
