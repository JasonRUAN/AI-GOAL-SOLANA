use anchor_lang::prelude::*;

use crate::{
    constants::*,
    error_code::AIGErrorCode as ErrorCode,
    events::*,
    state::{GoalInfo, ProgressUpdate},
};

#[derive(Accounts)]
#[instruction(goal_id: u64, content: String, progress_percentage: u64, proof_file_blob_id: String)]
pub struct UpdateProgress<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, constraint = goal.owner == signer.key() @ ErrorCode::NotGoalCreator)]
    pub goal: Account<'info, GoalInfo>,

    #[account(
        init,
        payer = signer,
        space = ANCHOR_DISCRIMINATOR_SIZE + ProgressUpdate::INIT_SPACE,
        seeds = [PROGRESS_SEED, goal.goal_id.to_le_bytes().as_ref(), goal.progress_update_counter.to_le_bytes().as_ref()],
        bump,
    )]
    pub progress_update: Account<'info, ProgressUpdate>,

    pub system_program: Program<'info, System>,
}

// 更新目标进度
pub fn _update_progress(
    ctx: Context<UpdateProgress>,
    goal_id: u64,
    content: String,
    progress_percentage: u64,
    proof_file_blob_id: String,
) -> Result<()> {
    let goal = &mut ctx.accounts.goal;
    let progress_update = &mut ctx.accounts.progress_update;
    let signer = ctx.accounts.signer.key();

    require!(goal.owner == signer, ErrorCode::NotGoalCreator);
    require!(goal.status == GOAL_STATUS_ACTIVE, ErrorCode::GoalNotActive);
    require!(
        progress_percentage > 0
            && progress_percentage >= goal.progress_percentage
            && progress_percentage <= 100,
        ErrorCode::InvalidProgressPercentage
    );

    let update_id = goal.progress_update_counter;

    progress_update.id = update_id;
    progress_update.goal_id = goal_id;
    progress_update.content = content.clone();
    progress_update.proof_file_blob_id = proof_file_blob_id.clone();
    progress_update.creator = signer;
    progress_update.created_at = Clock::get()?.unix_timestamp as u64;

    goal.progress_percentage = progress_percentage;
    goal.progress_update_counter += 1;

    emit!(ProgressUpdateEvent {
        goal_id,
        update_id,
        creator: signer,
        content,
        progress_percentage,
        proof_file_blob_id,
    });

    Ok(())
}
