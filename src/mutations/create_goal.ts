"use client";

import { PublicKey, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCluster } from "@/components/solana/cluster-data-access";
import { useAnchorProvider } from "@/components/solana/solana-provider";
import { useTransactionToast } from "@/components/solana/use-transaction-toast";
import { BN } from "@coral-xyz/anchor";
import { useAIGoalProgram } from "@/components/solana/ai-goal/ai-goal-data-access";
import { Transaction } from "@solana/web3.js";

interface CreateEntryArgs {
    title: string;
    description: string;
    ai_suggestion: string;
    deadline: number;
    witnesses: PublicKey[];
    amount: number;
}

export function useCreateGoal() {
    const { cluster } = useCluster();
    const transactionToast = useTransactionToast();
    const provider = useAnchorProvider();
    const { program, programId, goal_manager_accounts, goal_accounts } =
        useAIGoalProgram();

    return useMutation({
        mutationKey: ["ai-goal", "create_goal", { cluster }],
        mutationFn: async ({
            title,
            description,
            ai_suggestion,
            deadline,
            witnesses,
            amount,
        }: CreateEntryArgs) => {
            console.log(`@@@ programId1 : ${programId}`);

            // 获取GoalManager账户
            const goalManager = goal_manager_accounts.data?.[0]?.publicKey;
            console.log(
                "### goalManager",
                JSON.stringify(goal_manager_accounts, null, 2)
            );

            // 实现获取或创建goal、userGoals和witnessGoals的逻辑
            if (!goalManager) {
                throw new Error("Goal manager not found");
            }

            // 1. 获取当前目标ID
            const goalManagerAccount =
                await program.account.goalManagerInfo.fetch(goalManager);
            const goalId = goalManagerAccount.goalCount;

            console.log(`%%% goalId: ${goalId}`);

            // 2. 获取Goal PDA
            const [goalPDA] = PublicKey.findProgramAddressSync(
                [goalId.toArrayLike(Buffer, "le", 8)],
                programId
            );

            // 3. 获取UserGoals PDA
            const [userGoalsPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("user_goals"), provider.publicKey.toBuffer()],
                programId
            );

            // 4. 获取WitnessGoals PDA
            const [witnessGoalsPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("witness_goals"), provider.publicKey.toBuffer()],
                programId
            );

            console.log(`Owner: ${provider.publicKey}`);
            console.log(`goalManager: ${goalManager.toBase58()}`);
            console.log(`目标ID: ${goalId.toString()}`);
            console.log(`目标PDA: ${goalPDA.toBase58()}`);
            console.log(`用户目标PDA: ${userGoalsPDA.toBase58()}`);
            console.log(`见证人目标PDA: ${witnessGoalsPDA.toBase58()}`);

            const lamportsAmount = new BN(amount * LAMPORTS_PER_SOL);
            console.log(`lamportsAmount: ${lamportsAmount}`);

            console.log(`@@@ witnesses: ${witnesses}`);
            console.log(`@@@ deadline: ${deadline / 1000}`);

            const deadlineBN = new BN(Math.floor(deadline / 1000));

            // 创建创建目标的指令
            const createGoalIx = await program.methods
                .createGoal(
                    title,
                    description,
                    ai_suggestion,
                    deadlineBN,
                    witnesses,
                    lamportsAmount
                )
                .accountsStrict({
                    owner: provider.publicKey,
                    goalManager,
                    goal: goalPDA,
                    userGoals: userGoalsPDA,
                    systemProgram: SystemProgram.programId,
                })
                .instruction();

            // 为每个见证人创建初始化指令
            const initWitnessInstructions = await Promise.all(
                witnesses.map(async (witness) => {
                    // 获取见证人的 WitnessGoalsInfo PDA
                    const [witnessGoalsPDA] = PublicKey.findProgramAddressSync(
                        [Buffer.from("witness_goals"), witness.toBuffer()],
                        programId
                    );

                    console.log(
                        `见证人 ${witness.toBase58()} 的 PDA: ${witnessGoalsPDA.toBase58()}`
                    );

                    return program.methods
                        .initWitnessGoalData(goalId, witness)
                        .accountsStrict({
                            owner: provider.publicKey,
                            goal: goalPDA,
                            witnessGoals: witnessGoalsPDA,
                            systemProgram: SystemProgram.programId,
                        })
                        .instruction();
                })
            );

            // 创建交易并添加所有指令
            const transaction = new Transaction();
            transaction.add(createGoalIx);

            // 添加见证人初始化指令
            for (const ix of initWitnessInstructions) {
                transaction.add(ix);
            }

            // 发送并确认交易
            return await provider.sendAndConfirm(transaction);
        },
        onSuccess: (signature) => {
            transactionToast(signature);
            // 重新获取程序的所有账户
            return goal_accounts.refetch();
        },
        onError: (error) =>
            toast.error(`Failed to create goal: ${error.message}`),
    });
}
