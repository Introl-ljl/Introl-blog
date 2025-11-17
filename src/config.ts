import type {
	AnimePageConfig,
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Introl's Blog", // 网站标题
	subtitle: "一个OIer的OI弱相关博客", // 网站副标题
	lang: "zh_CN", // 网站语言，例如 'en', 'zh_CN', 'ja' 等
	themeColor: {
		hue: 250, // 主题色的默认色相，范围 0 到 360
		fixed: true, // 是否固定主题色，不允许用户更改
	},
	banner: {
		enable: false, // 是否启用首页横幅图片
		src: "assets/images/demo-banner.png", // 横幅图片路径
		position: "center", // 图片在横幅中的显示位置
		credit: {
			enable: false, // 是否显示图片署名
			text: "", // 署名文本内容
			url: "", // （可选）署名链接
		},
	},
	toc: {
		enable: true, // 是否在文章页面显示目录
		depth: 2, // 目录显示的最大标题层级
	},
	favicon: [
		// 网站图标配置，留空则使用默认图标
		// {
		//   src: '/favicon/icon.png',    // 图标路径
		//   theme: 'light',              // （可选）适配的颜色模式, 'light' 或 'dark'
		//   sizes: '32x32',              // （可选）图标尺寸
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		// 导航栏链接
		LinkPreset.Home, // 预设的"首页"链接
		{
			name: "博客", // 博客页面链接
			url: "/blog/", // 链接地址
			external: false, // 内部链接
		},
		{
			name: "归档", // 归档页面链接
			url: "/archive/", // 链接地址
			external: false, // 内部链接
		},
		{
			name: "追番", // 追番页面链接
			url: "/anime/",
			external: false,
		},
		{
			name: "友链", // 友链页面链接
			url: "/friends/", // 链接地址
			external: false, // 内部链接
		},

		LinkPreset.About, // 预设的"关于"链接
		{
			name: "Alist", // 链接名称
			url: "https://alist.introl.top", // 链接地址
			external: true, // 是否为外部链接，在新标签页打开
		},
	],
};

export const animePageConfig: AnimePageConfig = {
	enable: true, // 是否开启追番页面
	mode: "bangumi", // "local" | "bangumi" | "remote"
	bangumiUserId: "1179924", // Bangumi 模式需要手动填写
	remoteEndpoint:
		"http://localhost:8787/bangumi?vmid=1048480581&type=anime&status=watching", // 本地Docker服务
	remoteStatuses: ["watching"], // 便于在 worker 端过滤状态
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.png", // 博主头像路径
	name: "Introl", // 博主姓名或昵称
	bio: "涉猎广泛，浅尝辄止，在知识的海洋里做一个快乐的浮潜者", // 博主简介
	links: [
		// 社交媒体链接
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/wuxian",
		},
		{
			name: "Email",
			icon: "material-symbols:mail-outline",
			url: "mailto:introl-ljl@qq.com",
		},
	],
};

// 首页配置
export const homePageConfig = {
	// 导航链接
	navigation: [
		{
			name: "项目",
			description: "进行中的项目",
			icon: "material-symbols:folder-open-outline",
			url: "/projects/",
		},
		{
			name: "文章",
			description: "记录学习过程",
			icon: "material-symbols:library-books-outline",
			url: "/archive/",
		},
		{
			name: "关于",
			description: "了解更多信息",
			icon: "material-symbols:person-outline",
			url: "/about/",
		},
	],
};

