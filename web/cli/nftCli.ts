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
import { pub, getMetadata } from '../src/utils/solUtils'
import fs from 'fs'
import axios from 'axios'
import Reattempt from 'reattempt'
import { awakeningProgram } from '../src/modules/awakening/awakeningConfig'
import prisma from '../src/lib/prisma'
import asyncBatch from 'async-batch'
import { Metadata } from '@metaplex/js'
import { nukedCollection } from '../src/config/collectonsConfig'
const mintList = require(`./all1342Remaining.json`) as string[]

const nextJsonsFilename = 'next219'

// const nextJsons = require(`./${nextJsonsFilename}.json`)

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

console.log('connection', (connection as any)._rpcEndpoint)

const assetsFolderName = 'assets'

export const breedingProgramId = new PublicKey(breedingIdl.metadata.address)

const program = new Command()
program.version('0.0.1')

const user = loadWalletKey(`${process.env.HOME}/config/solana/puff.json`)

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

/* program
  .command('getIdxForMint')
  .action(async (bs58Str: string, options, cmd) => {
    console.log('loading metadata')
    const updated: any[] = []

    console.log({ nextJsons })

    for (const nft of nextJsons) {
      console.log({ nft })

      const pub = new PublicKey(nft)
      console.log(pub.toBase58())

      const metadata = await getMetadata(pub)
      const idx = Number(metadata.data.data.name.split('#')[1]) - 1

      updated.push({ idx, nft, name: metadata.data.data.name })
    }

    fs.writeFileSync(`./${nextJsonsFilename}.json`, JSON.stringify(updated))
  })

program
  .command('checkIdxInFile')
  .action(async (bs58Str: string, options, cmd) => {
    console.log('loading metadata')
    const updated: any[] = []

    console.log({ nextJsons })

    for (const nft of nextJsons) {
      console.log({ nft })

      const pub = new PublicKey(nft)
      console.log(pub.toBase58())

      const metadata = await getMetadata(pub)
      const idx = Number(metadata.data.data.name.split('#')[1]) - 1

      updated.push({ idx, nft, name: metadata.data.data.name })
    }

    fs.writeFileSync(`./${nextJsonsFilename}.json`, JSON.stringify(updated))
  }) */

program.command('tryAPI').action(async (bs58Str: string, options, cmd) => {
  const body = {
    image_url:
      'https://arweave.net/UHIrWF9YQf4o2OqQEsYgxxmrxFlSnPHitk0omXW80ng?ext=mp4',
    token_name: 'Nuked Ape #3',
    awekening_members: 124,
  }

  const res = await axios.post(
    'https://sa-awakening-api.herokuapp.com/submit',
    body,
    {
      headers: {
        'x-api-key': 'eiWee8ep9due4deeshoa8Peichai8Eih',
      },
    }
  )

  console.log(res)
  console.log(res.data)
  console.log(res.status)
})

program.command('postAwakenings').action(async () => {
  /* await Reattempt.run({ times: 10000, delay: 1000 }, async () => {
    await asyncBatch(
      mintList,
      async (mint, i) => {
        console.log(`${i}: started`)

        if (
          await prisma.awakeningBotModel.findFirst({
            where: {
              nft: mint,
            },
          })
        )
          return

        const metadata = await Metadata.load(
          connection,
          await Metadata.getPDA(new PublicKey(mint))
        )

        const id = metadata.data.data.name.split('#')
          ? Number(metadata.data.data.name.split('#')[1]) - 1
          : undefined

        if (!id || isNaN(id)) return

        await prisma.awakeningBotModel.update({
          where: {
            id_creator: {
              id,
              creator: nukedCollection.creator,
            },
          },
          data: {
            nft: mint,
            nftName: metadata.data.data.name,
          },
        })
      },
      8
    )
  }) */

  const postAwakened = async () => {
    try {
      const awakeningCount = await prisma.awakeningBotModel.count({
        where: {
          hasBeenPosted: true,
        },
      })
      console.log(`Awakening count at ${awakeningCount}`)

      const findFirstPostableNFT = async () => {
        for (const mint of mintList) {
          const elem = await prisma.awakeningBotModel.findFirst({
            where: {
              nft: mint,
            },
          })
          if (elem && !elem?.hasBeenPosted) {
            return elem
          }
        }
      }
      const firstInList = await findFirstPostableNFT()
      if (!firstInList) {
        console.log(
          `No postable mint has been found, awakening count at ${awakeningCount}, retrying in 15 seconds...`
        )
        return
      }

      const result = await Reattempt.run(
        { times: 3, delay: 2000 },
        async () => {
          console.log(
            `${firstInList.nftName} will be posted with link=${firstInList.newMP4Link}`
          )
          const body = {
            image_url: firstInList.newMP4Link + '?ext=mp4',
            token_name: firstInList.nftName,
            awekening_members: awakeningCount + 1,
          }

          const res = await axios.post(
            'https://sa-awakening-api.herokuapp.com/submit',
            body,
            {
              headers: {
                'x-api-key': 'eiWee8ep9due4deeshoa8Peichai8Eih',
              },
            }
          )

          return res
        }
      )

      console.log(
        `${firstInList.nftName} has been posted with link=${firstInList.newMP4Link}`
      )

      if (result.status === 200) {
        const awakeningBot = await prisma.awakeningBotModel.update({
          where: {
            id_creator: {
              id: firstInList.id,
              creator: firstInList.creator,
            },
          },
          data: {
            hasBeenPosted: true,
          },
        })
        console.log(
          `${firstInList.nftName} has been updated with link=${firstInList.newMP4Link}, hasBeenPosted=${awakeningBot.hasBeenPosted}`
        )
      } else {
        console.log('No 200 response.')
      }
    } catch (err) {
      console.log('Error has been thrown', err)
    }
  }

  await postAwakened();

  setInterval(async () => {
    for (let i = 0; i < 2; i++) {
      await postAwakened();
    }
  }, 5 * 60 * 1000)
})

program.command('generateRemainingIdList').action(async () => {
  const all1342 = require('../all1342Updated.json')
  const idList = []
  for (const item of all1342) {
    idList.push(item.idx)
  }
  fs.writeFileSync('./1342IdList.json', JSON.stringify(idList));
})

program
  .command('allAwakeningAccounts')
  .action(async (bs58Str: string, options, cmd) => {
    const allAwakeningAccounts = await awakeningProgram.account.awakening.all()
    console.log(allAwakeningAccounts.length)
  })

program.parse(process.argv)
