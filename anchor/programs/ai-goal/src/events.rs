use anchor_lang::prelude::Pubkey;
use anchor_lang::prelude::*;

#[event]
pub struct EventGoalCreated {
    pub goal_id: u64,
    pub creator: Pubkey,
    pub title: String,
    pub amount: u64,
}

#[event]
pub struct EventGoalCountUpdated {
    pub goal_count: u64,
}

#[event]
pub struct EventWitnessConfirmed {
    pub goal_id: u64,
    pub witness: Pubkey,
}

#[event]
pub struct EventGoalCompleted {
    pub goal_id: u64,
    pub completer: Pubkey,
}

#[event]
pub struct EventGoalFailed {
    pub goal_id: u64,
    pub failer: Pubkey,
}

#[event]
pub struct CommentCreatedEvent {
    pub goal_id: u64,
    pub comment_id: u64,
    pub creator: Pubkey,
    pub content: String,
}

#[event]
pub struct ProgressUpdateEvent {
    pub goal_id: u64,
    pub update_id: u64,
    pub creator: Pubkey,
    pub content: String,
    pub progress_percentage: u64,
    pub proof_file_blob_id: String,
}

#[event]
pub struct CreateAgentEvent {
    pub agent_id: String,
    pub agent_name: String,
    pub charactor_json: String,
}

#[event]
pub struct EventWitnessGoalAdded {
    pub goal_id: u64,
    pub witness: Pubkey,
}
