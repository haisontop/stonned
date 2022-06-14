import * as spl from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import * as web3 from '@solana/web3.js';

export function solToLamports(sol: number) {
  return sol * web3.LAMPORTS_PER_SOL;
}
export async function airdrop(
  connection: web3.Connection,
  dest: web3.PublicKey,
  amount?: number) {
  return await connection.confirmTransaction(
    await connection.requestAirdrop(dest, amount ?? solToLamports(1)),
    'confirmed'
  );
}
export async function getOrCreateTestNft({
  connection, tokenOwner, decimals, mint,
}: {
  connection: web3.Connection;
  tokenOwner: web3.Keypair;
  mint?: PublicKey;
  decimals?: number;
}) {
  if (mint) {
    return new spl.Token(connection, mint, spl.TOKEN_PROGRAM_ID, tokenOwner);
  }
  const token = await spl.Token.createMint(
    connection,
    tokenOwner,
    tokenOwner.publicKey,
    tokenOwner.publicKey,
    decimals ?? 0,
    spl.TOKEN_PROGRAM_ID
  );

  return token;
}

export async function getTokenAccount(
  connection: web3.Connection,
  mint: PublicKey,
  user: PublicKey
) {
  const userTokenAccounts = await connection.getParsedTokenAccountsByOwner(
    user,
    {
      mint: mint,
    }
  );

  /*   const unparsedUserTokenAccounts = await connection.getTokenAccountsByOwner(
      user,
      {
        mint: mint,
      }
    )
  
    const parsedAccounts = unparsedUserTokenAccounts. spl.AccountLayout.decode(
      unparsedUserTokenAccounts.value[0].account.data
    )
    console.log('parsedAccounts', parsedAccounts) */
  if (userTokenAccounts.value.length === 0)
    return null;
  return (
    userTokenAccounts.value.find(
      (t) => t.account.data.parsed.info.tokenAmount.uiAmount
    ) ?? userTokenAccounts.value[0]
  );
}