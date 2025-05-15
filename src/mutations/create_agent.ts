"use client";

import { SystemProgram, PublicKey } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCluster } from "@/components/solana/cluster-data-access";
import { useAnchorProvider } from "@/components/solana/solana-provider";
import { useTransactionToast } from "@/components/solana/use-transaction-toast";
import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { BN } from "@coral-xyz/anchor";

interface CreateAgentArgs {
    goalId: number;
    agentId: string;
    agentName: string;
    characterJson: string;
}

export function useCreateAgent() {
    const { cluster } = useCluster();
    const transactionToast = useTransactionToast();
    const provider = useAnchorProvider();
    const { program, programId, goal_accounts } = useAIGoalProgram();

    return useMutation({
        mutationKey: ["ai-goal", "create_agent", { cluster }],
        mutationFn: async ({
            goalId,
            agentId,
            agentName,
            characterJson,
        }: CreateAgentArgs) => {
            // 1. 获取目标账户
            const goalAccount = goal_accounts.data?.find(
                (account) => account.account.goalId.toNumber() === goalId
            );

            if (!goalAccount) {
                throw new Error(`目标ID ${goalId} 未找到`);
            }

            const goalPubkey = goalAccount.publicKey;

            // 2. 获取Agent PDA
            const [agentPDA] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("agent"),
                    new BN(goalId).toArrayLike(Buffer, "le", 8),
                ],
                programId
            );

            console.log(`用户: ${provider.publicKey}`);
            console.log(`目标账户: ${goalPubkey.toBase58()}`);
            console.log(`Agent PDA: ${agentPDA.toBase58()}`);

            return program.methods
                .createAgent(agentId, agentName, characterJson)
                .accountsStrict({
                    signer: provider.publicKey!,
                    goal: goalPubkey,
                    agent: agentPDA,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
        },
        onSuccess: (signature) => {
            transactionToast(signature);
            toast.success("成功创建AI助手！");
            // 重新获取程序的所有账户
            return goal_accounts.refetch();
        },
        onError: (error) => {
            const errorMsg = error.message;
            if (
                errorMsg.includes("AlreadyExists") ||
                errorMsg.includes("already exists")
            ) {
                toast.error("该目标已经创建了AI助手！");
            } else {
                toast.error(`创建AI助手失败: ${errorMsg}`);
            }
        },
    });
}