// GitHub 热力图配置
export const githubHeatmapConfig = {
	// 是否启用GitHub热力图显示
	enable: true,

	// GitHub用户名 - 用于获取贡献数据
	username: "Introl-ljl",

	// 显示配置
	display: {
		title: "2025年GitHub提交", // 热力图标题
		showStats: true, // 是否显示统计信息
		showLegend: true, // 是否显示图例
		showMonthLabels: true, // 是否显示月份标签
	},

	// 数据配置
	data: {
		// 数据获取方式:
		// 1. 'mock' - 使用模拟数据（默认，无需API调用）
		// 2. 'github-api' - 通过GitHub API获取真实数据（需要配置token）
		// 3. 'local-git' - 使用本地Git仓库数据
		// 4. 'combined' - 合并GitHub和本地Git数据
		source:
			(typeof process !== 'undefined' && process.env?.HEATMAP_DATA_SOURCE as
				| "mock"
				| "github-api"
				| "local-git"
				| "combined") || "github-api",

		// GitHub API配置（当source为'github-api'或'combined'时使用）
		githubApi: {
			// GitHub Personal Access Token（可选，但建议配置以避免API限制）
			// 获取方式: GitHub Settings > Developer settings > Personal access tokens
			// 所需权限: public_repo 或 repo（如果需要访问私有仓库）
			// 强烈建议不要将 Personal Access Token 直接硬编码在代码中。
			// 推荐使用环境变量 `GITHUB_TOKEN` 来进行配置。
			token: (typeof process !== 'undefined' && process.env?.GITHUB_TOKEN) ?? "", // 留空则使用匿名访问（有API限制）

			// API请求配置
			cacheTime: 3600, // 缓存时间（秒），避免频繁请求
			timeout: 10000, // 请求超时时间（毫秒）
		},

		// 本地Git配置（当source为'local-git'或'combined'时使用）
		localGit: {
			// 本地Git仓库路径
			repoPath: (typeof process !== 'undefined' && process.env?.LOCAL_GIT_REPO_PATH) ?? "/root/git-repos/blog.git",

			// 统计天数
			days: 365,

			// 作者过滤（可选，留空则统计所有作者）
			author: "", // 例如: "John Doe" 或 "john@example.com"

			// 缓存配置
			cacheTime: 1800, // 缓存时间（秒），本地Git数据变化较少
		},

		// 模拟数据配置（当source为'mock'时使用）
		mockData: {
			// 总提交次数
			totalCommits: 247,

			// 数据生成规则
			generatePattern: {
				// 活跃度分布权重 [无活动, 低活跃, 中等, 高活跃, 极高活跃]
				intensityWeights: [0.6, 0.2, 0.1, 0.07, 0.03],

				// 工作日vs周末活跃度差异
				weekdayBoost: 1.2, // 工作日活跃度倍数
				weekendBoost: 0.8, // 周末活跃度倍数

				// 季节性变化（1-12月的活跃度倍数）
				seasonalPattern: [
					0.8, 0.9, 1.1, 1.2, 1.0, 0.7, 0.6, 0.8, 1.3, 1.4, 1.2, 0.9,
				],
			},
		},
	},

	// 样式配置
	style: {
		// 热力图颜色主题
		colorScheme: {
			// 亮色模式颜色
			light: {
				empty: "bg-neutral-100", // 无提交
				levels: [
					"bg-green-200", // 1-3次提交
					"bg-green-300", // 4-6次提交
					"bg-green-400", // 7-9次提交
					"bg-green-500", // 10+次提交
				],
			},
			// 暗色模式颜色
			dark: {
				empty: "dark:bg-neutral-800",
				levels: [
					"dark:bg-green-900",
					"dark:bg-green-800",
					"dark:bg-green-700",
					"dark:bg-green-600",
				],
			},
		},

		// 网格配置
		grid: {
			cellSize: "w-2.5 h-2.5", // 单元格大小
			cellRadius: "rounded-sm", // 单元格圆角
			gap: "gap-0.5", // 单元格间距
			rows: 7, // 行数（标准GitHub视图）
			days: 364, // 显示天数（约一年）
		},
	},
};

/**
 * GitHub热力图数据获取机制说明:
 *
 * 1. 模拟数据模式 (source: 'mock'):
 *    - 默认模式，无需网络请求
 *    - 根据配置的权重和模式生成随机但真实的提交模式
 *    - 支持工作日/周末差异、季节性变化等真实场景模拟
 *    - 适合演示和开发环境
 *
 * 2. GitHub API模式 (source: 'github-api'):
 *    - 通过GitHub GraphQL API获取真实的贡献数据
 *    - 需要配置GitHub Personal Access Token以避免API限制
 *    - 支持缓存机制，减少API调用频率
 *    - 数据获取流程:
 *      a) 检查本地缓存是否有效
 *      b) 如缓存过期，向GitHub API发起请求
 *      c) 解析API响应，提取贡献数据
 *      d) 更新本地缓存
 *      e) 渲染热力图
 *
 * 3. 自定义数据源模式 (source: 'custom'):
 *    - 允许接入其他代码托管平台或自定义数据源
 *    - 需要实现自定义的数据获取函数
 *    - 数据格式需符合标准接口规范
 *
 * 配置修改说明:
 * - 修改 username: 更改要显示的GitHub用户
 * - 修改 source: 切换数据获取方式
 * - 修改 colorScheme: 自定义热力图颜色
 * - 修改 mockData.generatePattern: 调整模拟数据的生成规律
 * - 配置 githubApi.token: 提供GitHub访问令牌以获取真实数据
 */

export const licenseConfig: LicenseConfig = {
	enable: true, // 是否在文章末尾显示许可协议
	name: "CC BY-NC-SA 4.0", // 许可协议名称
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/", // 许可协议链接
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 注意：部分样式（如背景色）已被覆盖，详见 astro.config.mjs 文件。
	// 请务必选择深色主题，因为本博客主题目前仅支持深色背景。
	theme: "github-dark", // 代码块高亮主题
};

// Giscus评论系统配置
export const giscusConfig = {
	enable: true, // 是否启用评论系统
	repo: "Introl-ljl/blog-giscus", // GitHub仓库，格式：用户名/仓库名
	repoId: "R_kgDOPoN0Dg", // 仓库ID，在GitHub仓库设置中获取
	category: "General", // 讨论分类
	categoryId: "DIC_kwDOPoN0Ds4Cu3Tg", // 分类ID
	mapping: "pathname", // 页面与讨论的映射方式
	reactionsEnabled: true, // 是否启用反应
	emitMetadata: false, // 是否发送元数据
	inputPosition: "bottom", // 输入框位置
	theme: "preferred_color_scheme", // 主题，跟随系统
	lang: "zh-CN", // 语言
	loading: "lazy", // 加载方式
};
