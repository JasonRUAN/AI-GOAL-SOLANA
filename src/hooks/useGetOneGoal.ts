import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { useCluster } from "@/components/solana/cluster-data-access";
import { useQuery } from "@tanstack/react-query";

export function useGetOneGoal({ goalId }: { goalId: number }) {
    const { cluster } = useCluster();
    const { program, getGoalPDAForId } = useAIGoalProgram();

    // 获取Goal PDA
    const goalPDA = getGoalPDAForId(goalId);

    // 查询Goal账户
    const {
        data: goal,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["ai-goal", "goal", { cluster, goalId }],
        queryFn: async () => {
            if (!goalPDA) {
                return null;
            }
            return program.account.goalInfo.fetch(goalPDA);
        },
        enabled: !!goalPDA && goalId !== undefined, // 只有当goalPDA和goalId存在时才启用查询
    });

    return {
        goalPDA,
        goal,
        isLoading,
        error,
        refetch,
    };
}
