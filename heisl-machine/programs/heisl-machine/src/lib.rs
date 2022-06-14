use anchor_lang::prelude::*;
use anchor_lang::solana_program::{pubkey, pubkey::Pubkey};

declare_id!("2CKQ2cYrMbD9fgFnZJtWTfV8Sqp3EL2xembvDK9nxNCM");

const BACKEND_USER: Pubkey = pubkey!("9XcVSR68PTMr987BjCStW13LauzQiuYUv6vKMUorPEax");

#[program]
pub mod heisl_machine {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn init_launch(
        ctx: Context<InitLaunchCtx>,
        identifier: String,
        nft_count: u32,
    ) -> Result<()> {
        let launch = &mut ctx.accounts.launch;

        if launch.identifier.len() > 0 && launch.authority != ctx.accounts.user.key() {
            return err!(ErrorCode::NotAuthorized);
        }

        launch.authority = ctx.accounts.user.key();
        launch.identifier = identifier;
        launch.nft_count = nft_count;
        launch.launch_mints = ctx.accounts.launch_mints.key();

        Ok(())
    }

    pub fn reset_launch(
        ctx: Context<InitLaunchCtx>,
        identifier: String,
        nft_count: u32,
    ) -> Result<()> {
        let launch = &mut ctx.accounts.launch;

        if launch.identifier.len() > 0 && launch.authority != ctx.accounts.user.key() {
            return err!(ErrorCode::NotAuthorized);
        }

        launch.already_minted_old.clear();

        Ok(())
    }

    pub fn close(ctx: Context<CloseCtx>) -> Result<()> {
        let launch = &mut ctx.accounts.launch;

        if launch.authority != ctx.accounts.user.key() {
            return err!(ErrorCode::NotAuthorized);
        }

        Ok(())
    }

    pub fn mint(ctx: Context<MintCtx>, mint_id: u16) -> Result<()> {

        let launch_mints = &mut ctx.accounts.launch_mints.load_mut()?;

        let counter = launch_mints.counter;

        if counter >= 21000 {
            return err!(ErrorCode::MintNotAvailable);
        }

        let set_elements = &launch_mints.already_minted[0..counter as usize];
        if set_elements.contains(&mint_id) {
            return err!(ErrorCode::AlreadyMinted);
        }

        launch_mints.already_minted[counter as usize] = mint_id;
        launch_mints.counter = counter + 1;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(identifier: String, nft_count: u32)]
pub struct InitLaunchCtx<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(init_if_needed, space = 3000, payer = user, seeds = [identifier.as_ref()], bump)]
    pub launch: Account<'info, Launch>,
    #[account(zero)]
    pub launch_mints: AccountLoader<'info, LaunchMints>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseCtx<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut, close = user, seeds = [launch.identifier.as_ref()], bump)]
    pub launch: Account<'info, Launch>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintCtx<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub launch_mints: AccountLoader<'info, LaunchMints>,
    #[account(constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Default, AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct InitLaunch {
    nft_count: u32,
    name: String,
}

#[account]
#[derive(Default)]
pub struct Launch {
    authority: Pubkey,
    identifier: String,
    nft_count: u32,
    already_minted_old: Vec<u32>,
    bump: u8,
    launch_mints: Pubkey,
}

#[account(zero_copy)]
pub struct LaunchMints {
    pub counter: u16,
    pub already_minted: [u16; 21000],
}

#[derive(Accounts)]
pub struct Initialize {}

#[error_code]
pub enum ErrorCode {
    #[msg("There was an error at the mint. Please try again.")]
    AlreadyMinted,
    #[msg("This mint is not available.")]
    MintNotAvailable,
    #[msg("You are not auhtorized")]
    NotAuthorized,
}
