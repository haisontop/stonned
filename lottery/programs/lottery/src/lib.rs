use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use solana_program::program::invoke;
use solana_program::system_instruction::transfer;

use solana_program::pubkey;
use std::convert::TryInto;
use switchboard_program::VrfAccount;

declare_id!("WJd4Vj59h7Za3Kn8kN8HwbnAhk9UByn6UQpoJkrdFhR");

const BACKEND_USER: Pubkey = pubkey!("DEfxfeZwTighkBpwjzyhJGe1uPmn25og5EgyvM3T7fEc");

#[program]
pub mod lottery {

    use super::*;
    use std::{mem, thread::AccessError};

    pub fn init_lottery(
        ctx: Context<InitLottery>,
        lottery_bump: u8,
        name: String,
        ticket_price: u64,
        prices: Vec<Price>,
        starts: i64,
        ends: i64,
        total_price_sol: u64,
        pay_tokens: Vec<Pubkey>,
    ) -> ProgramResult {
        msg!("will init lottery {:?}", name);

        let lottery = &mut ctx.accounts.lottery;

        lottery.bump = lottery_bump;
        lottery.authority = ctx.accounts.user.key();
        lottery.name = name;
        lottery.ticket_price = ticket_price;
        lottery.starts = starts;
        lottery.ends = ends;
        lottery.pay_tokens = pay_tokens;
        lottery.funds_user = ctx.accounts.user.key();
        lottery.total_price_sol = total_price_sol;

        msg!("prices {:?}", prices);
        lottery.prices = prices;

        Ok(())
    }

    pub fn add_prices(ctx: Context<AddPrices>, prices: Vec<Price>) -> ProgramResult {
        let lottery = &mut ctx.accounts.lottery;

        msg!("will add prices {:?}", lottery.name);

        let prices_mut = &mut prices.clone();

        lottery.prices.append(prices_mut);

        Ok(())
    }

