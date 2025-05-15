use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
#[derive(InitSpace)]
pub struct ProgressUpdate {
    pub id: u64,
    pub goal_id: u64,

    #[max_len(MAX_PROGRESS_UPDATE_LENGTH)]
    pub content: String,

    #[max_len(MAX_PROOF_FILE_LENGTH)]
    pub proof_file_blob_id: String,

    pub creator: Pubkey,
    pub created_at: u64,
}
