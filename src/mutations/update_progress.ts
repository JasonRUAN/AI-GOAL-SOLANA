"use client";

import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCluster } from "@/components/solana/cluster-data-access";
import { useAnchorProvider } from "@/components/solana/solana-provider";
import { useTransactionToast } from "@/components/solana/use-transaction-toast";
import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { BN } from "@coral-xyz/anchor";

interface UpdateProgressArgs {
    goalId: number;
    content: string;
    percentage: number;
    proofFileBlobId: string;
}

export function useUpdateProgress() {
    const { cluster } = useCluster();
    const transactionToast = useTransactionToast();
    const provider = useAnchorProvider();
    const { program, programId, goal_accounts } = useAIGoalProgram();

    return useMutation({
        mutationKey: ["ai-goal", "update_progress", { cluster }],
        mutationFn: async ({
            goalId,
            content,
            percentage,
            proofFileBlobId,
        }: UpdateProgressArgs) => {
            // 1. 获取目标账户
            const goalAccount = goal_accounts.data?.find(
                (account) => account.account.goalId.toNumber() === goalId
            );

            if (!goalAccount) {
                throw new Error(`Goal with ID ${goalId} not found`);
            }

            const goalPubkey = goalAccount.publicKey;
            const goal = goalAccount.account;

            // 2. 创建进度更新PDA
            const progressUpdateId = goal.progressUpdateCounter.toNumber();
            const goalIdBN = new BN(goalId);
            const progressUpdateIdBN = new BN(progressUpdateId);

            const [progressUpdatePDA] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("progress"),
                    goalIdBN.toArrayLike(Buffer, "le", 8),
                    progressUpdateIdBN.toArrayLike(Buffer, "le", 8),
                ],
                programId
            );

            console.log(`用户: ${provider.publicKey}`);
            console.log(`目标账户: ${goalPubkey.toBase58()}`);
            console.log(`进度更新PDA: ${progressUpdatePDA.toBase58()}`);
            console.log(`进度更新ID: ${progressUpdateId}`);
            console.log(`进度内容: ${content}`);
            console.log(`进度百分比: ${percentage}`);
            console.log(`证明文件ID: ${proofFileBlobId}`);

            return program.methods
                .updateProgress(
                    new BN(goalId),
                    content,
                    new BN(percentage),
                    proofFileBlobId
                )
                .accountsStrict({
                    signer: provider.publicKey!,
                    goal: goalPubkey,
                    progressUpdate: progressUpdatePDA,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
        },
        onSuccess: (signature) => {
            transactionToast(signature);
            // 重新获取程序的所有账户
            return goal_accounts.refetch();
        },
        onError: (error) => toast.error(`更新进度失败: ${error.message}`),
    });
}
