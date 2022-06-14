#![allow(clippy::integer_arithmetic)]
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{pubkey, pubkey::Pubkey};
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use borsh::maybestd::io::Error as BorshIoError;
use thiserror::Error;
use num_enum::TryFromPrimitive;
use std::convert::TryFrom;
use solana_program::native_token::{LAMPORTS_PER_SOL};

declare_id!("4PsYfZSJoGZc4AM1wNhqKjQea83PUtnRBoLwPBPfgSu2");

const REWARD_FACTOR: u64 = 173611;
const PUFF_PDA_SEED: &[u8] = b"puff";
const SAC_PDA_SEED: &[u8] = b"sac";

const BACKEND_USER: Pubkey = pubkey!("9XcVSR68PTMr987BjCStW13LauzQiuYUv6vKMUorPEax");

#[program]
pub mod all_staking {
    use std::{ptr::null, str::FromStr};

    use solana_program::native_token::LAMPORTS_PER_SOL;

    use super::*;

    pub fn init_program(
        ctx: Context<InitProgram>,
        program_puff_token_account_bump: u8,
    ) -> ProgramResult {
        msg!("The given Account");
        Ok(())
    }

    pub fn start_staking(
        ctx: Context<StartStaking>,
        stake_account_bump: u8,
        vault_token_account_bump: u8,
        authority: Pubkey,
        token: Pubkey,
    ) -> ProgramResult {
        let stake_account = &mut ctx.accounts.stake_account;
        stake_account.authority = ctx.accounts.user.key();
        stake_account.token = token;
        stake_account.start_staking = ctx.accounts.clock.unix_timestamp;
        stake_account.last_withdraw = ctx.accounts.clock.unix_timestamp;
        stake_account.bump = stake_account_bump;
        stake_account.vault_token_account_bump = vault_token_account_bump;

        let tokenString = token.to_string();

        msg!("token {}", tokenString);
        /*
        let reward_factor = getFactorForRole(tokenString);
        msg!("reward_factor {}", reward_factor);

        if (reward_factor == 0) {
            return Err(Errors::WrongMint.into());
        } */

        msg!("The given Account");

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.clone(),
            token::Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.vault_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, 1)?;

        Ok(())
    }

    pub fn withdraw(
        ctx: Context<Widhdraw>,
        program_puff_token_account_bump: u8,
        amount_per_day: u32,
    ) -> ProgramResult {
        let stake_account = &mut ctx.accounts.stake_account;

        let tokenString = stake_account.token.to_string();

     /*    msg!("role raw {:?}", role);
        let roleEnum: Role = Role::try_from(role).unwrap(); */

        msg!("token {}", tokenString);

        stake_account.widthdraw(
            program_puff_token_account_bump,
            &ctx.accounts.token_program,
            &ctx.accounts.program_puff_token_account,
            &ctx.accounts.user_puff_token_account,
            tokenString,
            amount_per_day,
        )?;

        Ok(())
    }

    pub fn unstake(
        ctx: Context<UnStake>,
        program_puff_token_account_bump: u8,
        amount_per_day: u32,
    ) -> ProgramResult {
        let stake_account = &mut ctx.accounts.stake_account;

        let tokenString = stake_account.token.to_string();

     /*    msg!("role raw {:?}", role);
        let roleEnum: Role = Role::try_from(role).unwrap(); */

        stake_account.widthdraw(
            program_puff_token_account_bump,
            &ctx.accounts.token_program,
            &ctx.accounts.program_puff_token_account,
            &ctx.accounts.user_puff_token_account,
            tokenString,
            amount_per_day,
        )?;

        let seeds = &[
            &SAC_PDA_SEED[..],
            ctx.accounts.nft_mint.to_account_info().key.as_ref(),
            &[ctx.accounts.stake_account.vault_token_account_bump],
        ];
        let member_signer = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.clone(),
            token::Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.vault_token_account.to_account_info(),
            },
            member_signer,
        );
        token::transfer(cpi_ctx, 1)?;

        Ok(())
    }
}



#[derive(
    Copy, Clone, Debug, AnchorDeserialize, AnchorSerialize, Eq, PartialEq, TryFromPrimitive,
)]
#[repr(u8)]
pub enum Role {
    Chimpion = 1,
    FourRoles = 2,
    Sealz = 3,
    OneOutOfOne = 4,
}

#[account]
#[derive(Copy)]
pub struct StakeAccount {
    pub authority: Pubkey,
    pub token: Pubkey,
    pub start_staking: i64,
    pub last_withdraw: i64,
    pub bump: u8,
    pub vault_token_account_bump: u8,
}

