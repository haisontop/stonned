use anchor_lang::prelude::*;
use anchor_lang::solana_program::{pubkey, pubkey::Pubkey};
use anchor_lang::AccountsClose;
use anchor_spl::mint;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("1NnBDnDDP1PttKQRQ98GefgiRBYYRC7wfuy34NJBBdU");

const BACKEND_USER: Pubkey = pubkey!("9XcVSR68PTMr987BjCStW13LauzQiuYUv6vKMUorPEax");

#[program]
pub mod awakening {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn start_awakening(ctx: Context<StartAwakeningCtx>) -> Result<()> {
        let awakening = &mut ctx.accounts.awakening;
        awakening.start = Clock::get()?.unix_timestamp;
        awakening.authority = ctx.accounts.user.key();
        awakening.mint = ctx.accounts.mint.key();

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.vault_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, 1)?;

        Ok(())
    }

    pub fn reveal(ctx: Context<RevealCtx>) -> Result<()> {
        let awakening = &mut ctx.accounts.awakening;

        /*  let fourDaysInSeconds: i64 = 345_600;
        let now = Clock::get()?.unix_timestamp;
        if now < (awakening.start + fourDaysInSeconds) {
            return err!(ErrorCode::NotReady);
        } */

        let mint_key = ctx.accounts.mint.to_account_info().key.as_ref();
        let seed = &[&b"vault"[..], mint_key];
        let (pda, bump) = Pubkey::find_program_address(seed, ctx.program_id);

        let seeds = &[&b"vault"[..], mint_key, &[bump]];
        let member_signer = &[&seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
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

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
#[instruction()]
pub struct StartAwakeningCtx<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(init, payer = user, space = 300, seeds = [mint.key().as_ref(), user.key().as_ref()], bump )]
    pub awakening: Account<'info, Awakening>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"vault", mint.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = vault_token_account,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(mut, token::mint = mint, token::authority = user.key())]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct RevealCtx<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut, close = user, seeds = [mint.key().as_ref(), user.key().as_ref()], bump )]
    pub awakening: Account<'info, Awakening>,

    #[account(mut, constraint = mint.key() == awakening.mint.key())]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [b"vault", mint.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = vault_token_account,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(mut, token::mint = mint, token::authority = user.key())]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Awakening {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub start: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Not ready to reveal.")]
    NotReady,
}
