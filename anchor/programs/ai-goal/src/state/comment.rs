use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
#[derive(InitSpace)]
pub struct Comment {
    pub id: u64,
    pub goal_id: u64,
    #[max_len(MAX_COMMENT_LENGTH)]
    pub content: String,
    pub creator: Pubkey,
    pub created_at: u64,
}
