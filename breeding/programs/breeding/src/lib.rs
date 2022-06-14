/* #![allow(clippy::integer_arithmetic)] */
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{pubkey, pubkey::Pubkey};
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use metaplex::solana_program::program::invoke;
use metaplex_token_metadata::instruction::update_metadata_accounts;
use metaplex_token_metadata::processor::process_update_metadata_accounts;
use metaplex_token_metadata::state::Metadata;
use num_enum::TryFromPrimitive;
use solana_program::borsh::*;
use solana_program::native_token::LAMPORTS_PER_SOL;
use std::convert::TryFrom;
use mpl_candy_machine::{self, program::NftCandyMachineV2, cpi::accounts::MintNFT};

declare_id!("GvZH4TH7tx3h5wDmUqA6ud2L79vSphUfBp7oufva6nZk");

const BACKEND_USER: Pubkey = pubkey!("NUKE6VXDcfyb51yvFwU67hDxj2qMgRdkdtUPKy6D3hC");

const PUFF_BURNER_WALLET: Pubkey = pubkey!("DBunqiu2mrnGLLQPm5mcEwnjeTGCLjjUze35vBHpWRWs");

const RENTAL_FEE_DEPOSIT_ACCOUNT: Pubkey = pubkey!("3uKJYpmtt8VnsJweVzao3eUt3bbeLGYrxud9pEFyaqMP");

struct StartBreedingGeneric<'info> {
    pub breeding_account: Account<'info, BreedingAccount>,
    pub user: AccountInfo<'info>,
    pub config_account: Account<'info, ConfigAccount>,

    pub ape1_vault: Account<'info, TokenAccount>,
    pub ape1_user_account: Box<Account<'info, TokenAccount>>,
    pub ape1_mint: Account<'info, Mint>,
    pub ape1_used: Account<'info, ApeUsed>,

    pub ape2_mint: Account<'info, Mint>,
    pub ape2_used: Account<'info, ApeUsed>,

    pub puff_token: Account<'info, Mint>,
    pub user_puff_token_account: Box<Account<'info, TokenAccount>>,
    pub program_puff_token_account: Box<Account<'info, TokenAccount>>,


    pub backend_user: AccountInfo<'info>,

    pub token_program: AccountInfo<'info>,

    /*   pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>, */
}

