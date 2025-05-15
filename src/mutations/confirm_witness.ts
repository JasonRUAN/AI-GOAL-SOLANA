"use client";

import { SystemProgram } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCluster } from "@/components/solana/cluster-data-access";
import { useAnchorProvider } from "@/components/solana/solana-provider";
import { useTransactionToast } from "@/components/solana/use-transaction-toast";
import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { BN } from "@coral-xyz/anchor";

export function useConfirmWitness() {
    const { cluster } = useCluster();
    const transactionToast = useTransactionToast();
    const provider = useAnchorProvider();
    const { program, goal_accounts } = useAIGoalProgram();

    return useMutation({
        mutationKey: ["ai-goal", "confirm_witness", { cluster }],
        mutationFn: async (goalId: string | number) => {
            // 确保goalId是数字类型
            const numericGoalId =
                typeof goalId === "string"
                    ? Number.parseInt(goalId, 10)
                    : goalId;

            // 1. 获取目标账户
            const goalAccount = goal_accounts.data?.find(
                (account) => account.account.goalId.toNumber() === numericGoalId
            );

            if (!goalAccount) {
                throw new Error(`目标ID ${numericGoalId} 未找到`);
            }

            const goalPubkey = goalAccount.publicKey;

            console.log(`用户: ${provider.publicKey}`);
            console.log(`目标账户: ${goalPubkey.toBase58()}`);

            return program.methods
                .confirmWitness(new BN(numericGoalId))
                .accountsStrict({
                    witness: provider.publicKey,
                    goal: goalPubkey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
        },
        onSuccess: (signature) => {
            transactionToast(signature);
            toast.success("成功确认见证人！");
            // 重新获取程序的所有账户
            return goal_accounts.refetch();
        },
        onError: (error) => {
            const errorMsg = error.message;
            if (
                errorMsg.includes("AlreadyConfirmed") ||
                errorMsg.includes("已经确认过")
            ) {
                toast.error("您已经确认过该目标！");
            } else {
                toast.error(`确认见证人失败: ${errorMsg}`);
            }
        },
    });
}
