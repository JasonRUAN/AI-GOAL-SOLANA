import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { useQuery } from "@tanstack/react-query";
import { useCluster } from "@/components/solana/cluster-data-access";
import { useGetMultipleGoals } from "./useGetMultipleGoals";

export function useGetAllGoals() {
    const { cluster } = useCluster();
    const { program } = useAIGoalProgram();

    // 首先查询goal_manager账户以获取所有目标ID
    const { data: goalManagerAccounts, isLoading: isLoadingGoalManager } =
        useQuery({
            queryKey: ["goal-manager", "all", { cluster }],
            queryFn: () => program.account.goalManagerInfo.all(),
        });

    // 从goalManager中提取所有目标ID
    const allGoalIds = (() => {
        if (!goalManagerAccounts || goalManagerAccounts.length === 0) return [];

        const goalManager = goalManagerAccounts[0].account;
        return [
            ...goalManager.activeGoals,
            ...goalManager.completedGoals,
            ...goalManager.failedGoals,
        ].map((id) => id.toString());
    })();

    // 使用useGetMultipleGoals获取所有目标的详细信息
    const { data: goals, isLoading: isLoadingGoals } = useGetMultipleGoals({
        goalIds: allGoalIds,
    });

    return {
        data: goals || [],
        isLoading: isLoadingGoalManager || isLoadingGoals,
        error: null,
    };
}
