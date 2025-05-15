use anchor_lang::prelude::*;

use crate::{
    constants::*,
    error_code::AIGErrorCode as ErrorCode,
    events::*,
    state::{GoalInfo, GoalManagerInfo},
};

#[derive(Accounts)]
#[instruction(goal_id: u64)]
pub struct CompleteGoal<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub goal_manager: Account<'info, GoalManagerInfo>,

    #[account(mut, constraint = goal.owner == signer.key() @ ErrorCode::NotGoalCreator)]
    pub goal: Account<'info, GoalInfo>,

    pub system_program: Program<'info, System>,
}

// 完成目标
pub fn _complete_goal(ctx: Context<CompleteGoal>, goal_id: u64) -> Result<()> {
    let goal = &mut ctx.accounts.goal;
    let goal_manager = &mut ctx.accounts.goal_manager;
    let signer = ctx.accounts.signer.key();

    require!(goal.status == GOAL_STATUS_ACTIVE, ErrorCode::GoalNotActive);
    require!(goal.owner == signer, ErrorCode::NotGoalCreator);

    // 确保所有见证人都已确认
    let witness_count = goal.witnesses.len();
    let confirmation_count = goal.confirmations.len();
    require!(
        witness_count == confirmation_count,
        ErrorCode::NotAllWitnessesConfirmed
    );

    goal.status = GOAL_STATUS_COMPLETED;
    goal.progress_percentage = 100;

    // 从活跃目标列表中移除
    if let Some(index) = goal_manager.active_goals.iter().position(|&r| r == goal_id) {
        goal_manager.active_goals.remove(index);
    }

    // 添加到已完成目标列表
    goal_manager.completed_goals.push(goal_id);

    emit!(EventGoalCompleted {
        goal_id,
        completer: signer,
    });

    Ok(())
}
