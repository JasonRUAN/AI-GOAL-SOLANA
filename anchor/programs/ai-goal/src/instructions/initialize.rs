use crate::{
    constants::{ANCHOR_DISCRIMINATOR_SIZE, GOAL_MANAGER_SEED},
    state::GoalManagerInfo,
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = ANCHOR_DISCRIMINATOR_SIZE + GoalManagerInfo::INIT_SPACE,
        seeds = [GOAL_MANAGER_SEED],
        bump,
    )]
    pub goal_manager: Account<'info, GoalManagerInfo>,

    pub system_program: Program<'info, System>,
}

pub fn _initialize_goal_manager(ctx: Context<Initialize>) -> Result<()> {
    let goal_manager = &mut ctx.accounts.goal_manager;
    goal_manager.owner = ctx.accounts.owner.key();

    goal_manager.goal_count = 0;
    goal_manager.active_goals = Vec::new();
    goal_manager.failed_goals = Vec::new();
    goal_manager.completed_goals = Vec::new();
    goal_manager.total_balance = 0;

    Ok(())
}
