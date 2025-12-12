import type { Route } from "@/types/config";

/**
 * 线路配置
 * 注意：请根据实际部署情况修改URL
 */
export const ROUTES: Route[] = [
	{
		id: "ipv6-local",
		name: "本机IPv6",
		description: "国内IPv6本机节点，适合IPv6网络",
		url: "https://blog6.introl.top:2083", // 请替换为实际IPv6地址
		testUrl: "/favicon.ico", // 测试端点
		priority: 1,
		protocol: "ipv6",
	},
	{
		id: "ipv4-cn",
		name: "国内服务器",
		description: "国内IPv4服务器节点，稳定快速",
		url: "http://106.13.94.207:8080/", // 请替换为实际域名
		testUrl: "/favicon.ico",
		priority: 2,
		protocol: "ipv4",
	},
	{
		id: "github-pages",
		name: "GitHub Pages",
		description: "GitHub托管，全球CDN加速",
		url: "https://blogit.introl.top", // 请替换为实际GitHub Pages地址
		testUrl: "/favicon.ico",
		priority: 3,
		protocol: "ipv4",
	},
	{
		id: "edgeone",
		name: "EdgeOne",
		description: "腾讯EdgeOne边缘加速",
		url: "https://blogeo.introl.top", // 请替换为实际EdgeOne域名
		testUrl: "/favicon.ico",
		priority: 4,
		protocol: "ipv4",
	},
	{
		id: "cloudflare",
		name: "Cloudflare",
		description: "Cloudflare Pages全球加速",
		url: "https://blog.introl.top", // 请替换为实际Cloudflare Pages地址
		testUrl: "/favicon.ico",
		priority: 5,
		protocol: "ipv4",
	},
];

/**
 * 线路检测配置
 */
export const ROUTE_CONFIG = {
	// 检测超时时间（毫秒）
	TIMEOUT: 5000,

	// 缓存有效期（毫秒）- 10分钟
	CACHE_DURATION: 10 * 60 * 1000,

	// 并发检测数量（当前实现中所有线路并发测试，此配置保留以供未来扩展）
	CONCURRENT_TESTS: 5,

	// 延迟颜色阈值（毫秒）
	LATENCY_THRESHOLDS: {
		EXCELLENT: 50,   // 优秀
		GOOD: 200,       // 良好
		FAIR: 500,       // 一般
		// > 500 为较慢
	},

	// LocalStorage键名
	STORAGE_KEY: "route-preference",

	// SessionStorage键名（防止循环跳转）
	SESSION_KEY: "route-checked",
};
