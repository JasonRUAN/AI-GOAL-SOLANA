"use client";

import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useCluster } from "@/components/solana/cluster-data-access";
import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { BN } from "@coral-xyz/anchor";
import type { CommentDetail } from "@/types/move";

interface GetGoalCommentsArgs {
    goalId: number;
}

export function useGetGoalComments({ goalId }: GetGoalCommentsArgs) {
    const { cluster } = useCluster();
    const { program, programId, goal_accounts } = useAIGoalProgram();

    return useQuery({
        queryKey: ["ai-goal", "get_comments", { cluster, goalId }],
        queryFn: async () => {
            // 1. 获取目标账户
            const goalAccount = goal_accounts.data?.find(
                (account) => account.account.goalId.toNumber() === goalId
            );

            if (!goalAccount) {
                console.log(`未找到ID为${goalId}的目标`);
                return [];
            }

            const goal = goalAccount.account;
            const commentCounter = goal.commentCounter.toNumber();

            if (commentCounter === 0) {
                return [];
            }

            // 2. 获取所有评论
            const comments: CommentDetail[] = [];
            const goalIdBN = new BN(goalId);

            for (let i = 0; i < commentCounter; i++) {
                try {
                    const commentCounterBN = new BN(i);
                    const [commentPDA] = PublicKey.findProgramAddressSync(
                        [
                            Buffer.from("comment"),
                            goalIdBN.toArrayLike(Buffer, "le", 8),
                            commentCounterBN.toArrayLike(Buffer, "le", 8),
                        ],
                        programId
                    );

                    const comment = await program.account.comment.fetch(
                        commentPDA
                    );
                    comments.push({
                        id: comment.id.toString(),
                        content: comment.content,
                        creator: comment.creator.toBase58(),
                        created_at: comment.createdAt.toString(),
                    });
                } catch (error) {
                    console.error(`获取评论${i}失败:`, error);
                    // 继续获取下一个评论
                }
            }

            return comments;
        },
        enabled: !!goalId && !!goal_accounts.data,
        staleTime: 30 * 1000, // 30秒内数据视为新鲜
        refetchOnWindowFocus: false, // 窗口聚焦时不自动刷新
    });
}
