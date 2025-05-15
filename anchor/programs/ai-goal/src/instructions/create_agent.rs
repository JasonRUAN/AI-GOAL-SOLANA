use anchor_lang::prelude::*;

use crate::{
    constants::*,
    error_code::AIGErrorCode as ErrorCode,
    events::*,
    state::{Agent, GoalInfo},
};

#[derive(Accounts)]
#[instruction(agent_id: String)]
pub struct CreateAgent<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub goal: Account<'info, GoalInfo>,

    #[account(
        init,
        payer = signer,
        space = ANCHOR_DISCRIMINATOR_SIZE + Agent::INIT_SPACE,
        seeds = [AGENT_SEED, goal.goal_id.to_le_bytes().as_ref()],  // 每个目标只能添加一个Agent
        bump,
    )]
    pub agent: Account<'info, Agent>,

    pub system_program: Program<'info, System>,
}

// 创建Agent
pub fn _create_agent(
    ctx: Context<CreateAgent>,
    agent_id: String,
    agent_name: String,
    charactor_json: String,
) -> Result<()> {
    require!(agent_id.len() > 0, ErrorCode::AgentIdTooShort);
    require!(agent_name.len() >= MIN_LENGTH, ErrorCode::AgentNameTooShort);
    require!(
        charactor_json.len() >= CHARACTOR_JSON_MIN_LENGTH,
        ErrorCode::CharactorJsonTooShort
    );

    let agent = &mut ctx.accounts.agent;

    agent.agent_id = agent_id.clone();
    agent.agent_name = agent_name.clone();
    agent.charactor_json = charactor_json.clone();

    emit!(CreateAgentEvent {
        agent_id,
        agent_name,
        charactor_json,
    });

    Ok(())
}