    pub fn buy_ticket(
        ctx: Context<BuyTicket>,
        user_lottery_bump: u8,
        ticket_count: u32,
        pay_with_sol: bool,
        spl_price: u64,
    ) -> ProgramResult {
        msg!("will buy_ticket");
        let lottery = &mut ctx.accounts.lottery;

        let lottery_user = &mut ctx.accounts.lottery_user;
        lottery_user.bump = user_lottery_bump;
        lottery_user.authority = ctx.accounts.user.key();
        lottery_user.lottery = lottery.key();

        let now = Clock::get()?.unix_timestamp as u64;

        if now > lottery.ends as u64 {
            return Err(ErrorCode::LotteryPayWindowOver.into());
        }

        if (lottery_user.tickets.len() as u32 + ticket_count) > 100 {
            return Err(ErrorCode::MaximumTicketCount.into());
        }

        let mut i = 0;
        while i < ticket_count {
            lottery.ticket_count = lottery.ticket_count + 1;
            lottery_user.counter = lottery_user.counter + 1;
            lottery_user.tickets.push(lottery.ticket_count);
            i = i + 1;
        }

        /*  if ctx.accounts.funds_token_account.key() != lottery.funds_token_account {
            return Err(ErrorCode::InvalidPayTokenAccount.into());
        } */

        if pay_with_sol {
            invoke(
                &transfer(
                    ctx.accounts.user.to_account_info().key,
                    ctx.accounts.funds_user.to_account_info().key,
                    lottery.ticket_price * ticket_count as u64,
                ),
                &[
                    ctx.accounts.user.to_account_info(),
                    ctx.accounts.funds_user.to_account_info(),
                    ctx.accounts.system_program.to_account_info(),
                ],
            )?;
        } else {
            let cpi_ctx = CpiContext::new(
                ctx.accounts.token_program.clone(),
                token::Transfer {
                    from: ctx.accounts.user_token_account.to_account_info(),
                    to: ctx.accounts.funds_token_account.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            );
            token::transfer(cpi_ctx, spl_price * ticket_count as u64)?;
        }

        Ok(())
    }

    pub fn raffle(
        ctx: Context<Raffle>,
        winning_tickets: Vec<u32>,
        winners: Vec<Pubkey>,
    ) -> ProgramResult {
        let mut lottery = &mut ctx.accounts.lottery;

        lottery.winning_tickets = winning_tickets;
        lottery.winners = winners;

        for i in 0..lottery.winning_tickets.len() {
            lottery.prices[i].winning_ticket = lottery.winning_tickets[i];
        }

        Ok(())
    }

    pub fn claim(ctx: Context<Claim>, ticket: u32) -> ProgramResult {
        msg!("will claim price");
        let lottery = &mut ctx.accounts.lottery;
        let mint = &ctx.accounts.mint;

        let index = lottery
            .winning_tickets
            .iter()
            .position(|&t| t == ticket)
            .expect("Ticket does not exists");

        if ctx
            .accounts
            .lottery_user
            .tickets
            .iter()
            .position(|&t| t == ticket)
            .is_none()
        {
            return Err(ErrorCode::WrongMint.into());
        }

        let mut price = lottery.prices[index];

        if price.price_sent {
            return Err(ErrorCode::PriceAlreadyClaimed.into());
        }

        lottery.prices[index].price_sent = true;

        if mint.key() != price.mint {
            return Err(ErrorCode::WrongMint.into());
        }

        let cpi_ctx1 = CpiContext::new(
            ctx.accounts.token_program.clone(),
            token::Transfer {
                from: ctx.accounts.prices_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.price_wallet_signer.to_account_info(),
            },
        );
        token::transfer(cpi_ctx1, price.amount as u64)?;

        Ok(())
    }

    #[derive(Accounts)]
    pub struct Close<'info> {
        pub user: Signer<'info>,
        #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
        pub backend_user: AccountInfo<'info>,
        #[account(mut, close=backend_user, seeds = [lottery.authority.key().as_ref(), lottery.name.as_ref()], bump = lottery.bump)]
        pub lottery: Account<'info, Lottery>,
    }
    pub fn close(ctx: Context<Close>) -> ProgramResult {
        msg!("will close account");

        Ok(())
    }

    /* pub fn test_vrf<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, TestVrf<'a>>,
    ) -> ProgramResult {
        /*  let mut lottery = ctx.accounts.lottery.load_mut()?;

        if ctx.accounts.user.key() != lottery.authority {
            return Err(ErrorCode::InvalidPayTokenAccount.into());
        } */

        /* msg!("lottery {:?}", lottery.name); */

        /*   let mut account_info_data = to_account.try_borrow_mut_data()?;
        let buff: &mut [u8] = &mut account_info_data;
        let mut cursor = std::io::Cursor::new(buff);
        my_decoded_account.try_serialize(&mut cursor)?; */

        let vrf_account_info = &ctx.accounts.vrf_account_info;

        let vrf_account = VrfAccount::new(vrf_account_info);

        Ok(())
    } */
}