pub fn start_breeding_generic<'info>(
    breeding_account: &mut Account<'info, BreedingAccount>,
    breeding_config: &mut Account<'info, ConfigAccount>,
    user: &AccountInfo<'info>,
    ape1_vault: &Account<'info, TokenAccount>,
    ape1_user_account: &Box<Account<'info, TokenAccount>>,
    ape1_mint: &Account<'info, Mint>,
    ape1_used: &mut Account<'info, ApeUsed>,
    ape2_mint: &Account<'info, Mint>,
    ape2_used: &mut Account<'info, ApeUsed>,
    user_puff_token_account: &Box<Account<'info, TokenAccount>>,
    program_puff_token_account: &Box<Account<'info, TokenAccount>>,
    backend_user: &AccountInfo<'info>,
    token_program: &AccountInfo<'info>,
    ape1_vault_bump: u8,
) -> ProgramResult {
    breeding_account.authority = user.key();
    breeding_account.bump = ape1_vault_bump;
    breeding_account.start_breeding = Clock::get()?.unix_timestamp;
    breeding_account.breeding_config = breeding_config.key();
    breeding_account.ape1 = ape1_mint.key();
    breeding_account.ape2 = ape2_mint.key();

    /*

        let rent_account: Option<Account<'_, RentAccount>> =
        Account::try_from(&ctx.accounts.rent_account).ok();
    if (rent_account.is_some()) {
        let rent_account_some = rent_account.unwrap();
        msg!("rent account {:?}", rent_account_some.ape.key());
    } else {
        msg!("no rental system")
    } */

    let now = Clock::get()?.unix_timestamp as u64;

    let ten_days_in_seconds = 864_000;

    if ape1_used.counter == 0 {
        ape1_used.mint = ape1_mint.key();
        ape1_used.breeding_config = breeding_account.key();
    } else {
        if ape1_used.mint.key() != ape1_mint.key() {
            return Err(Errors::WrongMint.into());
        }
        if now < (ape1_used.last_use_start as u64) + ten_days_in_seconds    {
            return Err(Errors::CoolDown.into());
        }
    }

    if ape2_used.counter == 0 {
        ape2_used.mint = ape2_mint.key();
        ape2_used.breeding_config = breeding_account.key();
    } else {
        if ape2_used.mint.key() != ape2_mint.key() {
            return Err(Errors::WrongMint.into());
        }
        if now < (ape2_used.last_use_start as u64) + ten_days_in_seconds    {
            return Err(Errors::CoolDown.into());
        }
    }

   

    ape1_used.last_use_start = now as i64;
    ape2_used.last_use_start = now as i64;

    let increase_start = 1644987600;

    if (now > increase_start ) || false {
        breeding_config.counter = breeding_config.counter + 1;
    }

    
    
    // transfer puff from user to puff account
    let increase_steps = 100;
    let mut round: u32 = (breeding_config.counter) / increase_steps;
    if (now > increase_start ) || false {
        round = round + 1;
    }
    

    let ape1_used_factor =  (1.2649 as f64).powf( ape1_used.counter as f64);
    let ape2_used_factor =  (1.2649 as f64).powf( ape2_used.counter as f64);

    let increase_factor: f64 = (1.042 as f64).powf(round as f64) * ape1_used_factor * ape2_used_factor;

    let amount_f64 = 1780 as f64 * increase_factor * LAMPORTS_PER_SOL as f64;
    let amount = amount_f64 as u64;
    msg!(
        "amount {}, round {}, ape1_used_counter {}, ape2_used_counter {}",
        amount / LAMPORTS_PER_SOL,
        round,
        ape1_used.counter,
        ape2_used.counter,
    );
    let cpi_ctx = CpiContext::new(
        token_program.clone(),
        token::Transfer {
            from: user_puff_token_account.to_account_info(),
            to: program_puff_token_account.to_account_info(),
            authority: user.to_account_info(),
        },
    );
    token::transfer(cpi_ctx, amount)?;

    ape1_used.counter = ape1_used.counter + 1;
    ape2_used.counter = ape2_used.counter + 1;

    msg!("before ape1 transfer");

    // transfer ape1 to vault
    let cpi_ctx1 = CpiContext::new(
        token_program.clone(),
        token::Transfer {
            from: ape1_user_account.to_account_info(),
            to: ape1_vault.to_account_info(),
            authority: user.to_account_info(),
        },
    );
    token::transfer(cpi_ctx1, 1)?;

    // transfer ap2 to vault if exists if not charge sol

    Ok(())
}

