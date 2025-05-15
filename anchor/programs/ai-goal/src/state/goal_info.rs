use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
#[derive(InitSpace)]
pub struct GoalInfo {
    pub owner: Pubkey,
    pub goal_id: u64,

    #[max_len(MAX_TITLE_LENGTH)]
    pub title: String,

    #[max_len(MAX_DESCRIPTION_LENGTH)]
    pub description: String,

    #[max_len(MAX_AI_SUGGESTION_LENGTH)]
    pub ai_suggestion: String,

    pub amount: u64, // 保证金代币数量，单位：lamports
    pub status: u8,  // 0-进行中、1-已完成、2-失败

    pub created_at: u64, // 创建时间
    pub deadline: u64,   // 截止时间

    #[max_len(MAX_WITNESS_ARRAY_LENGTH)]
    pub witnesses: Vec<Pubkey>,

    #[max_len(MAX_WITNESS_ARRAY_LENGTH)]
    pub confirmations: Vec<Pubkey>,

    pub comment_counter: u64,
    pub progress_percentage: u64,
    pub progress_update_counter: u64,
}
