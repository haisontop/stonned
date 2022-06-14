#![allow(clippy::integer_arithmetic)]
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{pubkey, pubkey::Pubkey};
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use metaplex_token_metadata::instruction::update_metadata_accounts;
use metaplex_token_metadata::processor::process_update_metadata_accounts;
use metaplex_token_metadata::state::Metadata;
use solana_program::borsh::*;
mod constants;
pub use constants::*;
use metaplex::solana_program::program::invoke;

declare_id!("7H4tPzTXCdL4uiEZZLpjSeWfpVNnv7LHSJsaqCinjiw6");

const BACKEND_USER: Pubkey = pubkey!("9XcVSR68PTMr987BjCStW13LauzQiuYUv6vKMUorPEax");

const PROGRAM_PUFF_WALLET: Pubkey = pubkey!("DBunqiu2mrnGLLQPm5mcEwnjeTGCLjjUze35vBHpWRWs");

const METAPLEX_PROGRAM_ID: Pubkey = pubkey!("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

const PUFF_PDA_SEED: &[u8] = b"puff";
const SAC_PDA_SEED: &[u8] = b"sac";

const LAMPORT_PER_SOL: u64 = 1000000000;

#[program]
pub mod evolution {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        /*  let program_config = &mut ctx.accounts.program_config;
        program_config.authority = ctx.accounts.user.key(); */
        Ok(())
    }

    pub fn add_metadata(ctx: Context<Initialize>, metadata: String) -> ProgramResult {
        let src = metadata.as_bytes();
        let mut data = [0u8; 280];
        data[..src.len()].copy_from_slice(src);
        Ok(())
    }

    pub fn start_evolution(
        ctx: Context<StartEvolution>,
        evolution_account_bump: u8,
        vault_nft_account_bump: u8,
        is_dmt: bool,
        is_ayahuasca: bool,
    ) -> ProgramResult {
        let nft = ctx.accounts.nft_mint.key();

        let evolution_account = &mut ctx.accounts.evolution_account;
        evolution_account.authority = ctx.accounts.user.key();
        evolution_account.token = nft;
        evolution_account.bump = evolution_account_bump;
        evolution_account.vault_nft_account_bump = vault_nft_account_bump;
        evolution_account.start_evolution = Clock::get()?.unix_timestamp;
        evolution_account.is_dmt = is_dmt;

        let mut amount = if is_dmt { 666 } else { 333 };
        if is_ayahuasca {
            evolution_account.is_ayahuasca = is_ayahuasca;
            amount = if is_ayahuasca { 1420 } else { amount };
        }
        /*  let tokenString = nft.to_string();

        msg!("token {}", tokenString);

        let role = getRole(tokenString);
        msg!("role {}", role);

        if role != "Chimpion" {
            return Err(Errors::WrongMint.into());
        }

        msg!("The given Account"); */

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.clone(),
            token::Transfer {
                from: ctx.accounts.user_puff_token_account.to_account_info(),
                to: ctx.accounts.program_puff_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );

        token::transfer(cpi_ctx, amount * LAMPORT_PER_SOL)?;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.clone(),
            token::Transfer {
                from: ctx.accounts.user_nft_account.to_account_info(),
                to: ctx.accounts.vault_nft_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, 1)?;

        emit!(EvolutionStarted {
            evolution_account_bump,
            token: nft.to_string(),
            mint: evolution_account.token.key().to_string(),
        });

        Ok(())
    }

    /* pub fn update_metadata(ctx: Context<UpdateMetadata>) -> ProgramResult {
        let metadata = &ctx.accounts.metadata;

        let mut metadata_parsed = Metadata::from_account_info(metadata)?.clone();
        let ix = update_metadata_accounts(
            METAPLEX_PROGRAM_ID,
            metadata.key(),
            ctx.accounts.update_authority.key(),
            None,
            Some(metadata_parsed.data),
            None,
        );

        return invoke(
            &ix,
            &[
                ctx.accounts.update_authority.to_account_info(),
                ctx.accounts.metadata_program.clone(),
                metadata.clone(),
            ],
        );
    } */

    /*  fn decode(account_data: &Account<Metadata>) -> Result<Metadata, Errors> {
        let metadata: Metadata = match try_from_slice_unchecked(&account_data.data) {
            Ok(m) => m,
            Err(err) => return Err(Errors::Unexpected.into()),
        };
        Ok(metadata)
    } */

    pub fn update_evolution(
        ctx: Context<UpdateEvolution>,
        evolution_account_bump: u8,
        new_config: String,
        new_role: String,
    ) -> ProgramResult {
        let evolution_account = &mut ctx.accounts.evolution_account;
        evolution_account.new_metadata = new_config;
        evolution_account.new_role = new_role;

        Ok(())
    }

    pub fn reveal(
        ctx: Context<Reveal>,
        evolution_account_bump: u8,
        vault_nft_account_bump: u8,
    ) -> ProgramResult {
        msg!("user {}", ctx.accounts.user.key());

        let evolution_account = &mut ctx.accounts.evolution_account;

        let threeDaysInSeconds = 259200;

        /*   let now = Clock::get()?.unix_timestamp as u64;

               if now < (evolution_account.start_evolution as u64 + threeDaysInSeconds) {
                   return Err(Errors::ToEarly.into());
               }
        */
        let metadata = &ctx.accounts.metadata;

        if !evolution_account.new_metadata.is_empty() {
            msg!("before meta parsing");

            let mut metadata_parsed = Metadata::from_account_info(metadata)?.clone();
            let arweave_base = &mut String::from("https://arweave.net/");
            arweave_base.push_str(&*evolution_account.new_metadata);
            metadata_parsed.data.uri = arweave_base.to_string();

            msg!("before update meta trans creation");

            let ix = update_metadata_accounts(
                METAPLEX_PROGRAM_ID,
                metadata.key(),
                ctx.accounts.metadata_update_authority.key(),
                None,
                Some(metadata_parsed.data),
                None,
            );

            msg!("before update meta invoke");
            invoke(
                &ix,
                &[
                    ctx.accounts.metadata_update_authority.to_account_info(),
                    ctx.accounts.metadata_program.clone(),
                    metadata.clone(),
                ],
            )?;
        }

        let seeds = &[
            &SAC_PDA_SEED[..],
            ctx.accounts.nft_mint.to_account_info().key.as_ref(),
            &[vault_nft_account_bump],
        ];
        let member_signer = &[&seeds[..]];

        msg!("before send nft back");

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.clone(),
            token::Transfer {
                from: ctx.accounts.vault_nft_account.to_account_info(),
                to: ctx.accounts.user_nft_account.to_account_info(),
                authority: ctx.accounts.vault_nft_account.to_account_info(),
            },
            member_signer,
        );
        token::transfer(cpi_ctx, 1)?;

        msg!("before close account");

        anchor_lang::AccountsClose::close(
            &ctx.accounts.evolution_account,
            ctx.accounts.user.to_account_info(),
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    /*   #[account(init, payer = user)]
    pub program_config: Account<'info, ProgramConfig>, */
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct ProgramConfig {
    puff_token_account: Pubkey,
    authority: Pubkey,
}

fn getRole(tokenString: String) -> String {
    return String::from("");
}

#[account]
/* #[derive(Copy)] */
pub struct EvolutionAccount {
    pub authority: Pubkey,
    pub token: Pubkey,
    pub start_evolution: i64,
    pub new_role: String,
    pub new_metadata: String,
    pub bump: u8,
    pub vault_nft_account_bump: u8, // ???
    pub is_dmt: bool,
    pub is_ayahuasca: bool,
}

#[derive(Accounts)]
#[instruction(evolution_account_bump: u8, vault_nft_account_bump: u8)]
pub struct StartEvolution<'info> {
    #[account(init, payer = user, space=150, seeds = [nft_mint.key().as_ref(), user.key().as_ref()], bump = evolution_account_bump)]
    pub evolution_account: Account<'info, EvolutionAccount>,
    pub user: Signer<'info>,
    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"sac", nft_mint.key().as_ref()],
        bump = vault_nft_account_bump,
        token::mint = nft_mint,
        token::authority = vault_nft_account,
    )]
    pub vault_nft_account: Account<'info, TokenAccount>,
    #[account(mut, constraint = user_nft_account.owner.key() == user.key())]
    pub user_nft_account: Account<'info, TokenAccount>,
    pub nft_mint: Account<'info, Mint>,
    #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
    #[account(mut, constraint = user_puff_token_account.owner.key() == user.key())]
    pub user_puff_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = program_puff_token_account.owner.key() == PROGRAM_PUFF_WALLET)]
    pub program_puff_token_account: Box<Account<'info, TokenAccount>>,
    pub puff_token: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}