#[program]
pub mod breeding {
    use super::*;
    use solana_program::system_instruction::transfer;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }

    pub fn init_breeding(
        ctx: Context<InitBreeding>,
        config_account_bump: u8,
        candy_machine: Pubkey,
    ) -> ProgramResult {
        let config_account = &mut ctx.accounts.config_account;
        config_account.authority = ctx.accounts.user.key();
        config_account.counter = 0;
        config_account.bump = config_account_bump;
        config_account.candy_machine = candy_machine;
        Ok(())
    }

    pub fn start_breeding(
        ctx: Context<StartBreeding>,
        ape1_vault_bump: u8,
        ape1_used_bump: u8,
        ape2_vault_bump: u8,
        ape2_used_bump: u8,
    ) -> ProgramResult {
        start_breeding_generic(
            &mut ctx.accounts.breeding_account,
            &mut ctx.accounts.config_account,
            &ctx.accounts.user,
            &ctx.accounts.ape1_vault,
            &ctx.accounts.ape1_user_account,
            &ctx.accounts.ape1_mint,
            &mut ctx.accounts.ape1_used,
            &ctx.accounts.ape2_mint,
            &mut ctx.accounts.ape2_used,
            &ctx.accounts.user_puff_token_account,
            &ctx.accounts.program_puff_token_account,
            &ctx.accounts.backend_user,
            &ctx.accounts.token_program,
            ape1_vault_bump,
        )?;

        msg!("before ape2 transfer");

        let cpi_ctx2 = CpiContext::new(
            ctx.accounts.token_program.clone(),
            token::Transfer {
                from: ctx.accounts.ape2_user_account.to_account_info(),
                to: ctx.accounts.ape2_vault.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(cpi_ctx2, 1)?;

        // transfer ap2 to vault if exists if not charge sol

        Ok(())
    }

    pub fn start_breeding_rental(
        ctx: Context<StartBreedingRental>,
        ape1_vault_bump: u8,
        ape1_used_bump: u8,
        ape2_used_bump: u8,
        renting_role: u8,
    ) -> ProgramResult {
        let breeding_account = &mut ctx.accounts.breeding_account;
        start_breeding_generic(
            breeding_account,
            &mut ctx.accounts.config_account,
            &ctx.accounts.user,
            &ctx.accounts.ape1_vault,
            &ctx.accounts.ape1_user_account,
            &ctx.accounts.ape1_mint,
            &mut ctx.accounts.ape1_used,
            &ctx.accounts.ape2_mint,
            &mut ctx.accounts.ape2_used,
            &ctx.accounts.user_puff_token_account,
            &ctx.accounts.program_puff_token_account,
            &ctx.accounts.backend_user,
            &ctx.accounts.token_program,
            ape1_vault_bump,
        )?;
        msg!("rent_account {:?}", ctx.accounts.rent_account.authority);

        breeding_account.rental_user = Some(ctx.accounts.rent_account.authority);

        msg!("role raw {:?}", renting_role);
        let renting_role_enum: Role = Role::try_from(renting_role).unwrap();

        let roleFactorUser = match renting_role_enum {
            Role::Chimpion => 3000,
            Role::FourRoles => 4200,
            Role::Sealz => 4200,
            Role::OneOutOfOne => 4200,
            _ => 4200,
        };

        invoke(
            &transfer(
                ctx.accounts.user.to_account_info().key,
                &ctx.accounts.rent_account.authority,
                roleFactorUser * LAMPORTS_PER_SOL / 1000,
            ),
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.rental_user.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        let roleFactorSac = match renting_role_enum {
            Role::Chimpion => 2250,
            Role::FourRoles => 1050,
            Role::Sealz => 1050,
            Role::OneOutOfOne => 1050,
            _ => 1050,
        };

        invoke(
            &transfer(
                ctx.accounts.user.to_account_info().key,
                &ctx.accounts.rental_fee_deposit_account.key(),
                roleFactorSac * LAMPORTS_PER_SOL / 1000,
            ),
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.rental_fee_deposit_account.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // transfer ap2 to vault if exists if not charge sol

        Ok(())
    }

    pub fn reveal(ctx: Context<Reveal>, ape1_vault_bump: u8, ape2_vault_bump: u8) -> ProgramResult {
        let breeding_account = &mut ctx.accounts.breeding_account;
        breeding_account.finished = true;

        let threeDaysInSeconds = 259200;

        let now = Clock::get()?.unix_timestamp as u64;

        if now < (breeding_account.start_breeding as u64 + threeDaysInSeconds) {
            return Err(Errors::ToEarly.into());
        }

        let ape1Key = breeding_account.ape1.key();

        let seeds = &[
            &b"vault"[..],
            ape1Key.as_ref(),
            &[ape1_vault_bump],
        ];
        let member_signer = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.clone(),
            token::Transfer {
                from: ctx.accounts.ape1_vault.to_account_info(),
                to: ctx.accounts.ape1_user_account.to_account_info(),
                authority: ctx.accounts.ape1_vault.to_account_info(),
            },
            member_signer,
        );
        token::transfer(cpi_ctx, 1)?;


        if breeding_account.rental_user.is_some() {
            let rental_user = breeding_account.rental_user.unwrap();
            if ctx.accounts.ape2_user_account.owner != rental_user {
                return Err(Errors::WrongApe2TokenAccount.into());
            }
        } else {
            if ctx.accounts.ape2_user_account.owner != ctx.accounts.user.key() {
                return Err(Errors::WrongApe2TokenAccount.into());
            }
        }

        let ape2Key = breeding_account.ape2.key();
        let seeds = &[
            &b"vault"[..],
            ape2Key.as_ref(),
            &[ape2_vault_bump],
        ];
        let member_signer = &[&seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.clone(),
            token::Transfer {
                from: ctx.accounts.ape2_vault.to_account_info(),
                to: ctx.accounts.ape2_user_account.to_account_info(),
                authority: ctx.accounts.ape2_vault.to_account_info(),
            },
            member_signer,
        );
        token::transfer(cpi_ctx, 1)?;

        Ok(())
    }

    pub fn breed(ctx: Context<Breed>, creator_bump: u8) -> ProgramResult {
       /*  msg!("Will Breed");
        let breeding_account = &mut ctx.accounts.breeding_account;

        let breeding_config = &mut ctx.accounts.config_account;

        let seeds = &[&b"sac"[..], &[breeding_config.bump]]; */

        msg!("Will Mint");
        let _ = mpl_candy_machine::cpi::mint_nft(
            ctx.accounts.init_mint_ctx(), //.with_signer(&[&seeds[..]]),
            creator_bump,
        );

        Ok(())
    }

    pub fn start_rent(ctx: Context<StartRent>, ape_vault_bump: u8) -> ProgramResult {
        let rent_account = &mut ctx.accounts.rent_account;
        rent_account.authority = ctx.accounts.user.key();
        rent_account.bump = ape_vault_bump;
        rent_account.start_renting = Clock::get()?.unix_timestamp;
        rent_account.breeding_config = ctx.accounts.config_account.key();
        rent_account.ape = ctx.accounts.ape_mint.key();

        // transfer ap1 to vault
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.clone(),
            token::Transfer {
                from: ctx.accounts.ape_user_account.to_account_info(),
                to: ctx.accounts.ape_vault.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, 1)?;

        Ok(())
    }

    pub fn unrent(ctx: Context<Unrent>, ape_vault_bump: u8) -> ProgramResult {
        let seeds = &[
            &b"vault"[..],
            ctx.accounts.ape_mint.to_account_info().key.as_ref(),
            &[ape_vault_bump],
        ];
        let member_signer = &[&seeds[..]];

        // transfer ap1 to vault
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.clone(),
            token::Transfer {
                from: ctx.accounts.ape_vault.to_account_info(),
                to: ctx.accounts.ape_user_account.to_account_info(),
                authority: ctx.accounts.ape_vault.to_account_info(),
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
#[instruction(breeding_account_bump: u8)]
pub struct InitBreeding<'info> {
    #[account(signer, constraint = user.key() == BACKEND_USER)]
    pub user: AccountInfo<'info>,
    #[account(init, payer = user, seeds = [b"sac".as_ref()], bump = breeding_account_bump)]
    pub config_account: Account<'info, ConfigAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(ape1_vault_bump: u8, ape1_used_bump: u8, ape2_vault_bump: u8, ape2_used_bump: u8)]
pub struct StartBreeding<'info> {
    #[account(init, payer = user, space = 300)]
    pub breeding_account: Account<'info, BreedingAccount>,
    #[account(signer, mut)]
    pub user: AccountInfo<'info>,

    #[account(mut, seeds = [b"sac".as_ref()], bump = config_account.bump)]
    pub config_account: Account<'info, ConfigAccount>,

    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"vault", ape1_mint.key().as_ref()],
        bump = ape1_vault_bump,
        token::mint = ape1_mint,
        token::authority = ape1_vault,
    )]
    pub ape1_vault: Account<'info, TokenAccount>,

    #[account(mut, constraint = ape1_user_account.owner.key() == user.key())]
    pub ape1_user_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub ape1_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"apeUsed", ape1_mint.key().as_ref()],
        bump = ape1_used_bump,
    )]
    pub ape1_used: Account<'info, ApeUsed>,

    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"vault", ape2_mint.key().as_ref()],
        bump = ape2_vault_bump,
        token::mint = ape2_mint,
        token::authority = ape2_vault,
    )]
    pub ape2_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = ape2_user_account.owner.key() == user.key())]
    pub ape2_user_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub ape2_mint: Box<Account<'info, Mint>>,

    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"apeUsed", ape2_mint.key().as_ref()],
        bump = ape2_used_bump,
    )]
    pub ape2_used: Box<Account<'info, ApeUsed>>,

    #[account(mut)]
    pub puff_token: Box<Account<'info, Mint>>,
    #[account(mut, constraint = user_puff_token_account.owner.key() == user.key())]
    pub user_puff_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = program_puff_token_account.owner.key() == PUFF_BURNER_WALLET)]
    pub program_puff_token_account: Box<Account<'info, TokenAccount>>,

    #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(ape1_vault_bump: u8, ape1_used_bump: u8, ape2_used_bump: u8)]
