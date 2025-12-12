import type { Route, RouteLatency, RoutePreference } from "@/types/config";
import { ROUTES, ROUTE_CONFIG } from "@constants/routes";

/**
 * 测试单个线路的延迟
 * @param route 要测试的线路
 * @returns 延迟测试结果
 */
export async function testRouteLatency(route: Route): Promise<RouteLatency> {
	const startTime = performance.now();
	let timeoutId: number | undefined;

	try {
		// 创建 AbortController 用于超时控制
		const controller = new AbortController();
		timeoutId = window.setTimeout(() => controller.abort(), ROUTE_CONFIG.TIMEOUT);

		// 使用 HEAD 请求测试（流量小）
		// 添加时间戳避免缓存
		const testUrl = `${route.url}${route.testUrl}?_t=${Date.now()}`;

		const response = await fetch(testUrl, {
			method: "HEAD",
			mode: "no-cors", // 允许跨域，但无法读取响应
			cache: "no-store",
			signal: controller.signal,
		});

		clearTimeout(timeoutId);
		timeoutId = undefined;
		const endTime = performance.now();
		const latency = Math.round(endTime - startTime);

		// no-cors 模式下无法读取状态码，只能判断是否成功返回
		// 如果请求被阻止或超时，会进入 catch 块
		return {
			route,
			latency,
			success: true,
			timestamp: Date.now(),
		};
	} catch (error) {
		// 确保清理 timeout
		if (timeoutId !== undefined) {
			clearTimeout(timeoutId);
		}

		const endTime = performance.now();
		const latency = Math.round(endTime - startTime);

		// 判断是否是超时错误
		const isTimeout = error instanceof Error && error.name === "AbortError";
		console.warn(`Route ${route.name} test failed:`, {
			error,
			isTimeout,
			latency,
		});

		return {
			route,
			latency,
			success: false,
			timestamp: Date.now(),
		};
	}
}

/**
 * 并发测试所有线路
 * @returns 所有线路的测试结果
 */
export async function testAllRoutes(): Promise<RouteLatency[]> {
	const results = await Promise.all(
		ROUTES.map(route => testRouteLatency(route))
	);
	return results;
}

/**
 * 选择最优线路
 * 优先选择成功且延迟最低的线路
 * 如果延迟相同，按优先级排序
 * @param results 测试结果数组
 * @returns 最优线路，如果都失败则返回 null
 */
export function selectBestRoute(results: RouteLatency[]): Route | null {
	// 筛选成功的线路
	const successfulResults = results.filter(r => r.success);

	if (successfulResults.length === 0) {
		console.warn("All routes failed");
		return null;
	}

	// 按延迟排序，延迟相同则按优先级
	successfulResults.sort((a, b) => {
		if (a.latency !== b.latency) {
			return a.latency - b.latency;
		}
		return a.route.priority - b.route.priority;
	});

	return successfulResults[0].route;
}

/**
 * 获取当前访问的线路
 * @returns 当前线路对象，如果不匹配任何配置的线路则返回 null
 */
export function getCurrentRoute(): Route | null {
	const currentHost = window.location.host;
	const currentProtocol = window.location.protocol;

	return ROUTES.find(route => {
		try {
			const routeUrl = new URL(route.url);
			return routeUrl.host === currentHost &&
			       routeUrl.protocol === currentProtocol;
		} catch {
			return false;
		}
	}) || null;
}

/**
 * 构建跳转URL，保持当前路径和查询参数
 * @param targetRoute 目标线路
 * @param addRouteCheckedParam 是否添加 route_checked 参数（仅自动跳转时使用）
 * @returns 完整的跳转URL
 */
export function buildRedirectUrl(targetRoute: Route, addRouteCheckedParam = false): string {
	const currentPath = window.location.pathname;
	const currentSearch = window.location.search;
	const currentHash = window.location.hash;

	// 仅在自动跳转时添加 route_checked 参数防止循环跳转
	if (addRouteCheckedParam) {
		const separator = currentSearch ? "&" : "?";
		return `${targetRoute.url}${currentPath}${currentSearch}${separator}route_checked=1${currentHash}`;
	}

	return `${targetRoute.url}${currentPath}${currentSearch}${currentHash}`;
}

/**
 * 从 localStorage 加载线路偏好设置
 * @returns 线路偏好配置对象
 */
