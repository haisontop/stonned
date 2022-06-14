import { PrismaClient } from '.prisma/client'
import {
  MAX_CREATOR_LEN,
  MAX_NAME_LENGTH,
  MAX_SYMBOL_LENGTH,
  MAX_URI_LENGTH,
  Metadata,
  MetadataProgram,
} from '@metaplex/js'
/* import { TREASURY_ADDRESS } from './src/config' */
import * as anchor from '@project-serum/anchor'
import { Program, web3 } from '@project-serum/anchor'
import * as splToken from '@solana/spl-token'
import { Keypair, PublicKey } from '@solana/web3.js'
import asyncBatch from 'async-batch'
import axios, { AxiosError } from 'axios'
import { Command } from 'commander'
import fs from 'fs'
import _ from 'lodash'
import weighted from 'weighted'
import config, {
  connection,
  ENV,
  evolutionIdl,
  evolutionProgramId,
  stakingIdl,
  stakingProgramId,
} from '../src/config/config'
import {
  updateMetadata,
} from '../src/pages/api/evolution/startEvolution'
import { getAssociatedTokenAddress } from '../src/utils/solUtils'
import {getMetadataForMint} from "../src/utils/splUtils";
require('dotenv').config()

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

const assetsFolderName = 'assets'

const program = new Command()
program.version('0.0.1')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

const botToken = process.env.BOT_TOKEN as string

const wallet = loadWalletKey(
  `${process.env.HOME}/.config/solana/sac-treasury.json`
)

export function loadWalletKey(keypair: string): Keypair {
  if (!keypair || keypair == '') {
    throw new Error('Keypair is required!')
  }
  const loaded = Keypair.fromSecretKey(
    new Uint8Array(
      /* JSON.parse(fs.readFileSync(keypair).toString()) */ require(keypair)
    )
  )
  console.log(`wallet public key: ${loaded.publicKey}`)
  return loaded
}

program.command('updateEvolutionAccounts').action(async (e) => {
  console.log(config.rpcHost);

  const realWallet = new anchor.Wallet(wallet)
  console.log('realWallet', realWallet.signTransaction);

  const provider = new anchor.Provider(connection, realWallet, {
    commitment: 'recent',
  })
  const program = new Program(evolutionIdl, evolutionProgramId, provider)

  const evolutionAccounts = await program.account.evolutionAccount.all()
  const updateProgress: any[] = []

  console.log('evolutionsAccounts', evolutionAccounts.length)

  evolutionAccounts.sort((a: any, b: any) => {
    return (
      a.account.startEvolution.toNumber() - b.account.startEvolution.toNumber()
    )
  })

  const writeStream = fs.createWriteStream(
    `./evolutionProgressStream.json`,
    'utf-8'
  )
  writeStream.write('[')
  const newRoles: any = {};

  for (const evolutionAccount of evolutionAccounts) {
    let newRole = ''
      console.log(
        'updating',
        evolutionAccount.account.token.toString(),
        'isDMT',
        evolutionAccount.account.isDmt
      )

      console.log('wallet', wallet.publicKey.toBase58());

      try {
        const nftMint = evolutionAccount.account.token.toString()

        const updateMetadataRes = await updateMetadata(
          wallet,
          provider.connection,
          nftMint,
          evolutionAccount.account.isDmt as boolean,
          ENV === 'dev' ? 'devnet' : 'mainnet-beta'
        )
        console.log('updateMetadataRes', updateMetadataRes)



        if (typeof updateMetadataRes === 'boolean' || !updateMetadataRes) {
          console.log('no new role')
        } else {
          const updatedMetadata: any = updateMetadataRes
          newRole = updatedMetadata.newRole

          let [userEvolutionAddress, userEvolutionAccountAddressBump] =
            await web3.PublicKey.findProgramAddress(
              [
                evolutionAccount.account.token.toBuffer(),
                evolutionAccount.account.authority.toBuffer(),
              ],
              program.programId
            ) // ?

          const updateEvolutionRes = await program.rpc.updateEvolution(
            userEvolutionAccountAddressBump as any,
            updatedMetadata.identifier,
            updatedMetadata.newRole as any,
            {
              accounts: {
                user: wallet.publicKey,
                evolutionAccount: userEvolutionAddress,
                backendUser: wallet.publicKey,
                nftMint: new PublicKey(nftMint),
                systemProgram: web3.SystemProgram.programId,
              },
            }
          )
          console.log('updateEvolution tx', updateEvolutionRes)
          await connection.confirmTransaction(updateEvolutionRes, 'recent')
        }

        const nextProgress = {
          success: true,
          evolutionAccount: evolutionAccount.account,
          newRole,
        }
        writeStream.write(`${JSON.stringify(nextProgress, null, 3)},`)
        updateProgress.push(nextProgress)
      } catch (e: any) {
        const nextProgress = {
          success: false,
          evolutionAccount: evolutionAccount.account,
        }
        writeStream.write(`${JSON.stringify(nextProgress, null, 3)},`)
        updateProgress.push(nextProgress)
        console.error('error in updateMetadata', e)
      } finally {
        fs.writeFileSync(
          './evolutionProgress.json',
          JSON.stringify(updateProgress)
        )
      }
  }

  await asyncBatch(
    evolutionAccounts,
    async (evolutionAccount, index, workerIndex) => {

    },
    3
  )

  console.log(newRoles);


  fs.writeFileSync('./evolutionProgress.json', JSON.stringify(updateProgress))
  writeStream.write(']')
  writeStream.close()
})

program.parse(process.argv)