#[event]
pub struct EvolutionStarted {
    pub mint: String,
    pub token: String,
    pub evolution_account_bump: u8,
}

#[derive(Accounts)]
#[instruction(evolution_account_bump: u8)]
pub struct UpdateEvolution<'info> {
    #[account(mut, seeds = [nft_mint.key().as_ref(), user.key().as_ref()], bump = evolution_account_bump)]
    pub evolution_account: Account<'info, EvolutionAccount>,
    pub user: AccountInfo<'info>,
    #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub nft_mint: Account<'info, Mint>,
}

#[derive(Accounts)]
#[instruction(evolution_account_bump: u8, vault_nft_account_bump: u8)]
pub struct Reveal<'info> {
    #[account(mut, constraint = evolution_account.authority.key() == user.key(), seeds = [nft_mint.key().as_ref(), user.key().as_ref()], bump = evolution_account_bump)]
    pub evolution_account: Account<'info, EvolutionAccount>,
    pub user: Signer<'info>, // signer is our backend
    #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: AccountInfo<'info>,
    #[account(mut, constraint = user_nft_account.owner.key() == user.key())]
    pub user_nft_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"sac", nft_mint.key().as_ref()],
        bump = vault_nft_account_bump,
    )]
    pub vault_nft_account: Account<'info, TokenAccount>,
    pub nft_mint: Account<'info, Mint>,
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    #[account(signer)]
    pub metadata_update_authority: AccountInfo<'info>,
    pub metadata_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}

#[error]
pub enum Errors {
    #[msg("NFT must be from Stoned Ape Crew & of role Chimpion")]
    WrongMint,
    #[msg("You can't reveal now, your Ape is still on retreat")]
    ToEarly,
    #[msg("Unexpected error")]
    Unexpected,
}

#[derive(Accounts)]
pub struct UpdateMetadata<'info> {
    #[account(signer)]
    pub beidl: AccountInfo<'info>,
    pub user: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    #[account(mut)]
    pub update_authority: AccountInfo<'info>,
    pub metadata_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}
