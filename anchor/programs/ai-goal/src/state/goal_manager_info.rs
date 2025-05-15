use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
#[derive(InitSpace)]
pub struct GoalManagerInfo {
    pub owner: Pubkey,
    pub goal_count: u64,

    #[max_len(MAX_GOAL_LENGTH)]
    pub active_goals: Vec<u64>,

    #[max_len(MAX_GOAL_LENGTH)]
    pub failed_goals: Vec<u64>,

    #[max_len(MAX_GOAL_LENGTH)]
    pub completed_goals: Vec<u64>,

    pub total_balance: u64,
}
