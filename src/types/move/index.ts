import { PublicKey } from "@solana/web3.js";

export type GoalManager = {
    active_goals: string[];
    balance: string;
    completed_goals: string[];
    failed_goals: string[];
    goal_count: string;
    goals: DynamicFields;
    goal_2_agent: DynamicFields;
    user_goals: DynamicFields;
    witness_goals: DynamicFields;
};

export type UserGoalIds = {
    id: {
        id: string;
    };
    name: string;
    value: string[];
};

export type DynamicFields = {
    type: string;
    fields: {
        id: {
            id: string;
        };
        size: string;
    };
};

export type GoalFields = {
    type: string;
    fields: GoalDetail;
};

export type GoalPDAField = {
    goalPDA: string;
    goal: GoalDetail;
};

export type GoalDetail = {
    aiSuggestion: string;
    amount: string;
    confirmations: PublicKey[];
    owner: PublicKey;
    deadline: string;
    description: string;
    goalId: string;
    progressPercentage: number;
    status: number;
    title: string;
    witnesses: PublicKey[];
    createdAt: string;
    commentCounter: string;
    progressUpdateCounter: string;
};

export type CommentFields = {
    type: string;
    fields: CommentDetail;
};

export type CommentDetail = {
    id: string;
    creator: string;
    content: string;
    created_at: string;
};

export type ProgressUpdateFields = {
    type: string;
    fields: ProgressUpdateDetail;
};

export type ProgressUpdateDetail = {
    id: string;
    content: string;
    proof_file_blob_id: string;
    creator: string;
    created_at: string;
};
