require('dotenv').config()
import { PrismaClient } from '.prisma/client'
/* import { TREASURY_ADDRESS } from './src/config' */
import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { PublicKey } from '@solana/web3.js'
import { Command } from 'commander'
import _ from 'lodash'
import config, {
  allStakingIdl,
  allStakingProgramId,
  breedingIdl,
  connection,
  evolutionIdl,
  evolutionProgramId,
  stakingIdl,
  stakingProgramId,
} from '../src/config/config'
import { loadWalletKey } from '../src/utils/candyMachineIntern/candyMachineHelpers'

import type { AppRouter } from '../src/server/routers/router'
import { createTRPCClient } from '@trpc/client'
import fetch from 'node-fetch'
import superjson from 'superjson'
import { actions } from 'newMetaplex'
import { Wallet } from '@project-serum/anchor'




const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

console.log('connection', (connection as any)._rpcEndpoint)

const assetsFolderName = 'assets'

export const breedingProgramId = new PublicKey(breedingIdl.metadata.address)

const program = new Command()
program.version('0.0.1')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

const user = loadWalletKey(`${process.env.HOME}/config/solana/phantom.json`)

const provider = new anchor.Provider(connection, user as any, {
  commitment: 'confirmed',
})

const stakingProgram = new Program(stakingIdl, stakingProgramId, provider)

const allStakingProgram = new Program(
  allStakingIdl,
  allStakingProgramId,
  provider
)

const evolutionProgram = new Program(evolutionIdl, evolutionProgramId, provider)

const breedingProgram = new Program(breedingIdl, breedingProgramId, provider)

program
  .command('convertBs58ToBuffer')
  .argument('<bs58Str>')
  .action(async (bs58Str: string, options, cmd) => {
    const buffer = bs58.decode(bs58Str)

    console.log('u8 array', Uint8Array.from(buffer))
  })

program
  .command('createMerchNfts')
  .action(async (bs58Str: string, options, cmd) => {
    const wallet = new Wallet(user)
    const res = await actions.mintNFT({
      connection,
      wallet: new Wallet(user),
      uri: 'https://ipfs.io/ipfs/QmX3c4f3XV861xTp1yY1QGUGB6PwGbFph4AgJJJ7Bshzxn',
      maxSupply: 100,
    })

    await connection.confirmTransaction(res.txId, 'confirmed')
    console.log('mint', res.mint.toBase58())
    console.log('mint.edition', res.edition.toBase58())

    for (let i = 0; i < 5; i++) {
      const editionRes = await actions.mintEditionFromMaster({
        connection,
        wallet,
        masterEditionMint: res.mint,
      })
      await connection.confirmTransaction(editionRes.txId, 'confirmed')
      console.log('editionRes mint', editionRes.mint.toBase58())
      console.log('editionRes edition', editionRes.edition.toBase58())
    }
  })

program.parse(process.argv)
