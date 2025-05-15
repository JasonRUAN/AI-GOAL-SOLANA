import { Connection, PublicKey, Cluster } from "@solana/web3.js";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import {
    AiGoal,
    getAIGoalProgram,
    getAIGoalProgramId,
} from "anchor/src/ai-goal-exports";

// 用于获取goalPDA的工具函数
function getGoalPDA(goalId: number, programId: PublicKey): PublicKey {
    const [goalPDA] = PublicKey.findProgramAddressSync(
        [new BN(goalId).toArrayLike(Buffer, "le", 8)],
        programId
    );
    return goalPDA;
}

/**
 * 非Hook方式获取单个目标信息
 * @param connection Solana连接实例
 * @param goalId 目标ID
 * @param network 网络类型
 * @param wallet 钱包实例(可选)
 * @returns 返回目标信息和PDA
 */
export async function getOneGoal({
    connection,
    goalId,
    network = "devnet",
    wallet = null,
}: {
    connection: Connection;
    goalId: number;
    network?: Cluster;
    wallet?: null | Wallet;
}) {
    try {
        // 获取程序ID
        const programId = getAIGoalProgramId(network);

        // 创建Provider（如果提供了钱包）
        let provider;
        if (wallet) {
            provider = new AnchorProvider(connection, wallet, {
                commitment: "confirmed",
            });
        } else {
            // 创建一个只读的Provider
            provider = new AnchorProvider(
                connection,
                {
                    publicKey: PublicKey.default,
                    signTransaction: async () => {
                        throw new Error("Wallet not provided");
                    },
                    signAllTransactions: async () => {
                        throw new Error("Wallet not provided");
                    },
                },
                { commitment: "confirmed" }
            );
        }

        // 获取Program实例
        const program = getAIGoalProgram(
            provider,
            programId
        ) as Program<AiGoal>;

        // 获取Goal PDA
        const goalPDA = getGoalPDA(goalId, programId);

        if (!goalPDA) {
            return { goalPDA: null, goal: null, error: "无法获取目标PDA" };
        }

        // 获取目标账户数据
        const goal = await program.account.goalInfo.fetch(goalPDA);

        return {
            goalPDA,
            goal,
            error: null,
        };
    } catch (error) {
        return {
            goalPDA: null,
            goal: null,
            error: error instanceof Error ? error.message : "获取目标失败",
        };
    }
}
