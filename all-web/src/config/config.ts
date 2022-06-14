import * as anchor from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { AllStaking } from '../../../all-staking/target/types/all_staking'
import { Evolution } from '../../../evolution/target/types/evolution'
import { Breeding } from '../../../breeding/target/types/breeding'
export const stakingIdl =
  require('../../../all-staking/target/idl/all_staking.json') as AllStaking & {
    metadata: { address: string }
  }
export const stakingProgramId = new PublicKey(stakingIdl.metadata.address)

export const evolutionIdl =
  require('../../../evolution/target/idl/evolution.json') as Evolution & {
    metadata: { address: string }
  }

export const evolutionProgramId = new PublicKey(evolutionIdl.metadata.address)

export const breedingIdl =
  require('../../../breeding/target/idl/breeding.json') as Breeding & {
    metadata: { address: string }
  }
export const breedingProgramId = new PublicKey(breedingIdl.metadata.address)

export const puffWallet = new PublicKey(
  'PUFFgnKKhQ23vp8uSPwdzrUhEr7WpLmjM85NB1FQgpb'
)

export const configPerEnv = {
  dev: {
    solanaEnv: 'devnet',
    apiHost: 'http://localhost:4000',
    rpcHost:
      'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/' /* clusterApiUrl('devnet') */,
    puffToken: '8crBEjMoyGmUA4jsus4oNbzmS9skroExSVzhroidjaA6',
    allToken: '8crBEjMoyGmUA4jsus4oNbzmS9skroExSVzhroidjaA6',
    candyMachineId: 'SgE3PvVMVEJYMyS5YxmL64gu8wKcByseAqbKhobcSfp',
    nuked: {
      chandyMachineId: new PublicKey(
        '7iY4Y1kcKVoPovN7uie1wnp8hfmw8ETLaLgkNgUcV4KV'
      ),
      address: new PublicKey('NUKE6VXDcfyb51yvFwU67hDxj2qMgRdkdtUPKy6D3hC'),
      rentalFeeDepositAccount: new PublicKey(
        '3uKJYpmtt8VnsJweVzao3eUt3bbeLGYrxud9pEFyaqMP'
      ),
    },
  },
  production: {
    solanaEnv: 'mainnet-beta',
    apiHost: 'https://sac-discord-bot-5ptq.onrender.com',
    rpcHost:
      'https://late-falling-firefly.solana-mainnet.quiknode.pro/812b7e0ab8d2b7589b67bf72b7f1295563c2ce97/',
    puffToken: 'G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB',
    allToken: '7ScYHk4VDgSRnQngAUtQk4Eyf7fGat8P4wXq6e2dkzLj',
    candyMachineId: '7RCBr3ZQ8yhY4jHpFFo3Kmh7MnaCPi1bFuUgXUB9WURf',
    nuked: {
      chandyMachineId: new PublicKey(
        '8dTSLSq7o3JPtBUfU2fmY4gQ4EChPXQbQY9qPV5zXxKD'
      ),
      address: new PublicKey('NUKE6VXDcfyb51yvFwU67hDxj2qMgRdkdtUPKy6D3hC'),
      rentalFeeDepositAccount: new PublicKey(
        '3uKJYpmtt8VnsJweVzao3eUt3bbeLGYrxud9pEFyaqMP'
      ),
    },
  },
}

export const incubatorFundsWallet1 = new PublicKey(
  'Detd5A3Bisxn1rwgwuzCWWQv7nCAZvYk7VwqTTbdBrBy'
)

export const defaultFundsWallet = new PublicKey(
  '3VbGdrikzDEc5u4qQjwUXmzuoDrcyUfs8SfmA39aPUpY'
)

console.log('NEXT_PUBLIC_ENV', process.env.NEXT_PUBLIC_ENV)

export const ENV =
  (process.env.NEXT_PUBLIC_ENV as 'production' | undefined) ?? 'dev'

const config = configPerEnv[ENV]

export const nuked = config.nuked

export default config

export const GA_TRACKING_ID = 'G-YB0150X2D8'

export const MINT_PRICE_SOL = 0.69
export const TREASURY_ADDRESS = puffWallet

export const CANDY_MACHINE_ID = new PublicKey(config.candyMachineId)
const rpcHost = config.rpcHost

export const connection = new anchor.web3.Connection(rpcHost, {
  commitment: 'confirmed',
})

export const livingNftCount = 4269 * 2

export const publicSaleStart = new Date(
  process.env.NEXT_PUBLIC_PUBLIC_SALE_START!
)
export const allToken = new PublicKey(config.allToken)

export const puffBurnerWallet = new PublicKey(
  'DBunqiu2mrnGLLQPm5mcEwnjeTGCLjjUze35vBHpWRWs'
)

export const programPuffWallet = new PublicKey(
  'DBunqiu2mrnGLLQPm5mcEwnjeTGCLjjUze35vBHpWRWs'
)

export const backendUserPubkey = new PublicKey(
  '9XcVSR68PTMr987BjCStW13LauzQiuYUv6vKMUorPEax'
)

export const jwtSecret = process.env.JWT_SECRET!

export function getBaseUrl() {
  if ((process as any).browser) {
    return ''
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}