pub struct StartBreedingRental<'info> {
    #[account(init, payer = user, space = 300)]
    pub breeding_account: Account<'info, BreedingAccount>,
    #[account(signer, mut)]
    pub user: AccountInfo<'info>,

    #[account(mut)]
    pub rental_user: SystemAccount<'info>,

    #[account(mut, seeds = [b"sac".as_ref()], bump = config_account.bump)]
    pub config_account: Account<'info, ConfigAccount>,

    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"vault", ape1_mint.key().as_ref()],
        bump = ape1_vault_bump,
        token::mint = ape1_mint,
        token::authority = ape1_vault,
    )]
    pub ape1_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = ape1_user_account.owner.key() == user.key())]
    pub ape1_user_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub ape1_mint: Box<Account<'info, Mint>>,

    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"apeUsed", ape1_mint.key().as_ref()],
        bump = ape1_used_bump,
    )]
    pub ape1_used: Box<Account<'info, ApeUsed>>,

    #[account(mut, close=user)]
    pub rent_account: Box<Account<'info, RentAccount>>,

    #[account(mut)]
    pub ape2_mint: Box<Account<'info, Mint>>,

    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"apeUsed", ape2_mint.key().as_ref()],
        bump = ape2_used_bump,
    )]
    pub ape2_used: Box<Account<'info, ApeUsed>>,

    #[account(mut)]
    pub puff_token: Box<Account<'info, Mint>>,
    #[account(mut, constraint = user_puff_token_account.owner.key() == user.key())]
    pub user_puff_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = program_puff_token_account.owner.key() == PUFF_BURNER_WALLET)]
    pub program_puff_token_account: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = rental_fee_deposit_account.key() == RENTAL_FEE_DEPOSIT_ACCOUNT)]
    pub rental_fee_deposit_account: AccountInfo<'info>,

    #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(ape1_vault_bump: u8, ape2_vault_bump: u8)]
