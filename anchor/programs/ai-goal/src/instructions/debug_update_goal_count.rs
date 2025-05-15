use crate::{events::EventGoalCountUpdated, state::GoalManagerInfo};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateGoalCount<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [b"goal_manager"],
        bump,
    )]
    pub goal_manager: Account<'info, GoalManagerInfo>,

    pub system_program: Program<'info, System>,
}

pub fn _update_goal_count(ctx: Context<UpdateGoalCount>, goal_count: u64) -> Result<()> {
    let goal_manager = &mut ctx.accounts.goal_manager;
    goal_manager.goal_count = goal_count;

    emit!(EventGoalCountUpdated { goal_count });

    Ok(())
}
