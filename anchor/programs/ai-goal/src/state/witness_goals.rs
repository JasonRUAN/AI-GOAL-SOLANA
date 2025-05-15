use anchor_lang::prelude::*;

use crate::constants::MAX_GOAL_ID_ARRAY_LENGTH;

#[account]
#[derive(InitSpace)]
pub struct WitnessGoalsInfo {
    pub owner: Pubkey,

    #[max_len(MAX_GOAL_ID_ARRAY_LENGTH)]
    pub goal_ids: Vec<u64>,
}