export function loadRoutePreference(): RoutePreference {
	try {
		const stored = localStorage.getItem(ROUTE_CONFIG.STORAGE_KEY);
		if (stored) {
			const preference = JSON.parse(stored) as RoutePreference;
			return preference;
		}
	} catch (error) {
		console.warn("Failed to load route preference:", error);
	}

	// 返回默认配置
	return {
		selectedRoute: null,
		autoSwitch: true, // 默认启用自动切换
		lastCheck: 0,
		latencyCache: {},
	};
}

/**
 * 保存线路偏好设置到 localStorage
 * @param preference 要保存的偏好配置
 */
export function saveRoutePreference(preference: RoutePreference): void {
	try {
		localStorage.setItem(
			ROUTE_CONFIG.STORAGE_KEY,
			JSON.stringify(preference)
		);
	} catch (error) {
		console.error("Failed to save route preference:", error);
	}
}

/**
 * 更新延迟缓存
 * @param results 测试结果数组
 */
export function updateLatencyCache(results: RouteLatency[]): void {
	const preference = loadRoutePreference();

	// 更新缓存
	for (const result of results) {
		preference.latencyCache[result.route.id] = {
			latency: result.latency,
			timestamp: result.timestamp,
			success: result.success,
		};
	}

	preference.lastCheck = Date.now();
	saveRoutePreference(preference);
}

/**
 * 检查缓存是否有效
 * @returns 缓存是否在有效期内
 */
export function isCacheValid(): boolean {
	const preference = loadRoutePreference();
	const now = Date.now();
	const elapsed = now - preference.lastCheck;

	return elapsed < ROUTE_CONFIG.CACHE_DURATION;
}

/**
 * 从缓存获取线路延迟数据
 * @returns 缓存的延迟数据数组，如果缓存无效则返回空数组
 */
export function getCachedLatencies(): RouteLatency[] {
	if (!isCacheValid()) {
		return [];
	}

	const preference = loadRoutePreference();
	const results: RouteLatency[] = [];

	for (const route of ROUTES) {
		const cached = preference.latencyCache[route.id];
		if (cached) {
			results.push({
				route,
				latency: cached.latency,
				success: cached.success,
				timestamp: cached.timestamp,
			});
		}
	}

	return results;
}

/**
 * 检查 URL 是否已包含 route_checked 参数
 * @returns 是否已检测过
 */
export function isRouteCheckedInUrl(): boolean {
	if (typeof window === "undefined") {
		return false;
	}
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.has("route_checked");
}

/**
 * 检查是否已在本次会话中检测过线路
 * 结合 URL 参数和 sessionStorage 双重检查
 * @returns 是否已检测
 */
export function isRouteCheckedInSession(): boolean {
	// 检查 URL 参数
	if (isRouteCheckedInUrl()) {
		return true;
	}
	// 检查 sessionStorage
	return sessionStorage.getItem(ROUTE_CONFIG.SESSION_KEY) === "true";
}

/**
 * 标记本次会话已检测线路
 */
export function markRouteCheckedInSession(): void {
	sessionStorage.setItem(ROUTE_CONFIG.SESSION_KEY, "true");
}

/**
 * 获取延迟颜色等级
 * @param latency 延迟值（毫秒）
 * @param success 是否测试成功
 * @returns 颜色等级字符串
 */
export function getLatencyColorClass(latency: number, success: boolean): string {
	if (!success) {
		return "text-neutral-400"; // 灰色 - 失败
	}

	const { EXCELLENT, GOOD, FAIR } = ROUTE_CONFIG.LATENCY_THRESHOLDS;

	if (latency < EXCELLENT) {
		return "text-green-500"; // 绿色 - 优秀
	}
	if (latency < GOOD) {
		return "text-yellow-500"; // 黄色 - 良好
	}
	if (latency < FAIR) {
		return "text-orange-500"; // 橙色 - 一般
	}
	return "text-red-500"; // 红色 - 较慢
}

/**
 * 获取延迟描述的 i18n 键
 * @param latency 延迟值（毫秒）
 * @param success 是否测试成功
 * @returns i18n 键字符串
 */
export function getLatencyDescriptionKey(latency: number, success: boolean): string {
	if (!success) {
		return "routeLatencyFailed";
	}

	const { EXCELLENT, GOOD, FAIR } = ROUTE_CONFIG.LATENCY_THRESHOLDS;

	if (latency < EXCELLENT) {
		return "routeLatencyExcellent";
	}
	if (latency < GOOD) {
		return "routeLatencyGood";
	}
	if (latency < FAIR) {
		return "routeLatencyFair";
	}
	return "routeLatencySlow";
}
