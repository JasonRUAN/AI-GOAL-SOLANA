"use client";

import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useCluster } from "@/components/solana/cluster-data-access";
import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { BN } from "@coral-xyz/anchor";
import type { ProgressUpdateDetail } from "@/types/move";

interface GetGoalProgressUpdatesArgs {
    goalId: number;
}

export function useGetGoalProgressUpdates({
    goalId,
}: GetGoalProgressUpdatesArgs) {
    const { cluster } = useCluster();
    const { program, programId, goal_accounts } = useAIGoalProgram();

    return useQuery({
        queryKey: ["ai-goal", "get_progress_updates", { cluster, goalId }],
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
            const progressUpdateCounter = goal.progressUpdateCounter.toNumber();

            // 2. 获取所有进度更新
            const progressUpdates: ProgressUpdateDetail[] = [];
            const goalIdBN = new BN(goalId);

            for (let i = 0; i < progressUpdateCounter; i++) {
                try {
                    const progressUpdateCounterBN = new BN(i);
                    const [progressUpdatePDA] =
                        PublicKey.findProgramAddressSync(
                            [
                                Buffer.from("progress"),
                                goalIdBN.toArrayLike(Buffer, "le", 8),
                                progressUpdateCounterBN.toArrayLike(
                                    Buffer,
                                    "le",
                                    8
                                ),
                            ],
                            programId
                        );

                    const progressUpdate =
                        await program.account.progressUpdate.fetch(
                            progressUpdatePDA
                        );
                    progressUpdates.push({
                        id: progressUpdate.id.toString(),
                        content: progressUpdate.content,
                        proof_file_blob_id: progressUpdate.proofFileBlobId,
                        creator: progressUpdate.creator.toBase58(),
                        created_at: progressUpdate.createdAt.toString(),
                    });
                } catch (error) {
                    console.error(`获取进度更新${i}失败:`, error);
                    // 继续获取下一个进度更新
                }
            }

            return progressUpdates;
        },
        enabled: !!goal_accounts.data,
        staleTime: 30 * 1000, // 30秒内数据视为新鲜
        refetchOnWindowFocus: false, // 窗口聚焦时不自动刷新
    });
}
