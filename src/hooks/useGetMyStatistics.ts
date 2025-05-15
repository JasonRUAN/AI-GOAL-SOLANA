import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { useCluster } from "@/components/solana/cluster-data-access";
import { useWallet } from "@solana/wallet-adapter-react";
import { useGetMyGoals } from "./useGetMyGoals";
import { useQuery } from "@tanstack/react-query";

/**
 * 获取用户的统计数据
 *
 * @returns 用户的统计数据及加载状态
 */
export function useGetMyStatistics() {
    const { publicKey } = useWallet();
    const { cluster } = useCluster();
    const { program } = useAIGoalProgram();

    // 获取用户的所有目标
    const { data: myGoals, isLoading: isLoadingMyGoals } = useGetMyGoals();

    // 获取 GoalManager 账户信息
    const { isLoading: isLoadingGoalManager } = useQuery({
        queryKey: ["goal-manager", "all", { cluster }],
        queryFn: () => program.account.goalManagerInfo.all(),
        enabled: !!publicKey,
    });

    // 计算统计数据
    const statistics = useQuery({
        queryKey: [
            "ai-goal",
            "my-statistics",
            { cluster, owner: publicKey?.toString() },
        ],
        queryFn: () => {
            // 如果没有目标数据，返回默认值
            if (!myGoals || myGoals.length === 0) {
                return {
                    totalGoals: 0,
                    activeGoals: 0,
                    completedGoals: 0,
                    failedGoals: 0,
                    avgCompletionRate: 0,
                    totalStake: 0,
                };
            }

            // 统计不同状态的目标数量
            let activeGoals = 0;
            let completedGoals = 0;
            let failedGoals = 0;
            let totalCompletionRate = 0;
            let completedOrFailedGoals = 0;
            let totalStake = 0;

            for (const goalData of myGoals) {
                // 确保目标对象存在
                if (!goalData || !goalData.goal) continue;

                const goal = goalData.goal;

                // 根据状态值统计
                // status: 0 = active, 1 = completed, 2 = failed
                if (goal.status === 0) {
                    activeGoals++;
                } else if (goal.status === 1) {
                    completedGoals++;
                    totalCompletionRate += goal.progressPercentage
                        ? goal.progressPercentage.toNumber()
                        : 0;
                    completedOrFailedGoals++;
                } else if (goal.status === 2) {
                    failedGoals++;
                    totalCompletionRate += goal.progressPercentage
                        ? goal.progressPercentage.toNumber()
                        : 0;
                    completedOrFailedGoals++;
                }

                // 累计质押金额
                if (goal.amount) {
                    totalStake += goal.amount.toNumber();
                }
            }

            const totalGoals = myGoals.length;
            const avgCompletionRate =
                completedOrFailedGoals > 0
                    ? Math.round(totalCompletionRate / completedOrFailedGoals)
                    : 0;

            return {
                totalGoals,
                activeGoals,
                completedGoals,
                failedGoals,
                avgCompletionRate,
                totalStake,
            };
        },
        enabled: !!myGoals && !isLoadingMyGoals,
    });

    return {
        data: statistics.data,
        isLoading:
            isLoadingMyGoals || isLoadingGoalManager || statistics.isLoading,
        error: statistics.error,
    };
}
