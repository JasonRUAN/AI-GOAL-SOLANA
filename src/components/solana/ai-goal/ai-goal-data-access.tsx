"use client";

import { getAIGoalProgram, getAIGoalProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useCluster } from "../cluster-data-access";
import { useAnchorProvider } from "../solana-provider";
import { useTransactionToast } from "../use-transaction-toast";
import { BN } from "@coral-xyz/anchor";

// 添加UserGoals相关常量
const USER_GOALS_SEED = "user_goals";
// 添加WitnessGoals相关常量
const WITNESS_GOALS_SEED = "witness_goals";

// 用于获取goalPDA的工具函数
export function getGoalPDA(goalId: number, programId: PublicKey): PublicKey {
    const [goalPDA] = PublicKey.findProgramAddressSync(
        [new BN(goalId).toArrayLike(Buffer, "le", 8)],
        programId
    );
    return goalPDA;
}

// 用于获取UserGoalsPDA的工具函数
export function getUserGoalsPDA(
    owner: PublicKey,
    programId: PublicKey
): PublicKey | null {
    // 检查owner和programId是否有效
    if (!owner || !programId) {
        return null;
    }

    const [userGoalsPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from(USER_GOALS_SEED), owner.toBuffer()],
        programId
    );
    return userGoalsPDA;
}

// 用于获取WitnessGoalsPDA的工具函数
export function getWitnessGoalsPDA(
    witness: PublicKey,
    programId: PublicKey
): PublicKey | null {
    // 检查witness和programId是否有效
    if (!witness || !programId) {
        return null;
    }

    const [witnessGoalsPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from(WITNESS_GOALS_SEED), witness.toBuffer()],
        programId
    );
    return witnessGoalsPDA;
}

export function useAIGoalProgram() {
    const { connection } = useConnection();
    const { cluster } = useCluster();
    const transactionToast = useTransactionToast();
    const provider = useAnchorProvider();
    const programId = useMemo(
        () => getAIGoalProgramId(cluster.network as Cluster),
        [cluster]
    );

    const program = useMemo(
        () => getAIGoalProgram(provider, programId),
        [provider, programId]
    );

    // 获取goalPDA的函数
    const getGoalPDAForId = useCallback(
        (goalId: number) => {
            return getGoalPDA(goalId, programId);
        },
        [programId]
    );

    // 获取userGoalsPDA的函数
    const getUserGoalsPDAForOwner = useCallback(
        (owner: PublicKey) => {
            if (!owner) {
                return null;
            }
            return getUserGoalsPDA(owner, programId);
        },
        [programId]
    );

    // 获取witnessGoalsPDA的函数
    const getWitnessGoalsPDAForWitness = useCallback(
        (witness: PublicKey) => {
            if (!witness) {
                return null;
            }
            return getWitnessGoalsPDA(witness, programId);
        },
        [programId]
    );

    const goal_manager_accounts = useQuery({
        queryKey: ["goal-manager", "all", { cluster }],
        queryFn: () => program.account.goalManagerInfo.all(),
    });

    const initializeGoalManager = useMutation({
        mutationKey: ["ai-goal", "initialize-goal-manager", { cluster }],
        mutationFn: () => program.methods.initializeGoalManager().rpc(),
        onSuccess: (signature) => {
            transactionToast(signature);
            return goal_manager_accounts.refetch();
        },
        onError: () => toast.error("Failed to initialize account"),
    });

    const goal_accounts = useQuery({
        queryKey: ["goal", "all", { cluster }],
        queryFn: () => program.account.goalInfo.all(),
    });

    const getProgramAccount = useQuery({
        queryKey: ["get-ai-goal-program-account", { cluster }],
        queryFn: () => connection.getParsedAccountInfo(programId),
    });

    return {
        program,
        programId,
        goal_manager_accounts,
        goal_accounts,
        getProgramAccount,
        initializeGoalManager,
        getGoalPDAForId,
        getUserGoalsPDAForOwner,
        getWitnessGoalsPDAForWitness,
    };
}

// // 查询特定用户的UserGoals账户
// export function useUserGoalsAccount({ owner }: { owner: PublicKey }) {
//     const { cluster } = useCluster();
//     const { program, getUserGoalsPDAForOwner } = useAIGoalProgram();

//     // 获取UserGoals PDA
//     const userGoalsPDA = getUserGoalsPDAForOwner(owner);

//     // 查询UserGoals账户
//     const userGoalsQuery = useQuery({
//         queryKey: [
//             "ai-goal",
//             "user-goals",
//             { cluster, owner: owner.toString() },
//         ],
//         queryFn: () => program.account.userGoalsInfo.fetch(userGoalsPDA),
//     });

//     return {
//         userGoalsPDA,
//         userGoalsQuery,
//     };
// }

export function useJournalProgramAccount({ account }: { account: PublicKey }) {
    const { cluster } = useCluster();
    const { program } = useAIGoalProgram();

    // 查询条目
    const accountQuery = useQuery({
        queryKey: ["ai-goal", "fetch", { cluster, account }],
        queryFn: () => program.account.goalInfo.fetch(account),
    });

    return {
        accountQuery,
    };
}
