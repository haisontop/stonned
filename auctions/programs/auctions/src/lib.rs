use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use solana_program::program::invoke;
use solana_program::system_instruction::transfer;

declare_id!("7ZK5nsYZ9TZjBchxwik9SzjBatDbyQvNUJ7BakSr6LDp");

#[program]
pub mod auctions {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
    pub fn init_auction(
        ctx: Context<InitAuction>,
        bump: u8,
        name: String,
        starts: i64,
        ends: i64,
        prize_mint: Pubkey,
        is_bid_token_sol: bool,
        bid_token: Pubkey,
        mint_value: u64,
        currency: String,
        min_bid_increase: u64,
        start_bid: u64,
        finish_extension_time_sec: u64,
    ) -> Result<()> {
        let auction = &mut ctx.accounts.auction;

        auction.bump = bump;
        auction.name = name;
        auction.authority = ctx.accounts.user.key();
        auction.starts = starts;
        auction.ends = ends;
        auction.prize_mint = prize_mint;
        auction.is_bid_token_sol = is_bid_token_sol;
        auction.bid_token = bid_token;
        auction.mint_value = mint_value;
        auction.currency = currency;
        auction.min_bid_increase = min_bid_increase;
        auction.finish_extension_time_sec = finish_extension_time_sec;

        if auction.bids.len() == 0 {
            let now = Clock::get()?.unix_timestamp;
            auction.bids.push(BidEntry {
                created_at: now,
                amount: start_bid,
                user: ctx.accounts.user.key(),
            })
        }

        Ok(())
    }

    pub fn bid(ctx: Context<Bid>, bid_amount: u64) -> Result<()> {
        msg!("will bid");

        let auction = &mut ctx.accounts.auction;

        let now = Clock::get()?.unix_timestamp;

        if now > auction.ends {
            return Err(ErrorCode::AuctionEnded.into());
        }

        let last_bid = auction.bids[0];

        if last_bid.amount + auction.min_bid_increase > bid_amount {
            return err!(ErrorCode::InvalidCheckNonce);
        }

        if auction.bids.len() > 1 {
            if ctx.accounts.last_bid_token_account.owner != last_bid.user {
                return err!(ErrorCode::WrongTokenAccount);
            }

            let auction_key = auction.to_account_info().key.as_ref();
            let seed = &[&b"vault"[..], auction_key];
            let (pda, bump) = Pubkey::find_program_address(seed, ctx.program_id);

            let seeds = &[&b"vault"[..], auction_key, &[bump]];
            let member_signer = &[&seeds[..]];
            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.vault_token_account.to_account_info(),
                    to: ctx.accounts.last_bid_token_account.to_account_info(),
                    authority: ctx.accounts.vault_token_account.to_account_info(),
                },
                member_signer,
            );
            token::transfer(cpi_ctx, last_bid.amount)?;
        }

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.vault_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, bid_amount)?;

        auction.bids.insert(
            0,
            BidEntry {
                user: ctx.accounts.user.key(),
                amount: bid_amount,
                created_at: now,
            },
        );

        if auction.ends - now < auction.finish_extension_time_sec as i64 {
            auction.ends = auction.ends + auction.finish_extension_time_sec as i64
        }

        Ok(())
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        msg!("will claim price");

        let auction = &ctx.accounts.auction;

        let now = Clock::get()?.unix_timestamp;

        if now < auction.ends {
            return Err(ErrorCode::AuctionNotEnded.into());
        }

        if auction.prize_sent {
            return Err(ErrorCode::PriceAlreadyClaimed.into());
        }

        if ctx.accounts.user_prize_token_account.owner != auction.bids[0].user {
            return err!(ErrorCode::WrongTokenAccount);
        }

        msg!("will send price");

        let auction_key = ctx.accounts.auction.to_account_info().key.as_ref();
        let seed = &[&b"prize_vault"[..], auction_key];
        let (pda, bump) = Pubkey::find_program_address(seed, ctx.program_id);

        let seeds = &[&b"prize_vault"[..], auction_key, &[bump]];
        let member_signer = &[&seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.prize_vault_token_account.to_account_info(),
                to: ctx.accounts.user_prize_token_account.to_account_info(),
                authority: ctx.accounts.prize_vault_token_account.to_account_info(),
            },
            member_signer,
        );
        token::transfer(cpi_ctx, 1)?;

        ctx.accounts.auction.prize_sent = true;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
#[instruction(lottery_bump: u8, name: String)]
pub struct InitAuction<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(init_if_needed, space = 4000, payer = user, seeds = [user.key().as_ref(), name.as_ref()], bump)]
    pub auction: Account<'info, Auction>,

    #[account(init_if_needed, payer = user, token::mint = bid_token, token::authority= vault_token_account, seeds = [b"vault", auction.key().as_ref()], bump )]
    pub vault_token_account: Box<Account<'info, TokenAccount>>,
    pub bid_token: Box<Account<'info, Mint>>,

    #[account(init_if_needed, payer = user, token::mint = prize_token, token::authority= prize_vault_token_account, seeds = [b"prize_vault", auction.key().as_ref()], bump )]
    pub prize_vault_token_account: Box<Account<'info, TokenAccount>>,
    pub prize_token: Box<Account<'info, Mint>>,

    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct Bid<'info> {
    pub user: Signer<'info>,
    #[account(mut, seeds = [auction.authority.key().as_ref(), auction.name.as_ref()], bump = auction.bump)]
    pub auction: Account<'info, Auction>,
    #[account(mut, token::mint = bid_token, token::authority = user.key())]
    pub user_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut, token::mint = bid_token)]
    pub last_bid_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut, token::mint = bid_token, token::authority= vault_token_account, seeds = [b"vault", auction.key().as_ref()], bump )]
    pub vault_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = bid_token.key() == auction.bid_token)]
    pub bid_token: Box<Account<'info, Mint>>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    pub user: Signer<'info>,
    #[account(mut, seeds = [auction.authority.key().as_ref(), auction.name.as_ref()], bump = auction.bump)]
    pub auction: Account<'info, Auction>,

    #[account(mut, token::mint = prize_mint)]
    pub user_prize_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut, token::mint = prize_mint, token::authority= prize_vault_token_account, seeds = [b"prize_vault", auction.key().as_ref()], bump )]
    pub prize_vault_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut,constraint = prize_mint.key() == auction.prize_mint)]
    pub prize_mint: Box<Account<'info, Mint>>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(Default)]
pub struct Auction {
    authority: Pubkey,
    bump: u8,
    funds_user: Pubkey,
    name: String,
    starts: i64,
    ends: i64,
    prize_mint: Pubkey,
    bid_token: Pubkey,
    is_bid_token_sol: bool,
    mint_value: u64,
    prize_sent: bool,
    bids: Vec<BidEntry>,
    currency: String,
    min_bid_increase: u64,
    finish_extension_time_sec: u64,
}

#[derive(Default, AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug)]
pub struct BidEntry {
    user: Pubkey,
    amount: u64,
    created_at: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The bid must be bigger than the current one")]
    InvalidCheckNonce,
    #[msg("You sent the wrong token account")]
    WrongTokenAccount,
    #[msg("Auction already ended")]
    AuctionEnded,
    #[msg("Auction not ended yet")]
    AuctionNotEnded,
    #[msg("Prize already claimed")]
    PriceAlreadyClaimed,
}
