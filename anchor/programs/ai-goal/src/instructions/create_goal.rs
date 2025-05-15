use crate::{
    constants::*,
    error_code::AIGErrorCode as ErrorCode,
    events::*,
    state::{GoalInfo, GoalManagerInfo, UserGoalsInfo},
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
// #[instruction(goal_id: u64)]
pub struct CreateGoal<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(mut)]
    pub goal_manager: Account<'info, GoalManagerInfo>,

    #[account(
        init,
        payer = owner,
        space = ANCHOR_DISCRIMINATOR_SIZE + GoalInfo::INIT_SPACE,
        seeds = [goal_manager.goal_count.to_le_bytes().as_ref()],
        bump,
    )]
    pub goal: Account<'info, GoalInfo>,

    #[account(
        init_if_needed,
        payer = owner,
        space = ANCHOR_DISCRIMINATOR_SIZE + UserGoalsInfo::INIT_SPACE,
        seeds = [USER_GOALS_SEED, owner.key().as_ref()],
        bump,
    )]
    pub user_goals: Account<'info, UserGoalsInfo>,

    pub system_program: Program<'info, System>,
}

// 创建新目标
pub fn _create_goal(
    ctx: Context<CreateGoal>,
    title: String,
    description: String,
    ai_suggestion: String,
    deadline: u64,
    witnesses: Vec<Pubkey>,
    amount: u64,
) -> Result<()> {
    let current_time = Clock::get()?.unix_timestamp;
    require!(deadline > current_time as u64, ErrorCode::InvalidDeadline);
    // require!(!witnesses.is_empty(), ErrorCode::EmptyWitnesses);

    let goal_manager = &mut ctx.accounts.goal_manager;

    let goal_id = goal_manager.goal_count;

    // 创建新目标
    let goal = &mut ctx.accounts.goal;
    goal.goal_id = goal_id;
    goal.title = title.clone();
    goal.amount = amount;
    goal.deadline = deadline;
    goal.status = GOAL_STATUS_ACTIVE;
    goal.created_at = current_time as u64;
    goal.description = description.clone();
    goal.ai_suggestion = ai_suggestion.clone();
    goal.witnesses = witnesses.clone();
    goal.confirmations = Vec::new();
    goal.comment_counter = 0;
    goal.progress_percentage = 0;
    goal.progress_update_counter = 0;
    goal.owner = ctx.accounts.owner.key();

    let user_goals = &mut ctx.accounts.user_goals;
    if user_goals.goal_ids.is_empty() {
        user_goals.owner = ctx.accounts.owner.key();
    }
    user_goals.goal_ids.push(goal_id);

    goal_manager.active_goals.push(goal_id);
    goal_manager.goal_count += 1;
    goal_manager.total_balance += amount;

    // 发出事件
    emit!(EventGoalCreated {
        goal_id,
        creator: ctx.accounts.owner.key(),
        title,
        amount,
    });

    Ok(())
}
