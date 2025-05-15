use anchor_lang::prelude::*;

use crate::{
    constants::*,
    error_code::AIGErrorCode as ErrorCode,
    events::*,
    state::{GoalInfo, GoalManagerInfo},
};

#[derive(Accounts)]
#[instruction(goal_id: u64)]
pub struct FailGoal<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub goal_manager: Account<'info, GoalManagerInfo>,

    #[account(mut)]
    pub goal: Account<'info, GoalInfo>,

    pub system_program: Program<'info, System>,
}

// 标记目标失败
pub fn _fail_goal(ctx: Context<FailGoal>, goal_id: u64) -> Result<()> {
    let goal = &mut ctx.accounts.goal;
    let goal_manager = &mut ctx.accounts.goal_manager;
    let signer = ctx.accounts.signer.key();

    require!(goal.status == GOAL_STATUS_ACTIVE, ErrorCode::GoalNotActive);

    let current_time = Clock::get()?.unix_timestamp;
    require!(
        current_time >= goal.deadline as i64,
        ErrorCode::DeadlineNotReached
    );

    let is_related = goal.witnesses.contains(&signer)
        || goal.confirmations.contains(&signer)
        || goal.owner == signer;
    require!(is_related, ErrorCode::NotGoalRelatedMember);

    let witness_count = goal.witnesses.len();
    let confirmation_count = goal.confirmations.len();
    require!(
        witness_count != confirmation_count,
        ErrorCode::AllWitnessesConfirmed
    );

    goal.status = GOAL_STATUS_FAILED;

    if let Some(index) = goal_manager.active_goals.iter().position(|&r| r == goal_id) {
        goal_manager.active_goals.remove(index);
    }

    goal_manager.failed_goals.push(goal_id);

    emit!(EventGoalFailed {
        goal_id,
        failer: signer,
    });

    Ok(())
}
