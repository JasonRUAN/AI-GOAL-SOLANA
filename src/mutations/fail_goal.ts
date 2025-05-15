"use client";

import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCluster } from "@/components/solana/cluster-data-access";
import { useAnchorProvider } from "@/components/solana/solana-provider";
import { useTransactionToast } from "@/components/solana/use-transaction-toast";
import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { BN } from "@coral-xyz/anchor";

interface FailGoalArgs {
    goalId: number;
}

export function useFailGoal() {
    const { cluster } = useCluster();
    const transactionToast = useTransactionToast();
    const provider = useAnchorProvider();
    const { program, programId, goal_accounts } = useAIGoalProgram();

    return useMutation({
        mutationKey: ["ai-goal", "fail_goal", { cluster }],
        mutationFn: async ({ goalId }: FailGoalArgs) => {
            // 1. 获取目标账户
            const goalAccount = goal_accounts.data?.find(
                (account) => account.account.goalId.toNumber() === goalId
            );

            if (!goalAccount) {
                throw new Error(`Goal with ID ${goalId} not found`);
            }

            const goalPubkey = goalAccount.publicKey;

            // 2. 获取goal_manager的PDA
            const [goalManagerPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("goal_manager")],
                programId
            );

            console.log(`用户: ${provider.publicKey}`);
            console.log(`目标账户: ${goalPubkey.toBase58()}`);
            console.log(`目标管理器: ${goalManagerPDA.toBase58()}`);
            console.log(`失败目标ID: ${goalId}`);

            // 3. 调用合约标记目标失败
            return program.methods
                .failGoal(new BN(goalId))
                .accountsStrict({
                    signer: provider.publicKey,
                    goalManager: goalManagerPDA,
                    goal: goalPubkey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
        },
        onSuccess: (signature) => {
            transactionToast(signature);
            toast.success("目标已标记为失败！");
            // 重新获取程序的所有账户
            return goal_accounts.refetch();
        },
        onError: (error) => toast.error(`标记目标失败时出错: ${error.message}`),
    });
}
