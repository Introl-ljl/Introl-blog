import { execSync } from "child_process";
import { existsSync } from "fs";

/**
 * Git提交数据接口
 */
export interface GitCommitData {
	date: string; // YYYY-MM-DD格式
	commits: number; // 提交次数
	intensity: number; // 强度等级 0-4
}

/**
 * Git统计配置接口
 */
export interface GitStatsConfig {
	repoPath: string; // Git仓库路径
	days?: number; // 统计天数，默认365
	author?: string; // 作者过滤，可选
}

/**
 * 获取本地Git仓库的提交统计数据
 * @param config Git统计配置
 * @returns 提交数据数组
 */
export async function fetchLocalGitStats(
	config: GitStatsConfig,
): Promise<GitCommitData[]> {
	const { repoPath, days = 365, author } = config;

	// 在生产环境中直接返回空数据，避免服务器环境问题
	if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
		console.log('Production environment detected, skipping git stats');
		return generateEmptyData(days);
	}

	// 检查仓库路径是否存在
	if (!existsSync(repoPath)) {
		console.warn(`Git repository not found at: ${repoPath}`);
		return generateEmptyData(days);
	}

	try {
		// 计算开始日期
		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(endDate.getDate() - days);

		const startDateStr = startDate.toISOString().split("T")[0];
		const endDateStr = endDate.toISOString().split("T")[0];

		// 构建git log命令
		// 如果repoPath是相对路径，直接使用git命令而不指定git-dir
		let gitCommand;
		if (repoPath === './.git' || repoPath === '.git') {
			gitCommand = `git log --since="${startDateStr}" --until="${endDateStr}" --pretty=format:"%ad" --date=short`;
		} else {
			gitCommand = `git --git-dir="${repoPath}" log --since="${startDateStr}" --until="${endDateStr}" --pretty=format:"%ad" --date=short`;
		}

		// 如果指定了作者，添加作者过滤
		if (author) {
			gitCommand += ` --author="${author}"`;
		}

		// 执行git命令获取提交日期列表
		const output = execSync(gitCommand, { encoding: "utf-8" }).trim();

		if (!output) {
			console.log("No commits found in the specified date range");
			return generateEmptyData(days);
		}

		// 解析提交日期并统计每日提交次数
		const commitDates = output.split("\n").filter((date) => date.trim());
		const commitCounts = new Map<string, number>();

		commitDates.forEach((date) => {
			const count = commitCounts.get(date) || 0;
			commitCounts.set(date, count + 1);
		});

		// 生成完整的日期范围数据
		const result: GitCommitData[] = [];
		const currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			const dateStr = currentDate.toISOString().split("T")[0];
			const commits = commitCounts.get(dateStr) || 0;
			const intensity = calculateIntensity(commits);

			result.push({
				date: dateStr,
				commits,
				intensity,
			});

			currentDate.setDate(currentDate.getDate() + 1);
		}

		return result;
	} catch (error) {
		console.error("Error fetching local git stats:", error);
		return generateEmptyData(days);
	}
}

/**
 * 根据提交次数计算强度等级
 * @param commits 提交次数
 * @returns 强度等级 (0-4)
 */
function calculateIntensity(commits: number): number {
	if (commits === 0) return 0;
	if (commits <= 2) return 1;
	if (commits <= 4) return 2;
	if (commits <= 6) return 3;
	return 4;
}

/**
 * 生成空的数据数组（用于错误情况）
 * @param days 天数
 * @returns 空的提交数据数组
 */
function generateEmptyData(days: number): GitCommitData[] {
	const result: GitCommitData[] = [];
	const currentDate = new Date();
	currentDate.setDate(currentDate.getDate() - days);

	for (let i = 0; i < days; i++) {
		result.push({
			date: currentDate.toISOString().split("T")[0],
			commits: 0,
			intensity: 0,
		});
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return result;
}

/**
 * 获取Git仓库的基本统计信息
 * @param repoPath Git仓库路径
 * @returns 统计信息对象
 */
export async function getGitRepoStats(repoPath: string) {
	if (!existsSync(repoPath)) {
		return null;
	}

	try {
		// 根据路径类型选择命令前缀
		const gitPrefix = (repoPath === './.git' || repoPath === '.git') ? 'git' : `git --git-dir="${repoPath}"`;

		// 获取总提交数
		const totalCommits = execSync(
			`${gitPrefix} rev-list --all --count`,
			{ encoding: "utf-8" },
		).trim();

		// 获取最近提交日期
		const lastCommitDate = execSync(
			`${gitPrefix} log -1 --pretty=format:"%ad" --date=short`,
			{ encoding: "utf-8" },
		).trim();

		// 获取第一次提交日期
		const firstCommitDate = execSync(
			`${gitPrefix} log --reverse --pretty=format:"%ad" --date=short | head -1`,
			{ encoding: "utf-8" },
		).trim();

		return {
			totalCommits: Number.parseInt(totalCommits) || 0,
			lastCommitDate,
			firstCommitDate,
			repoPath,
		};
	} catch (error) {
		console.error("Error getting git repo stats:", error);
		return null;
	}
}

/**
 * 合并多个Git数据源
 * @param dataSources 数据源数组
 * @returns 合并后的数据
 */
export function mergeGitData(dataSources: GitCommitData[][]): GitCommitData[] {
	if (dataSources.length === 0) return [];
	if (dataSources.length === 1) return dataSources[0];

	const mergedMap = new Map<string, { commits: number; intensity: number }>();

	// 合并所有数据源
	dataSources.forEach((dataSource) => {
		dataSource.forEach((day) => {
			const existing = mergedMap.get(day.date) || { commits: 0, intensity: 0 };
			mergedMap.set(day.date, {
				commits: existing.commits + day.commits,
				intensity: Math.max(existing.intensity, day.intensity),
			});
		});
	});

	// 转换为数组并重新计算强度
	const result: GitCommitData[] = [];
	mergedMap.forEach((value, date) => {
		result.push({
			date,
			commits: value.commits,
			intensity: calculateIntensity(value.commits),
		});
	});

	// 按日期排序
	return result.sort((a, b) => a.date.localeCompare(b.date));
}