#[derive(Accounts)]
#[instruction(lottery_bump: u8, name: String)]
pub struct InitLottery<'info> {
    pub user: Signer<'info>,
    #[account(init_if_needed, space = 5000, payer = user, seeds = [user.key().as_ref(), name.as_ref()], bump = lottery_bump)]
    pub lottery: Account<'info, Lottery>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddPrices<'info> {
    pub user: Signer<'info>,
    #[account(mut, seeds = [user.key().as_ref(), lottery.name.as_ref()], bump = lottery.bump)]
    pub lottery: Account<'info, Lottery>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(user_lottery_bump: u8)]
pub struct BuyTicket<'info> {
    #[account(signer, mut)]
    pub user: AccountInfo<'info>,
    #[account(mut, seeds = [lottery.authority.key().as_ref(), lottery.name.as_ref()], bump = lottery.bump)]
    pub lottery: Account<'info, Lottery>,
    #[account(init_if_needed, space=500, payer = user, seeds = [lottery.key().as_ref(),user.key().as_ref()], bump = user_lottery_bump)]
    pub lottery_user: Account<'info, LotteryUser>,
    #[account(mut, constraint = funds_user.key() == lottery.authority.key())]
    pub funds_user: AccountInfo<'info>,
    #[account(mut, constraint = user_token_account.owner.key() == user.key())]
    pub user_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = funds_token_account.owner.key() == lottery.funds_user)]
    pub funds_token_account: Box<Account<'info, TokenAccount>>,
    pub token_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct TestVrf<'info> {
    pub user: Signer<'info>,
    pub vrf_account_info: AccountInfo<'info>,
    /* #[account(zero)]
    pub lottery: AccountLoader<'info, Lottery>, */
}

#[derive(Accounts)]
pub struct Raffle<'info> {
    pub user: Signer<'info>,
    #[account(mut, constraint = user.key() == lottery.authority.key())]
    pub lottery: Account<'info, Lottery>,
    #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    pub user: Signer<'info>,
    #[account(signer, constraint = backend_user.key() == BACKEND_USER)]
    pub backend_user: AccountInfo<'info>,
    #[account(mut, seeds = [lottery.authority.key().as_ref(), lottery.name.as_ref()], bump = lottery.bump)]
    pub lottery: Account<'info, Lottery>,
    #[account(mut, seeds = [lottery.key().as_ref(),user.key().as_ref()], bump = lottery_user.bump)]
    pub lottery_user: Account<'info, LotteryUser>,
    #[account(mut, constraint = user_token_account.mint.key() == mint.key(), constraint = user_token_account.owner.key() == user.key())]
    pub user_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint = user_token_account.mint.key() == mint.key(), constraint = prices_token_account.owner.key() == price_wallet_signer.key())]
    pub prices_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut, signer)]
    pub price_wallet_signer: AccountInfo<'info>,
    #[account(mut)]
    pub mint: Box<Account<'info, Mint>>,

    pub token_program: AccountInfo<'info>,
}

#[account]
#[derive(Default)]
pub struct PricesVault {
    lottery: Pubkey,
    bump: u8,
}

#[account]
#[derive(Default)]
pub struct Lottery {
    bump: u8,
    authority: Pubkey,
    ticket_count: u32,
    funds_user: Pubkey,
    funds_token_account: Pubkey,
    name: String,
    starts: i64,
    ends: i64,
    ticket_price: u64,
    pay_tokens: Vec<Pubkey>,
    winning_tickets: Vec<u32>,
    winners: Vec<Pubkey>,
    prices: Vec<Price>,
    total_price_sol: u64,
}

// 32 + 4 + 4 + 1 = 
#[derive(Default, AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug)]
pub struct Price {
    mint: Pubkey,
    amount: u32,
    winning_ticket: u32,
    price_sent: bool,
}

// 32 + 32 + 4 + 4 * 20 + 30 = 170, for safety 300
#[account]
#[derive(Default)]
pub struct LotteryUser {
    pub bump: u8,
    pub authority: Pubkey,
    pub lottery: Pubkey,
    pub counter: u32,
    pub tickets: Vec<u32>,
    pub name: String,
}

#[error]
pub enum ErrorCode {
    #[msg("The given pay token account is wrong.")]
    InvalidPayTokenAccount,
    #[msg("You cant buy any tickets for this lottery anymore.")]
    LotteryPayWindowOver,
    #[msg("You passed the wrong mint.")]
    WrongMint,
    #[msg("Price already claimed.")]
    PriceAlreadyClaimed,
    #[msg("You don't own this ticket.")]
    WrongTicket,
    #[msg("You can buy a maximum of 100 tickets")]
    MaximumTicketCount,
}
