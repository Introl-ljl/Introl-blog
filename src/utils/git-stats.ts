import { execSync } from "child_process";
import { existsSync } from "fs";
import * as path from "path";

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


    // 解析与兜底：优先使用传入路径；不存在则尝试当前项目根目录
    let resolvedRepoPath = repoPath;
    if (!existsSync(resolvedRepoPath) && !existsSync(path.join(resolvedRepoPath, ".git"))) {
        const fallbackGitDir = path.join(process.cwd(), ".git");
        if (existsSync(fallbackGitDir)) {
            resolvedRepoPath = fallbackGitDir;
        } else {
            console.warn(`Git repository not found at: ${repoPath}`);
            return generateEmptyData(days);
        }
    }

	try {
		// 计算开始日期
		const endDate = new Date();
        const startDate = new Date();
        // 确保区间包含 endDate 且总天数为 days
        startDate.setDate(endDate.getDate() - (days - 1));

        const startDateStr = formatDateLocal(startDate);
        const endDateStr = formatDateLocal(endDate);

        // 选择作为工作目录的路径：
        // - 若传入的是 .git 目录，则取其上级目录作为工作目录
        // - 若传入的是工作区根目录（包含 .git），则直接作为工作目录
        // 这样可以避免在 Windows 上对 --git-dir 的复杂转义问题
        const isGitDir = path.basename(resolvedRepoPath) === ".git";
        const workDir = isGitDir ? path.resolve(path.dirname(resolvedRepoPath)) : path.resolve(resolvedRepoPath);

        // 为确保 "endDate" 当天的提交不会被排除，这里不设置 --until，而是只设置 --since
        // git 的 --since 使用本地时区解析日期字符串
        let gitCommand = `git log --since="${startDateStr}" --pretty=format:"%ad" --date=short`;
        if (author) {
            gitCommand += ` --author="${author}"`;
        }

        // 执行 git 命令获取提交日期列表（在工作目录下执行）
        const output = execSync(gitCommand, { encoding: "utf-8", cwd: workDir }).trim();

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
            const dateStr = formatDateLocal(currentDate);
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
 * 以本地时区格式化日期为 YYYY-MM-DD
 */
function formatDateLocal(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/**
 * 生成空的数据数组（用于错误情况）
 * @param days 天数
 * @returns 空的提交数据数组
 */
function generateEmptyData(days: number): GitCommitData[] {
    const result: GitCommitData[] = [];
    const endDate = new Date();
    const currentDate = new Date();
    // 区间与 fetchLocalGitStats 一致：包含今天，总长度为 days
    currentDate.setDate(endDate.getDate() - (days - 1));

    for (let i = 0; i < days; i++) {
        result.push({
            date: formatDateLocal(currentDate),
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
    // 解析与兜底路径
    let resolvedRepoPath = repoPath;
    if (!existsSync(resolvedRepoPath) && !existsSync(path.join(resolvedRepoPath, ".git"))) {
        const fallbackGitDir = path.join(process.cwd(), ".git");
        if (existsSync(fallbackGitDir)) {
            resolvedRepoPath = fallbackGitDir;
        } else {
            return null;
        }
    }

    try {
        // 解析工作目录（同上逻辑）
        const isGitDir = path.basename(resolvedRepoPath) === ".git";
        const workDir = isGitDir ? path.resolve(path.dirname(resolvedRepoPath)) : path.resolve(resolvedRepoPath);

        // 获取总提交数
        const totalCommits = execSync(
            `git rev-list --all --count`,
            { encoding: "utf-8", cwd: workDir },
        ).trim();

        // 获取最近提交日期
        const lastCommitDate = execSync(
            `git log -1 --pretty=format:"%ad" --date=short`,
            { encoding: "utf-8", cwd: workDir },
        ).trim();

        // 获取第一次提交日期（避免使用 head，在 Windows 上不兼容）
        const firstHash = execSync(
            `git rev-list --max-parents=0 HEAD`,
            { encoding: "utf-8", cwd: workDir },
        ).split("\n")[0].trim();

        const firstCommitDate = firstHash
            ? execSync(
                `git log -1 --pretty=format:"%ad" --date=short ${firstHash}`,
                { encoding: "utf-8", cwd: workDir },
            ).trim()
            : "";

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
