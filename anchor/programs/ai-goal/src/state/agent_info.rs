use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
#[derive(InitSpace)]
pub struct Agent {
    #[max_len(MAX_AGENT_ID_LENGTH)]
    pub agent_id: String,

    #[max_len(MAX_AGENT_NAME_LENGTH)]
    pub agent_name: String,

    #[max_len(MAX_AGENT_JSON_LENGTH)]
    pub charactor_json: String,
}
