use crate::{
    constants::*,
    error_code::AIGErrorCode as ErrorCode,
    events::*,
    state::{GoalInfo, WitnessGoalsInfo},
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(goal_id: u64, witness: Pubkey)]
pub struct InitWitnessGoalData<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        has_one = owner @ ErrorCode::NotGoalCreator,
    )]
    pub goal: Account<'info, GoalInfo>,

    // 这里我们假设账户已经由 create_goal 指令创建
    #[account(
        init_if_needed,
        payer = owner,
        space = ANCHOR_DISCRIMINATOR_SIZE + WitnessGoalsInfo::INIT_SPACE,
        seeds = [WITNESS_GOALS_SEED, witness.as_ref()],
        bump,
    )]
    pub witness_goals: Account<'info, WitnessGoalsInfo>,

    pub system_program: Program<'info, System>,
}

// 初始化见证者账户数据
pub fn _init_witness_goal_data(
    ctx: Context<InitWitnessGoalData>,
    goal_id: u64,
    witness: Pubkey,
) -> Result<()> {
    let goal = &ctx.accounts.goal;

    // 验证见证者在目标的见证者列表中
    require!(goal.witnesses.contains(&witness), ErrorCode::NotWitness);

    // 初始化或更新见证者账户数据
    let witness_goals = &mut ctx.accounts.witness_goals;

    // 如果账户是新创建的，初始化owner字段
    if witness_goals.goal_ids.is_empty() {
        witness_goals.owner = witness;
    }

    // 如果目标ID尚未包含在见证者的目标列表中，则添加
    if !witness_goals.goal_ids.contains(&goal_id) {
        witness_goals.goal_ids.push(goal_id);

        // 发出事件通知
        emit!(EventWitnessGoalAdded { goal_id, witness });
    }

    Ok(())
}
