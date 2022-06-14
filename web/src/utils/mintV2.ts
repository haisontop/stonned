import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import {
  createAssociatedTokenAccountInstruction,
  getCandyMachineCreator,
  getMasterEdition,
  getMetadata,
  getAssociatedTokenAddress,
  loadCandyProgramV2,
} from './candyMachineIntern/candyMachineHelpers'
import * as anchor from '@project-serum/anchor'
import { MintLayout, Token } from '@solana/spl-token'
import {
  TOKEN_METADATA_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from './candyMachineIntern/candyMachineConstants'

export async function mintV2(
  adminKeypair: Keypair,
  env: string,
  candyMachineAddress: PublicKey,
  user: PublicKey,
  rpcUrl?: string
) {
  const mint = Keypair.generate()


  const anchorProgram = await loadCandyProgramV2(adminKeypair, env, rpcUrl)
  const userTokenAccountAddress = await getAssociatedTokenAddress(user, mint.publicKey)

  const candyMachine: any = await anchorProgram.account.candyMachine.fetch(
    candyMachineAddress
  )

  const remainingAccounts: any = []
  const signers = [mint, adminKeypair]
  const cleanupInstructions = []
  const instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: adminKeypair.publicKey,
      newAccountPubkey: mint.publicKey,
      space: MintLayout.span,
      lamports:
        await anchorProgram.provider.connection.getMinimumBalanceForRentExemption(
          MintLayout.span
        ),
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      0,
      adminKeypair.publicKey,
      adminKeypair.publicKey
    ),
    createAssociatedTokenAccountInstruction(
      userTokenAccountAddress,
      adminKeypair.publicKey,
      user,
      mint.publicKey
    ),
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      userTokenAccountAddress,
      adminKeypair.publicKey,
      [],
      1
    ),
  ]

  let tokenAccount
  /* if (candyMachine.tokenMint) {
    const transferAuthority = anchor.web3.Keypair.generate()

    tokenAccount = await getTokenWallet(
      adminKeypair.publicKey,
      candyMachine.tokenMint
    )

    remainingAccounts.push({
      pubkey: tokenAccount,
      isWritable: true,
      isSigner: false,
    })
    remainingAccounts.push({
      pubkey: transferAuthority.publicKey,
      isWritable: false,
      isSigner: true,
    })

    instructions.push(
      Token.createApproveInstruction(
        TOKEN_PROGRAM_ID,
        tokenAccount,
        transferAuthority.publicKey,
        adminKeypair.publicKey,
        [],
        candyMachine.data.price.toNumber()
      )
    )
    signers.push(transferAuthority)
    cleanupInstructions.push(
      Token.createRevokeInstruction(
        TOKEN_PROGRAM_ID,
        tokenAccount,
        adminKeypair.publicKey,
        []
      )
    )
  } */
  const metadataAddress = await getMetadata(mint.publicKey)
  const masterEdition = await getMasterEdition(mint.publicKey)

  const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(
    candyMachineAddress
  )

 /*  console.log('candyMachine.wallet', candyMachine.wallet.toBase58()) */

  instructions.push(
    await anchorProgram.instruction.mintNft(creatorBump, {
      accounts: {
        candyMachine: candyMachineAddress,
        candyMachineCreator,
        payer: adminKeypair.publicKey,
        //@ts-ignore
        wallet: candyMachine.wallet,
        mint: mint.publicKey,
        metadata: metadataAddress,
        masterEdition,
        mintAuthority: adminKeypair.publicKey,
        updateAuthority: adminKeypair.publicKey,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        recentBlockhashes: anchor.web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      remainingAccounts:
        remainingAccounts.length > 0 ? remainingAccounts : undefined,
      signers,
    })
  )

  console.log('instructions length', instructions.length)

  return { instructions, signers }
}