pub struct Reveal<'info> {
    #[account(mut, constraint = breeding_account.authority.key() == user.key())]
    pub breeding_account: Account<'info, BreedingAccount>,
    #[account(signer, mut)]
    pub user: AccountInfo<'info>,

    #[account(mut, seeds = [b"sac".as_ref()], bump = config_account.bump)]
    pub config_account: Account<'info, ConfigAccount>,

    #[account(
        mut,
        seeds = [b"vault", breeding_account.ape1.key().as_ref()],
        bump = ape1_vault_bump,
    )]
    pub ape1_vault: Account<'info, TokenAccount>,
    #[account(mut, constraint = ape1_user_account.owner.key() == user.key())]
    pub ape1_user_account: Box<Account<'info, TokenAccount>>,
   /*  #[account(mut)]
    pub ape1_mint: Account<'info, Mint>, */

    #[account(
        mut,
        seeds = [b"vault", breeding_account.ape2.key().as_ref()],
        bump = ape2_vault_bump,
    )]
    pub ape2_vault: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub ape2_user_account: Box<Account<'info, TokenAccount>>,
  /*   #[account(mut)]
    pub ape2_mint: Box<Account<'info, Mint>>, */

    #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
#[instruction(ape_vault_bump: u8)]
pub struct StartRent<'info> {
    #[account(init, payer = user)]
    pub rent_account: Account<'info, RentAccount>,
    #[account(signer, mut)]
    pub user: AccountInfo<'info>,

    #[account(mut, seeds = [b"sac".as_ref()], bump = config_account.bump)]
    pub config_account: Account<'info, ConfigAccount>,

    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"vault", ape_mint.key().as_ref()],
        bump = ape_vault_bump,
        token::mint = ape_mint,
        token::authority = ape_vault,
    )]
    pub ape_vault: Account<'info, TokenAccount>,
    #[account(mut, constraint = ape_user_account.owner.key() == user.key())]
    pub ape_user_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub ape_mint: Account<'info, Mint>,

    #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(ape_vault_bump: u8)]
pub struct Unrent<'info> {
    #[account(mut, close = user, constraint = rent_account.authority.key() == user.key())]
    pub rent_account: Account<'info, RentAccount>,
    #[account(signer, mut)]
    pub user: AccountInfo<'info>,

    #[account(mut, seeds = [b"sac".as_ref()], bump = config_account.bump)]
    pub config_account: Account<'info, ConfigAccount>,

    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"vault", ape_mint.key().as_ref()],
        bump = ape_vault_bump,
        token::mint = ape_mint,
        token::authority = ape_vault,
    )]
    pub ape_vault: Account<'info, TokenAccount>,
    #[account(mut, constraint = ape_user_account.owner.key() == user.key())]
    pub ape_user_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub ape_mint: Account<'info, Mint>,

    #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}

// 32 + 4 +1 + (4200*34) = 142,837
#[account]
#[derive(Default, Copy)]
pub struct ConfigAccount {
    pub authority: Pubkey,
    pub counter: u32,
    pub bump: u8,
    pub candy_machine: Pubkey,
}

