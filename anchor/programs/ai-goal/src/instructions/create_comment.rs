use anchor_lang::prelude::*;

use crate::{
    constants::*,
    events::*,
    state::{Comment, GoalInfo},
};

#[derive(Accounts)]
pub struct CreateComment<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub goal: Account<'info, GoalInfo>,

    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Comment::INIT_SPACE,
        seeds = [COMMENT_SEED, goal.goal_id.to_le_bytes().as_ref(), goal.comment_counter.to_le_bytes().as_ref()],
        bump,
    )]
    pub comment: Account<'info, Comment>,

    pub system_program: Program<'info, System>,
}

// 创建评论
pub fn _create_comment(ctx: Context<CreateComment>, goal_id: u64, content: String) -> Result<()> {
    let goal = &mut ctx.accounts.goal;
    let comment = &mut ctx.accounts.comment;
    let user = ctx.accounts.user.key();

    let comment_id = goal.comment_counter;

    comment.id = comment_id;
    comment.goal_id = goal_id;
    comment.content = content.clone();
    comment.creator = user;
    comment.created_at = Clock::get()?.unix_timestamp as u64;

    goal.comment_counter += 1;

    emit!(CommentCreatedEvent {
        goal_id,
        comment_id,
        creator: user,
        content,
    });

    Ok(())
}
