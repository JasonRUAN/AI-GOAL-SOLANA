#![allow(clippy::result_large_err)]
use anchor_lang::prelude::*;

pub mod constants;
pub mod error_code;
pub mod events;
pub mod instructions;
pub mod state;

use instructions::add_witness_goal::*;
use instructions::complete_goal::*;
use instructions::confirm_witness::*;
use instructions::create_agent::*;
use instructions::create_comment::*;
use instructions::create_goal::*;
use instructions::debug_update_goal_count::*;
use instructions::fail_goal::*;
use instructions::init_witness_goal_data::*;
use instructions::initialize::*;
use instructions::update_progress::*;

declare_id!("95zvvX88Cuy5mWGkpJzawYmh9NqY9ksREPzBcdeWM8WM");

#[program]
pub mod ai_goal {
    use super::*;

    pub fn initialize_goal_manager(ctx: Context<Initialize>) -> Result<()> {
        _initialize_goal_manager(ctx)
    }

    pub fn create_goal(
        ctx: Context<CreateGoal>,
        title: String,
        description: String,
        ai_suggestion: String,
        deadline: u64,
        witnesses: Vec<Pubkey>,
        amount: u64,
    ) -> Result<()> {
        _create_goal(
            ctx,
            title,
            description,
            ai_suggestion,
            deadline,
            witnesses,
            amount,
        )
    }

    pub fn init_witness_goal_data(
        ctx: Context<InitWitnessGoalData>,
        goal_id: u64,
        witness: Pubkey,
    ) -> Result<()> {
        _init_witness_goal_data(ctx, goal_id, witness)
    }

    pub fn update_goal_count(ctx: Context<UpdateGoalCount>, goal_count: u64) -> Result<()> {
        _update_goal_count(ctx, goal_count)
    }

    pub fn confirm_witness(ctx: Context<ConfirmWitness>, goal_id: u64) -> Result<()> {
        _confirm_witness(ctx, goal_id)
    }

    pub fn complete_goal(ctx: Context<CompleteGoal>, goal_id: u64) -> Result<()> {
        _complete_goal(ctx, goal_id)
    }

    pub fn fail_goal(ctx: Context<FailGoal>, goal_id: u64) -> Result<()> {
        _fail_goal(ctx, goal_id)
    }

    pub fn create_comment(
        ctx: Context<CreateComment>,
        goal_id: u64,
        content: String,
    ) -> Result<()> {
        _create_comment(ctx, goal_id, content)
    }

    pub fn update_progress(
        ctx: Context<UpdateProgress>,
        goal_id: u64,
        content: String,
        progress_percentage: u64,
        proof_file_blob_id: String,
    ) -> Result<()> {
        _update_progress(
            ctx,
            goal_id,
            content,
            progress_percentage,
            proof_file_blob_id,
        )
    }

    pub fn create_agent(
        ctx: Context<CreateAgent>,
        agent_id: String,
        agent_name: String,
        charactor_json: String,
    ) -> Result<()> {
        _create_agent(ctx, agent_id, agent_name, charactor_json)
    }

    pub fn add_witness_goal(
        ctx: Context<AddWitnessGoal>,
        goal_id: u64,
        witness: Pubkey,
    ) -> Result<()> {
        _add_witness_goal(ctx, goal_id, witness)
    }
}