// 32 + 2 = 34
#[account]
#[derive(Default, Copy)]
pub struct ApeUsed {
    pub breeding_config: Pubkey,
    pub mint: Pubkey,
    pub counter: u16,
    pub last_use_start: i64
}

#[account]
#[derive(Default)]
pub struct BasicAccount {}

#[account]
#[derive(Default)]
pub struct RentAccount {
    pub authority: Pubkey,
    pub breeding_config: Pubkey,
    pub start_renting: i64,
    pub ape: Pubkey,
    pub vault_ape_account_bump: u8,
    pub is_breeding: bool,

    pub bump: u8,
}

// 5 * 42 + 8 + 1 + 1
#[account]
#[derive(Default)]
pub struct BreedingAccount {
    pub authority: Pubkey,
    pub breeding_config: Pubkey,
    pub start_breeding: i64,
    pub ape1: Pubkey,
    pub ape2: Pubkey,
    pub vault_nft_account_bump: u8,
    pub rental_user: Option<Pubkey>,
    pub finished: bool,

    pub bump: u8,
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

#[error]
pub enum Errors {
    #[msg("ApeUsed account has wrong mint")]
    WrongMint,
    #[msg("You can't reveal now, your Ape is still on retreat")]
    ToEarly,
    #[msg("Your hasn't cooled down for 7 days")]
    CoolDown,
    #[msg("Wrong ape2 token account")]
    WrongApe2TokenAccount,
    #[msg("Unexpected error")]
    Unexpected,
}

#[derive(Accounts)]
#[instruction(creator_bump: u8)]
pub struct Breed<'info> {
    #[account(signer, mut)]
    pub user: AccountInfo<'info>,

   /*  #[account(mut, seeds = [b"sac".as_ref()], bump = config_account.bump)]
    pub config_account: Account<'info, ConfigAccount>,
    #[account(mut, /* close=user, */ constraint = breeding_account.authority.key() == user.key())]
    pub breeding_account: Account<'info, BreedingAccount>, */

    #[account(signer, mut, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,

    candy_machine_program: Program<'info, NftCandyMachineV2>,
    #[account(
        mut,
       /*  has_one = wallet */
    )]
    candy_machine: Box<Account<'info, mpl_candy_machine::CandyMachine>>,
    // #[account(mut, seeds=[b"candy_machine", candy_machine.key().as_ref()], bump=creator_bump)]
    candy_machine_creator: UncheckedAccount<'info>,
    #[account(mut)]
    wallet: UncheckedAccount<'info>,
    #[account(mut)]
    metadata: UncheckedAccount<'info>,
    #[account(mut)]
    mint: UncheckedAccount<'info>, //Box<Account<'info, Mint>>,

    pub mint_authority: Signer<'info>,
    #[account(mut)]
    master_edition: UncheckedAccount<'info>,
    token_metadata_program: UncheckedAccount<'info>,
    clock: Sysvar<'info, Clock>,
    recent_blockhashes: UncheckedAccount<'info>,
    instruction_sysvar_account: UncheckedAccount<'info>,
}

impl<'info> Breed<'info> {
    fn init_mint_ctx(&self) -> CpiContext<'_, '_, '_, 'info, MintNFT<'info>> {
        let user = &mut &self.user;
        CpiContext::new(
            self.candy_machine_program.to_account_info(),
            MintNFT {
                candy_machine: self.candy_machine.to_account_info(),
                candy_machine_creator: self.candy_machine_creator.to_account_info(),
                payer: self.backend_user.to_account_info(),
                wallet: self.backend_user.to_account_info(),
                metadata: self.metadata.to_account_info(),
                mint: self.mint.to_account_info(),
                mint_authority: self.mint_authority.to_account_info(), //self.mint_authority.to_account_info(),
                update_authority: self.backend_user.to_account_info(), //self.update_authority.to_account_info(),
                master_edition: self.master_edition.to_account_info(),
                token_metadata_program: self.token_metadata_program.to_account_info(),
                clock: self.clock.to_account_info(),
                recent_blockhashes: self.recent_blockhashes.to_account_info(),
                instruction_sysvar_account: self.instruction_sysvar_account.to_account_info(),
                rent: self.rent.to_account_info(),
                system_program: self.system_program.to_account_info(),
                token_program: self.token_program.to_account_info(),
            },
        )
    }
}