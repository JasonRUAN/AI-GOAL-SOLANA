use anchor_lang::prelude::*;

use crate::{constants::*, error_code::AIGErrorCode as ErrorCode, events::*, state::GoalInfo};

#[derive(Accounts)]
#[instruction(goal_id: u64)]
pub struct ConfirmWitness<'info> {
    #[account(mut)]
    pub witness: Signer<'info>,

    #[account(mut)]
    pub goal: Account<'info, GoalInfo>,

    pub system_program: Program<'info, System>,
}

// 见证人确认目标
pub fn _confirm_witness(ctx: Context<ConfirmWitness>, goal_id: u64) -> Result<()> {
    let goal = &mut ctx.accounts.goal;
    let witness = ctx.accounts.witness.key();

    require!(goal.status == GOAL_STATUS_ACTIVE, ErrorCode::GoalNotActive);
    require!(goal.witnesses.contains(&witness), ErrorCode::NotWitness);
    require!(
        !goal.confirmations.contains(&witness),
        ErrorCode::AlreadyConfirmed
    );

    goal.confirmations.push(witness);

    emit!(EventWitnessConfirmed { goal_id, witness });

    Ok(())
}
