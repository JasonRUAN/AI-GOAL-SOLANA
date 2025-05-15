use anchor_lang::prelude::*;

#[error_code]
pub enum AIGErrorCode {
    #[msg("截止日期无效")]
    InvalidDeadline,
    #[msg("目标不处于活跃状态")]
    GoalNotActive,
    #[msg("截止日期未到")]
    DeadlineNotReached,
    #[msg("见证人列表为空")]
    EmptyWitnesses,
    #[msg("调用者不是见证人")]
    NotWitness,
    #[msg("已经确认过")]
    AlreadyConfirmed,
    #[msg("并非所有见证人都已确认")]
    NotAllWitnessesConfirmed,
    #[msg("不是目标相关成员")]
    NotGoalRelatedMember,
    #[msg("所有见证人已确认")]
    AllWitnessesConfirmed,
    #[msg("不是目标创建者")]
    NotGoalCreator,
    #[msg("Agent ID太短")]
    AgentIdTooShort,
    #[msg("Agent名称太短")]
    AgentNameTooShort,
    #[msg("角色JSON太短")]
    CharactorJsonTooShort,
    #[msg("Agent已存在")]
    AgentAlreadyExists,
    #[msg("Agent不存在")]
    AgentNotExists,
    #[msg("进度百分比无效")]
    InvalidProgressPercentage,
    #[msg("支付金额不足")]
    InsufficientPayment,
}
