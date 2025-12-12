<script lang="ts">
import { onMount } from "svelte";
import Icon from "@iconify/svelte";
import type { RouteLatency } from "@/types/config";
import { ROUTES } from "@constants/routes";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import {
	testAllRoutes,
	loadRoutePreference,
	saveRoutePreference,
	updateLatencyCache,
	getCachedLatencies,
	getCurrentRoute,
	buildRedirectUrl,
	getLatencyColorClass,
	getLatencyDescriptionKey,
} from "@utils/route-utils";

let isOpen = false;
let isTesting = false;
let latencies: RouteLatency[] = [];
let autoSwitch = true;
let currentRoute = getCurrentRoute();

// 加载偏好设置和缓存数据
onMount(() => {
	const preference = loadRoutePreference();
	autoSwitch = preference.autoSwitch;

	// 尝试加载缓存数据
	const cached = getCachedLatencies();
	if (cached.length > 0) {
		latencies = cached;
	} else {
		// 如果没有缓存，自动检测一次
		testLatencies();
	}

	// 如果用户之前手动选择过线路，且当前不在该线路上，提示用户
	// 注意：这里不自动跳转，只是加载偏好，跳转由自动切换逻辑处理
	if (preference.selectedRoute && !isCurrentRoute(preference.selectedRoute)) {
		console.info(`User preference: ${preference.selectedRoute}, current: ${currentRoute?.id || 'unknown'}`);
	}
});

async function testLatencies() {
	isTesting = true;
	try {
		const results = await testAllRoutes();
		latencies = results;
		updateLatencyCache(results);
	} catch (error) {
		console.error("Failed to test routes:", error);
	} finally {
		isTesting = false;
	}
}

function switchRoute(routeId: string) {
	const targetRoute = ROUTES.find(r => r.id === routeId);
	if (!targetRoute) {
		return;
	}

	// 保存用户选择
	const preference = loadRoutePreference();
	preference.selectedRoute = routeId;
	saveRoutePreference(preference);

	// 如果不是当前线路，执行跳转
	if (currentRoute?.id !== routeId) {
		const redirectUrl = buildRedirectUrl(targetRoute);
		window.location.href = redirectUrl;
	}
}

function toggleAutoSwitch() {
	autoSwitch = !autoSwitch;
	const preference = loadRoutePreference();
	preference.autoSwitch = autoSwitch;
	saveRoutePreference(preference);
}

function togglePanel() {
	isOpen = !isOpen;
}

function getLatencyText(latency: RouteLatency): string {
	if (!latency.success) {
		return i18n(I18nKey.routeLatencyFailed);
	}
	return `${latency.latency}ms`;
}

function isCurrentRoute(routeId: string): boolean {
	return currentRoute?.id === routeId;
}
</script>

<div class="relative" role="menu" tabindex="-1">
	<!-- 触发按钮 -->
	<button
		aria-label="Route Selector"
		role="menuitem"
		class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90"
		on:click={togglePanel}
	>
		<Icon icon="material-symbols:route-outline" class="text-[1.25rem]" />
		{#if currentRoute}
			<span class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
		{/if}
	</button>

	<!-- 浮动面板 -->
	{#if isOpen}
		<div
			class="absolute top-14 right-0 w-80 card-base float-panel p-4 z-50"
			on:mouseleave={() => isOpen = false}
		>
			<!-- 标题栏 -->
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center gap-2">
					<div class="w-1 h-4 rounded-md bg-[var(--primary)]"></div>
					<h3 class="font-bold text-lg text-neutral-900 dark:text-neutral-100">
						{i18n(I18nKey.routeSelectorTitle)}
					</h3>
				</div>
				<button
					aria-label={i18n(I18nKey.routeSelectorRefresh)}
					class="btn-regular w-8 h-8 rounded-md active:scale-90"
					on:click={testLatencies}
					disabled={isTesting}
				>
					<Icon
						icon="fa6-solid:arrow-rotate-right"
						class="text-sm {isTesting ? 'animate-spin' : ''}"
					/>
				</button>
			</div>

			<!-- 自动切换开关 -->
			<div class="flex items-center justify-between mb-3 px-2">
				<span class="text-sm text-neutral-700 dark:text-neutral-300">
					{i18n(I18nKey.routeSelectorAutoSwitch)}
				</span>
				<button
					class="relative w-11 h-6 rounded-full transition-colors {autoSwitch
						? 'bg-[var(--primary)]'
						: 'bg-neutral-300 dark:bg-neutral-600'}"
					on:click={toggleAutoSwitch}
				>
					<span
						class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform {autoSwitch
							? 'translate-x-5'
							: 'translate-x-0'}"
					></span>
				</button>
			</div>

			<!-- 线路列表 -->
			<div class="space-y-2">
				{#if latencies.length === 0 && !isTesting}
					<div class="text-center py-4 text-neutral-500">
						{i18n(I18nKey.routeSelectorClickToSwitch)}
					</div>
				{:else}
					{#each ROUTES as route}
						{@const latency = latencies.find(l => l.route.id === route.id)}
						<button
							class="w-full flex items-center justify-between p-3 rounded-lg transition
								{isCurrentRoute(route.id)
								? 'border-2 border-[var(--primary)] bg-[var(--primary)]/10'
								: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'}"
							on:click={() => switchRoute(route.id)}
						>
							<div class="flex flex-col items-start gap-1">
								<div class="flex items-center gap-2">
									<span class="font-medium text-neutral-900 dark:text-neutral-100">
										{route.name}
									</span>
									{#if isCurrentRoute(route.id)}
										<span class="text-xs px-2 py-0.5 rounded bg-[var(--primary)] text-white">
											{i18n(I18nKey.routeSelectorCurrent)}
										</span>
									{/if}
								</div>
								<span class="text-xs text-neutral-600 dark:text-neutral-400">
									{route.description}
								</span>
							</div>

							<div class="flex flex-col items-end gap-1">
								{#if isTesting}
									<Icon icon="svg-spinners:ring-resize" class="text-lg" />
								{:else if latency}
									<span class="font-mono font-bold {getLatencyColorClass(latency.latency, latency.success)}">
										{getLatencyText(latency)}
									</span>
									<span class="text-xs text-neutral-500">
										{i18n(getLatencyDescriptionKey(latency.latency, latency.success) as any)}
									</span>
								{:else}
									<span class="text-neutral-400">-</span>
								{/if}
							</div>
						</button>
					{/each}
				{/if}
			</div>

			<!-- 说明文字 -->
			<div class="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
				<p class="text-xs text-neutral-500 dark:text-neutral-400 text-center">
					{i18n(I18nKey.routeSelectorClickToSwitch)}
				</p>
			</div>
		</div>
	{/if}
</div>

<style lang="stylus">
.float-panel
	box-shadow 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
</style>
