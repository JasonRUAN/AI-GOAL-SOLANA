pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

pub const MAX_GOAL_LENGTH: usize = 100;
pub const MAX_GOAL_ID_ARRAY_LENGTH: usize = 10;
pub const MAX_WITNESS_ARRAY_LENGTH: usize = 5;
pub const MAX_TITLE_LENGTH: usize = 500;
pub const MAX_DESCRIPTION_LENGTH: usize = 4096;
pub const MAX_AI_SUGGESTION_LENGTH: usize = 4096;
pub const MAX_COMMENT_LENGTH: usize = 4096;
pub const MAX_PROOF_FILE_LENGTH: usize = 128;
pub const MAX_PROGRESS_UPDATE_LENGTH: usize = 1024;
pub const MAX_AGENT_JSON_LENGTH: usize = 8192;
pub const MAX_AGENT_NAME_LENGTH: usize = 256;
pub const MAX_AGENT_ID_LENGTH: usize = 128;
pub const MIN_LENGTH: usize = 1;
pub const CHARACTOR_JSON_MIN_LENGTH: usize = 10;

pub const GOAL_MANAGER_SEED: &[u8] = b"goal_manager";
pub const USER_GOALS_SEED: &[u8] = b"user_goals";
pub const WITNESS_GOALS_SEED: &[u8] = b"witness_goals";
pub const PROGRESS_SEED: &[u8] = b"progress";
pub const COMMENT_SEED: &[u8] = b"comment";
pub const AGENT_SEED: &[u8] = b"agent";

pub const GOAL_STATUS_ACTIVE: u8 = 0;
pub const GOAL_STATUS_COMPLETED: u8 = 1;
pub const GOAL_STATUS_FAILED: u8 = 2;
