"use client";

import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCluster } from "@/components/solana/cluster-data-access";
import { useAnchorProvider } from "@/components/solana/solana-provider";
import { useTransactionToast } from "@/components/solana/use-transaction-toast";
import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { BN } from "@coral-xyz/anchor";

interface CreateCommentArgs {
    goalId: number;
    content: string;
}

export function useCreateComment() {
    const { cluster } = useCluster();
    const transactionToast = useTransactionToast();
    const provider = useAnchorProvider();
    const { program, programId, goal_accounts } = useAIGoalProgram();

    return useMutation({
        mutationKey: ["ai-goal", "create_comment", { cluster }],
        mutationFn: async ({ goalId, content }: CreateCommentArgs) => {
            // 1. 获取目标账户
            const goalAccount = goal_accounts.data?.find(
                (account) => account.account.goalId.toNumber() === goalId
            );

            if (!goalAccount) {
                throw new Error(`Goal with ID ${goalId} not found`);
            }

            const goalPubkey = goalAccount.publicKey;
            const goal = goalAccount.account;

            // 2. 创建评论PDA
            const commentCounter = goal.commentCounter.toNumber();
            const goalIdBN = new BN(goalId);
            const commentCounterBN = new BN(commentCounter);

            const [commentPDA] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("comment"),
                    goalIdBN.toArrayLike(Buffer, "le", 8),
                    commentCounterBN.toArrayLike(Buffer, "le", 8),
                ],
                programId
            );

            console.log(`用户: ${provider.publicKey}`);
            console.log(`目标账户: ${goalPubkey.toBase58()}`);
            console.log(`评论PDA: ${commentPDA.toBase58()}`);
            console.log(`评论内容: ${content}`);

            return program.methods
                .createComment(new BN(goalId), content)
                .accountsStrict({
                    user: provider.publicKey!,
                    goal: goalPubkey,
                    comment: commentPDA,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
        },
        onSuccess: (signature) => {
            transactionToast(signature);
            // 重新获取程序的所有账户
            return goal_accounts.refetch();
        },
        onError: (error) => toast.error(`创建评论失败: ${error.message}`),
    });
}
