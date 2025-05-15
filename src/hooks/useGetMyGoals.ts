import { useWallet } from "@solana/wallet-adapter-react";
import { useGetMultipleGoals } from "./useGetMultipleGoals";
import { useUserGoalIds } from "./useGetUserGoalIds";
import type { PublicKey } from "@solana/web3.js";

export function useGetMyGoals() {
    const { publicKey } = useWallet();

    const { userGoalIds } = useUserGoalIds({
        owner: publicKey as PublicKey,
    });

    const { data: goals } = useGetMultipleGoals({
        goalIds: userGoalIds as string[],
    });

    return {
        data: goals || [],
        isLoading: false,
        error: null,
    };
}
