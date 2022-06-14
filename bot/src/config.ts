import { PrismaClient } from '@prisma/client'
import { Program, Provider } from '@project-serum/anchor'
import { Cluster, Connection, Keypair, PublicKey } from '@solana/web3.js'
import { SacStaking } from '../../staking/target/types/sac_staking'
export const stakingIdl =
  require('../../staking/target/idl/sac_staking.json') as SacStaking & {
    metadata: { address: string }
  }

import { Evolution } from '../../evolution/target/types/evolution'
export const evolutionIdl =
  require('../../evolution/target/idl/evolution.json') as Evolution & {
    metadata: { address: string }
  }

import { Breeding } from '../../breeding/target/types/breeding'
export const breedingIdl =
  require('../../breeding/target/idl/breeding.json') as Breeding & {
    metadata: { address: string }
  }

import { Awakening } from '../../awakening/target/types/awakening'
export const awakeningIdl =
  require('../../awakening/target/idl/awakening.json') as Awakening & {
    metadata: { address: string }
  }

// pm_revise: should this be kept in git repo?
const configPerEnv = {
  dev: {
    webHost: 'http://localhost:3000',
    airdropWebhost: 'http://localhost:3000/airdrop',
    network: 'devnet' as Cluster,
    mintAddress: '4evENxfLeUDk24nrqzMp4gkR3kPxCMeQuCeftjgd66BD',
    rpc: 'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/',
  },
  production: {
    webHost: 'https://stonedapecrew.com',
    airdropWebhost: 'https://www.stonedapecrew.com/airdrop',
    network: 'mainnet-beta' as Cluster,
    mintAddress: '4evENxfLeUDk24nrqzMp4gkR3kPxCMeQuCeftjgd66BD',
    rpc: 'https://late-falling-firefly.solana-mainnet.quiknode.pro/812b7e0ab8d2b7589b67bf72b7f1295563c2ce97/',
  },
}

const config = (configPerEnv as any)[
  (process.env.ENV as string) ?? 'dev'
] as typeof configPerEnv['production']

export const connection = new Connection(config.rpc, 'confirmed')
export const prismaClient = new PrismaClient()

const privateKey = process.env.WALLET as string

export const wallet = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(privateKey))
)
console.log('wallet used by bot', wallet.publicKey.toBase58())
console.log('solana rpc', config.rpc)

export const stakingProgramId = new PublicKey(stakingIdl.metadata.address)

export const provider = new Provider(connection, wallet as any, {
  commitment: 'confirmed',
})
export const stakingProgram = new Program(
  stakingIdl,
  stakingProgramId,
  provider
)

export const evolutionProgramId = new PublicKey(evolutionIdl.metadata.address)

export const evolutionProgram = new Program(
  evolutionIdl,
  evolutionProgramId,
  provider
)

export const breedingProgramId = new PublicKey(breedingIdl.metadata.address)

export const breedingProgram = new Program(
  breedingIdl,
  breedingProgramId,
  provider
)

export const awakeningProgramId = new PublicKey(awakeningIdl.metadata.address)

export const awakeningProgram = new Program(
  awakeningIdl,
  awakeningProgramId,
  provider
)

/* console.log('env', process.env.ENV)
console.log('config', config) */

export default config
