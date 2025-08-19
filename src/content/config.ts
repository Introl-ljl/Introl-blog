import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),
		// 文章所属项目（可选）
		project: z.string().optional().default(""), // 项目slug，用于关联到具体项目

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	schema: z.object({}),
});

const bookmarksCollection = defineCollection({
	schema: z.object({
		category: z.string(),
		description: z.string().optional().default(""),
		order: z.number().optional().default(0), // 分类排序
		items: z.array(z.object({
			name: z.string(),
			description: z.string(),
			url: z.string().url(),
			icon: z.string(),
			color: z.string(), // Tailwind CSS 背景色类名
			tags: z.array(z.string()).optional().default([]),
			featured: z.boolean().optional().default(false), // 是否为推荐网站
		})),
	}),
});

const projectsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		longDescription: z.string(),
		image: z.string().optional().default(""),
		url: z.string(),
		demoUrl: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().default("技术项目"), // 项目分类
		progress: z.number().min(0).max(100),
		status: z.enum(["进行中", "已完成", "暂停", "计划中"]).optional().default("进行中"), // 项目状态
		startDate: z.date(),
		lastUpdate: z.date(),
		features: z.array(z.string()).optional().default([]),
		technologies: z.array(z.object({
			name: z.string(),
			icon: z.string(),
		})).optional().default([]),
		// 项目参与人员
		contributors: z.array(z.object({
			name: z.string(),
			role: z.string().optional().default(""),
			avatar: z.string().optional().default(""),
			github: z.string().optional().default(""),
		})).optional().default([]),
		// 外部资源链接
		links: z.object({
			github: z.string().optional().default(""),
			documentation: z.string().optional().default(""),
			demo: z.string().optional().default(""),
			design: z.string().optional().default(""),
			other: z.array(z.object({
				name: z.string(),
				url: z.string(),
			})).optional().default([]),
		}).optional().default({}),
		// 项目统计信息
		stats: z.object({
			stars: z.number().optional().default(0),
			forks: z.number().optional().default(0),
			downloads: z.number().optional().default(0),
		}).optional().default({}),
		draft: z.boolean().optional().default(false),
	}),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
	bookmarks: bookmarksCollection,
	projects: projectsCollection,
};
