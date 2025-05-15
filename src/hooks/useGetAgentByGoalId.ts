import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { useCluster } from "@/components/solana/cluster-data-access";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { BN } from "@coral-xyz/anchor";

/**
 * 获取指定goalId对应的Agent账户
 */
export function useGetAgentByGoalId({ goalId }: { goalId: number }) {
    const { cluster } = useCluster();
    const { program, programId } = useAIGoalProgram();

    // 获取Agent PDA
    const getAgentPDA = (goalId: number) => {
        if (!programId) return null;

        const [agentPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("agent"), new BN(goalId).toArrayLike(Buffer, "le", 8)],
            programId
        );

        return agentPDA;
    };

    const agentPDA = goalId !== undefined ? getAgentPDA(goalId) : null;

    // 查询Agent账户
    const {
        data: agent,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["ai-goal", "agent", { cluster, goalId }],
        queryFn: async () => {
            if (!agentPDA) {
                return null;
            }
            return program.account.agent.fetch(agentPDA);
        },
        enabled: !!agentPDA && goalId !== undefined, // 只有当agentPDA和goalId存在时才启用查询
    });

    return {
        agentPDA,
        agent,
        isLoading,
        error,
        refetch,
    };
}