impl<'info> StakeAccount {
    fn widthdraw(
        &mut self,
        program_puff_token_account_bump: u8,
        token_program: &AccountInfo<'info>,
        program_puff_token_account: &Account<'info, TokenAccount>,
        user_puff_token_account: &Box<Account<'info, TokenAccount>>,
        token: String,
        amount_per_day: u32,
    ) -> Result<u64> {
        let now = Clock::get()?.unix_timestamp as u64;

        let time_diff = now as f64 - self.last_withdraw as f64;
        let last_withdraw = self.last_withdraw as u64;
        self.last_withdraw = now as i64;

        let one_day_in_seconds: f64 = 86_400.0;

        let amount_f64 = time_diff / one_day_in_seconds * amount_per_day as f64 * LAMPORTS_PER_SOL as f64;

        let amount = amount_f64 as u64;


        msg!("now, {}", now);
        msg!("last_withdraw, {}", last_withdraw);
        msg!("time_diff, {}", time_diff);
        msg!("amount_per_day, {}", amount_per_day);
        msg!("amount_f64, {}", amount_f64);
        msg!("amount, {}", amount);

        let authority_seeds = &[&PUFF_PDA_SEED[..], &[program_puff_token_account_bump]];
        let member_signer_reward = &[&authority_seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            token_program.clone(),
            token::Transfer {
                from: program_puff_token_account.to_account_info(),
                to: user_puff_token_account.to_account_info(),
                authority: program_puff_token_account.to_account_info(),
            },
            member_signer_reward,
        );
        token::transfer(cpi_ctx, amount)?;

        Ok(amount)
    }
}

#[instruction(program_puff_token_account_bump: u8)]
#[derive(Accounts)]
pub struct InitProgram<'info> {
    #[account(
        init,
        payer = user,
        seeds = [b"puff"],
        bump = program_puff_token_account_bump,
        token::mint = puff_token,
        token::authority = program_puff_token_account,
    )]
    pub program_puff_token_account: Account<'info, TokenAccount>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: AccountInfo<'info>,
    pub puff_token: Account<'info, Mint>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(stake_account_bump: u8, vault_token_account_bump: u8)]
pub struct StartStaking<'info> {
    #[account(init, payer = user, space=300, seeds = [nft_mint.key().as_ref(), user.key().as_ref()], bump = stake_account_bump)]
    pub stake_account: Account<'info, StakeAccount>,
    pub user: Signer<'info>,
    /* #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>, */
    pub system_program: Program<'info, System>,
    pub token_program: AccountInfo<'info>,
    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"sac", nft_mint.key().as_ref()],
        bump = vault_token_account_bump,
        token::mint = nft_mint,
        token::authority = vault_token_account,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut, constraint = user_token_account.owner.key() == user.key())]
    pub user_token_account: Account<'info, TokenAccount>,
    pub nft_mint: Account<'info, Mint>,
    clock: Sysvar<'info, Clock>,
    pub rent: Sysvar<'info, Rent>,
}

#[instruction(program_puff_token_account_bump: u8)]
#[derive(Accounts)]
pub struct Widhdraw<'info> {
    #[account(mut, constraint = stake_account.authority.key() == user.key() , seeds = [nft_mint.key().as_ref(), user.key().as_ref()], bump = stake_account.bump)]
    pub stake_account: Account<'info, StakeAccount>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: AccountInfo<'info>,
    #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
    pub nft_mint: Account<'info, Mint>,
    pub puff_token: Account<'info, Mint>,
    #[account(mut, seeds = [b"puff"], bump = program_puff_token_account_bump, constraint = program_puff_token_account.owner.key() == program_puff_token_account.key())]
    pub program_puff_token_account: Account<'info, TokenAccount>,
    #[account(mut, constraint = user_puff_token_account.owner.key() == user.key())]
    pub user_puff_token_account: Box<Account<'info, TokenAccount>>,
}

#[instruction(program_puff_token_account_bump: u8)]
#[derive(Accounts)]
pub struct UnStake<'info> {
    #[account(mut, constraint = stake_account.authority.key() == user.key(), close=user, seeds = [nft_mint.key().as_ref(), user.key().as_ref()], bump = stake_account.bump)]
    pub stake_account: Account<'info, StakeAccount>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: AccountInfo<'info>,
    #[account(mut, seeds = [b"sac", nft_mint.key().as_ref()],
    bump = stake_account.vault_token_account_bump )]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut, constraint = user_token_account.owner.key() == user.key())]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
    pub nft_mint: Account<'info, Mint>,
    pub puff_token: Account<'info, Mint>,
    #[account(mut, seeds = [b"puff"], bump = program_puff_token_account_bump )]
    pub program_puff_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = user_token_account.owner.key() == stake_account.authority.key())]
    pub user_puff_token_account: Box<Account<'info, TokenAccount>>,
}

#[error]
pub enum Errors {
    #[msg("NFT must be from stoned ape crew")]
    WrongMint,
}
