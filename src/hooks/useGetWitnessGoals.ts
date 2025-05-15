import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { useCluster } from "@/components/solana/cluster-data-access";
import { QueryKey } from "@/constants";
import { getOneGoal } from "@/lib/anchorClient";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

/**
 * 获取当前用户作为证人的目标列表
 *
 * @returns 当前用户作为证人的目标列表及加载状态
 */
export function useGetWitnessGoals() {
    const { publicKey } = useWallet();
    const { cluster } = useCluster();
    const { program, getWitnessGoalsPDAForWitness } = useAIGoalProgram();
    const connection = new Connection("https://api.devnet.solana.com");

    // 获取WitnessGoals PDA
    const witnessGoalsPDA = publicKey
        ? getWitnessGoalsPDAForWitness(publicKey)
        : null;

    // 查询WitnessGoals账户，只有当witnessGoalsPDA存在时才执行查询
    const { data: witnessGoals, isLoading: isLoadingWitnessGoals } = useQuery({
        queryKey: [
            "ai-goal",
            "witness-goals",
            { cluster, witness: publicKey?.toString() },
        ],
        queryFn: async () => {
            if (!witnessGoalsPDA) {
                return null;
            }
            try {
                return await program.account.witnessGoalsInfo.fetch(
                    witnessGoalsPDA
                );
            } catch (error) {
                console.error("Failed to fetch witness goals:", error);
                return null;
            }
        },
        enabled: !!witnessGoalsPDA && !!publicKey, // 只有当witnessGoalsPDA和publicKey存在时才启用查询
    });

    console.log("witnessGoals: ", JSON.stringify(witnessGoals, null, 2));

    // 获取目标详情
    const { data: goals, isLoading: isLoadingGoals } = useQuery({
        queryKey: [QueryKey.GetWitnessGoalsQueryKey, witnessGoals?.goalIds],
        queryFn: async () => {
            if (!witnessGoals?.goalIds || witnessGoals.goalIds.length === 0) {
                return [];
            }

            const promises = witnessGoals.goalIds.map(
                async (goalId: string) => {
                    try {
                        const result = await getOneGoal({
                            connection,
                            goalId: Number.parseInt(goalId),
                            network: "devnet",
                        });
                        return result;
                    } catch (error) {
                        console.error(
                            `Failed to fetch goal with ID ${goalId}:`,
                            error
                        );
                        return null;
                    }
                }
            );

            const results = await Promise.all(promises);
            return results.filter(Boolean); // 过滤掉null结果
        },
        enabled: !!witnessGoals?.goalIds && witnessGoals.goalIds.length > 0,
    });

    return {
        data: goals || [],
        isLoading: isLoadingWitnessGoals || isLoadingGoals,
        error: null,
        witnessGoalsPDA,
        witnessGoalIds: witnessGoals?.goalIds || [],
    };
}
