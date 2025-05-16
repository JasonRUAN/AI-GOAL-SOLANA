// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";
import AIGoalIDL from "../target/idl/ai_goal.json";
import type { AiGoal } from "../target/types/ai_goal";

// Re-export the generated IDL and type
export { AiGoal, AIGoalIDL };

// The programId is imported from the program IDL.
export const AI_GOAL_PROGRAM_ID = new PublicKey(AIGoalIDL.address);

// This is a helper function to get the Counter Anchor program.
export function getAIGoalProgram(
    provider: AnchorProvider,
    address?: PublicKey
): Program<AiGoal> {
    return new Program(
        {
            ...AIGoalIDL,
            address: address ? address.toBase58() : AIGoalIDL.address,
        } as AiGoal,
        provider
    );
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getAIGoalProgramId(cluster: Cluster) {
    switch (cluster) {
        case "devnet":
        case "testnet":
            // This is the program ID for the Counter program on devnet and testnet.
            return new PublicKey(
                "95zvvX88Cuy5mWGkpJzawYmh9NqY9ksREPzBcdeWM8WM"
            );
        case "mainnet-beta":
        default:
            return AI_GOAL_PROGRAM_ID;
    }
}
