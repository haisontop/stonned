import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js'
import {
  createAssociatedTokenAccountInstruction,
  getAtaForMint,
  getCandyMachineCreator,
  getMasterEdition,
  getMetadata,
  getTokenWallet,
  loadCandyProgramV2,
  loadWalletKey,
} from './candyMachineHelpers'
import * as anchor from '@project-serum/anchor'
import { MintLayout, Token } from '@solana/spl-token'
import {
  TOKEN_METADATA_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from './candyMachineConstants'
import config from '../config/config'

export async function mintV2({
  adminKeypair,
  candyMachineAddress,
  user,
  rpcUrl,
  payer,
  candyMachineLoaded,
}: {
  adminKeypair: Keypair
  candyMachineAddress: PublicKey
  user: PublicKey
  rpcUrl?: string
  payer?: PublicKey
  candyMachineLoaded?: any
}) {
  const mint = Keypair.generate()

  const anchorProgram = await loadCandyProgramV2(
    adminKeypair,
    config.solanaEnv,
    rpcUrl
  )
  const userTokenAccountAddress = await getTokenWallet(user, mint.publicKey)

  const candyMachine: any = candyMachineLoaded
    ? candyMachineLoaded
    : await anchorProgram.account.candyMachine.fetch(candyMachineAddress)

  const remainingAccounts: any = []
  const signers = [mint]
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

  if (candyMachine.data.whitelistMintSettings) {
    const mint = new anchor.web3.PublicKey(
      candyMachine.data.whitelistMintSettings.mint
    )

    const whitelistToken = (
      await getAtaForMint(mint, adminKeypair.publicKey)
    )[0]
    remainingAccounts.push({
      pubkey: whitelistToken,
      isWritable: true,
      isSigner: false,
    })

    /* if (candyMachine.data.whitelistMintSettings.mode.burnEveryTime) {
      const whitelistBurnAuthority = anchor.web3.Keypair.generate()

      remainingAccounts.push({
        pubkey: mint,
        isWritable: true,
        isSigner: false,
      })
      remainingAccounts.push({
        pubkey: whitelistBurnAuthority.publicKey,
        isWritable: false,
        isSigner: true,
      })
      signers.push(whitelistBurnAuthority)
      const exists = await anchorProgram.provider.connection.getAccountInfo(
        whitelistToken
      )
      if (exists) {
        instructions.push(
          Token.createApproveInstruction(
            TOKEN_PROGRAM_ID,
            whitelistToken,
            whitelistBurnAuthority.publicKey,
            adminKeypair.publicKey,
            [],
            1
          )
        )
        cleanupInstructions.push(
          Token.createRevokeInstruction(
            TOKEN_PROGRAM_ID,
            whitelistToken,
            adminKeypair.publicKey,
            []
          )
        )
      }
    } */
  }

  if (payer) {
    instructions.push(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: adminKeypair.publicKey,
        lamports: 0.0119712 * LAMPORTS_PER_SOL,
      })
    )
  }

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
      signers: [...signers, adminKeypair],
    })
  )

  return { instructions, signers }
}

export async function fetchCandyMachine(pubkey: PublicKey) {
  const anchorProgram = await loadCandyProgramV2(
    {} as any,
    config.solanaEnv,
    config.rpcHost
  )

  const candyMachine = (await anchorProgram.account.candyMachine.fetch(
    pubkey
  )) as Record<string, any> & {
    data: {
      creators: { address: PublicKey; share: number; verified: boolean }[]
    }
  }
  return candyMachine
}
