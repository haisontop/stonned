import { clusterApiUrl, PublicKey, Cluster, Connection } from '@solana/web3.js'
import { SacStaking } from '../../../staking/target/types/sac_staking'
import { Evolution } from '../../../evolution/target/types/evolution'
import { Breeding } from '../../../breeding/target/types/breeding'

console.log('DATABASE_URL', process.env.DATABASE_URL)

export const stakingIdl =
  require('../../../staking/target/idl/sac_staking.json') as SacStaking & {
    metadata: { address: string }
  }
export const stakingProgramId = new PublicKey(stakingIdl.metadata.address)

export const evolutionIdl =
  require('../../../evolution/target/idl/evolution.json') as Evolution & {
    metadata: { address: string }
  }

export const allStakingIdl =
  require('../../../all-staking/target/idl/all_staking.json') as SacStaking & {
    metadata: { address: string }
  }
export const allStakingProgramId = new PublicKey(allStakingIdl.metadata.address)

export const evolutionProgramId = new PublicKey(evolutionIdl.metadata.address)

export const breedingIdl =
  require('../../../breeding/target/idl/breeding.json') as Breeding & {
    metadata: { address: string }
  }
export const breedingProgramId = new PublicKey(breedingIdl.metadata.address)

export const puffWallet = new PublicKey(
  'PUFFgnKKhQ23vp8uSPwdzrUhEr7WpLmjM85NB1FQgpb'
)

const configPerEnv = {
  dev: {
    host: 'localhost:3000',
    solanaEnv: 'devnet',
    apiHost: 'http://localhost:4000',
    rpcHost: true
      ? 'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/'
      : clusterApiUrl('devnet'),
    puffToken: '8crBEjMoyGmUA4jsus4oNbzmS9skroExSVzhroidjaA6',
    candyMachineId: 'SgE3PvVMVEJYMyS5YxmL64gu8wKcByseAqbKhobcSfp',
    allToken: new PublicKey('8crBEjMoyGmUA4jsus4oNbzmS9skroExSVzhroidjaA6'),
    nuked: {
      chandyMachineId: new PublicKey(
        'CXHE68hwTQtVL3GxZk45JdURhaaDTiyupFUFkreCdVyU'
      ),
      address: new PublicKey('NUKE6VXDcfyb51yvFwU67hDxj2qMgRdkdtUPKy6D3hC'),
      rentalFeeDepositAccount: new PublicKey(
        '3uKJYpmtt8VnsJweVzao3eUt3bbeLGYrxud9pEFyaqMP'
      ),
      whiteListToken: new PublicKey(
        'FfCBEiZDWgHP4BT1vTXpHb8N8jbJ6cvY2nEQWy33UsUW'
      ),
      creator: new PublicKey('CjuT1NPXBhv8rTwFDWZdgvGo8U1kZGEYwiHAjM3EtdxA'),
      mints: require('../assets/mints/nukedMintsDev.json') as string[],
    },
  },
  production: {
    host: 'https://www.stonedapecrew.com',
    solanaEnv: 'mainnet-beta',
    apiHost: 'https://sac-discord-bot-5ptq.onrender.com',
    rpcHost: true
      ? 'https://late-falling-firefly.solana-mainnet.quiknode.pro/812b7e0ab8d2b7589b67bf72b7f1295563c2ce97/'
      : 'https://ssc-dao.genesysgo.net/',
    puffToken: 'G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB',
    candyMachineId: '7RCBr3ZQ8yhY4jHpFFo3Kmh7MnaCPi1bFuUgXUB9WURf',
    allToken: new PublicKey('7ScYHk4VDgSRnQngAUtQk4Eyf7fGat8P4wXq6e2dkzLj'),
    nuked: {
      chandyMachineId: new PublicKey(
        '912nWfxq9dSpjjgsx6Nda4yjSy2DSkwemHtjQc1XRFJL'
      ),
      address: new PublicKey('NUKE6VXDcfyb51yvFwU67hDxj2qMgRdkdtUPKy6D3hC'),
      rentalFeeDepositAccount: new PublicKey(
        '3uKJYpmtt8VnsJweVzao3eUt3bbeLGYrxud9pEFyaqMP'
      ),
      whiteListToken: new PublicKey(
        'D9hidBDDauvAYWY9jkNt6YfPxtcC7HgWm5sNNHAobC3A'
      ),
      creator: new PublicKey('2sPBjQtpQuGx2WQg7kn8mbC1r19AQBPREkcajDDcrbxt'),
      mints: require('../assets/mints/nukedMints.json') as string[],
    },
  },
}

export const ENV =
  (process.env.NEXT_PUBLIC_ENV as 'production' | undefined) ?? 'dev'
const config = configPerEnv[ENV]

export default config

export const nukedPublicSaleStart = new Date('2022-02-19T21:00:00+01:00')
export const isNukedWhitelistSale =
  new Date().getTime() < nukedPublicSaleStart.getTime()

export const nuked = config.nuked

export const GA_TRACKING_ID = 'G-YB0150X2D8'

export const MINT_PRICE_SOL = 0.69

export const TREASURY_ADDRESS = puffWallet

const rpcHost = config.rpcHost
export const connection = new Connection(rpcHost, {
  commitment: 'confirmed',
})

export const nukedMintWallet = new PublicKey(
  '8NYo7K3GVthjZ8HnaeCnUkVWszA9kRzu3k6h3zYwG6qu'
)

export const livingSacApesCount = 4142
export const livingNukedApesCount = 2792

export const puffToken = new PublicKey(config.puffToken)

export const puffBurnerWallet = new PublicKey(
  'DBunqiu2mrnGLLQPm5mcEwnjeTGCLjjUze35vBHpWRWs'
)

export const programPuffWallet = new PublicKey(
  'DBunqiu2mrnGLLQPm5mcEwnjeTGCLjjUze35vBHpWRWs'
)

export const backendUserPubkey = new PublicKey(
  '9XcVSR68PTMr987BjCStW13LauzQiuYUv6vKMUorPEax'
)

export const jwtKey = process.env.JWT_SECRET!

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
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
