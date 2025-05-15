import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { useCluster } from "@/components/solana/cluster-data-access";
import type { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

export function useUserGoalIds({ owner }: { owner: PublicKey }) {
    const { cluster } = useCluster();
    const { program, getUserGoalsPDAForOwner } = useAIGoalProgram();

    // 获取UserGoals PDA
    const userGoalsPDA = getUserGoalsPDAForOwner(owner);

    // 查询UserGoals账户，只有当userGoalsPDA存在时才执行查询
    const { data: userGoals } = useQuery({
        queryKey: [
            "ai-goal",
            "user-goals",
            { cluster, owner: owner?.toString() },
        ],
        queryFn: () => {
            if (!userGoalsPDA) {
                return null;
            }
            return program.account.userGoalsInfo.fetch(userGoalsPDA);
        },
        enabled: !!userGoalsPDA && !!owner, // 只有当userGoalsPDA和owner存在时才启用查询
    });

    return {
        userGoalsPDA,
        userGoalIds: userGoals?.goalIds,
    };
}
