import { PublicKey } from '@solana/web3.js'
import { differenceInDays, fromUnixTime } from 'date-fns'
import { NftMetadata } from '../utils/nftmetaData.type'
import {
  EAwakenedType,
  getNukedRoleOfMetadata,
  getRoleOfMetadata,
  getRoleOfNft,
  getRoleOfNuked,
  NukedRole,
  Role,
} from '../utils/solUtils'
import config, { connection } from './config'

export const magicJCollection = {
  name: 'Stoned Ape Magic Js',
  creator: 'BtehquZELQ6tD3dunZpKJZpNDx4fxVB9DfNDQ7P6GL5G',
}

export const getStonedAwakeningCost = (role: Role) => {
  const puffCost = {
    [Role.Chimpion]: 1690,
    [Role.FourRoles]: 3333,
    [Role.Sealz]: 14200,
    [Role.OneOutOfOne]: 16900,
  }
  const allCost = {
    [Role.Chimpion]: 4200,
    [Role.FourRoles]: 6666,
    [Role.Sealz]: 14200,
    [Role.OneOutOfOne]: 16900,
  }

  const puffNeeded = puffCost[role]
  const allNeeded = allCost[role]

  return {
    puff: puffNeeded,
    all: allNeeded,
  }
}

export const sacCollection = {
  name: 'Stoned Apes',
  symbol: 'SAC',
  mints: require('../assets/mints/sac-mints.json') as string[],
  creator: '7RCBr3ZQ8yhY4jHpFFo3Kmh7MnaCPi1bFuUgXUB9WURf',
  mintsFilename: 'sac-mints',
  getAwakeningCost: (nft: NftMetadata) => {
    const role = getRoleOfMetadata(nft)
    return getStonedAwakeningCost(role)
  },
  getAwakeningCostAsync: async (nft: PublicKey) => {
    const role = await getRoleOfNft(nft)
    return getStonedAwakeningCost(role)
  },
  getReward: async (nft: PublicKey) => {
    const role = await getRoleOfNft(nft)

    console.log('role', role)

    const rewardsPerDay = {
      [Role.Chimpion]: 15,
      [Role.FourRoles]: 30,
      [Role.Sealz]: 142,
      [Role.OneOutOfOne]: 169,
    }
    const reward = rewardsPerDay[role]
    return reward
  },
  allReward: async (nft: PublicKey) => 42,
  getRole: async (nft: PublicKey) => {
    return await getRoleOfNft(nft)
  },
}

export const getNukedAwakeningCost = (role: NukedRole) => {
  const puffCost = {
    [NukedRole.Common]: 777,
    [NukedRole.Rare]: 1222,
    [NukedRole.Epic]: 2555,
    [NukedRole.Mystic]: 4444,
    [NukedRole.Legendary]: 8888,
  }
  const allCost = {
    [NukedRole.Common]: 2777,
    [NukedRole.Rare]: 3333,
    [NukedRole.Epic]: 4200,
    [NukedRole.Mystic]: 6900,
    [NukedRole.Legendary]: 9999,
  }

  const puffNeeded = puffCost[role]
  const allNeeded = allCost[role]

  const diff = Math.abs(differenceInDays(fromUnixTime(1653587999), new Date()))

  return {
    puff: puffNeeded + diff * 3,
    all: allNeeded + diff * 10,
  }
}

export const nukedCollection = {
  name: 'Nuked Apes',
  symbol: 'NAC',
  mints: require('../assets/mints/nukedMints.json') as string[],
  creator:
    config.solanaEnv != 'devnet'
      ? /* '99UQMjABnENmcSjvWnZo5G7QpktgZ7Cf14xptCR6sN4S'?? */ '2sPBjQtpQuGx2WQg7kn8mbC1r19AQBPREkcajDDcrbxt'
      : '86a7KrjxrubTmrkcrykBMr4zR4gXUzaFhUBcMkSV3TWa',
  mintsFilename: 'nukedMints',
  getAwakeningCost: (nft: NftMetadata) => {
    const nukedRole = getNukedRoleOfMetadata(nft)
    return getNukedAwakeningCost(nukedRole)
  },
  getAwakeningCostAsync: async (nft: PublicKey) => {
    const role = await getRoleOfNuked(nft)
    console.log('role', role)
    return getNukedAwakeningCost(role.role)
  },
  getReward: async (nft: PublicKey) => {
    const role = await getRoleOfNuked(nft)

    console.log('role', role)

    const rewardsPerDay = {
      [NukedRole.Common]: {
        [EAwakenedType.DEFAULT]: 3,
        [EAwakenedType.AWAKENED]: 9,
        [EAwakenedType.SHOCKWAVE]: 15
      },
      [NukedRole.Rare]: {
        [EAwakenedType.DEFAULT]: 9,
        [EAwakenedType.AWAKENED]: 18,
        [EAwakenedType.SHOCKWAVE]: 30
      },
      [NukedRole.Epic]: {
        [EAwakenedType.DEFAULT]: 16,
        [EAwakenedType.AWAKENED]: 30,
        [EAwakenedType.SHOCKWAVE]: 60
      },
      [NukedRole.Mystic]: {
        [EAwakenedType.DEFAULT]: 36,
        [EAwakenedType.AWAKENED]: 70,
        [EAwakenedType.SHOCKWAVE]: 90
      },
      [NukedRole.Legendary]: {
        [EAwakenedType.DEFAULT]: 69,
        [EAwakenedType.AWAKENED]: 142,
        [EAwakenedType.SHOCKWAVE]: 169
      },
    }
    
    const reward = rewardsPerDay[role.role]

    return reward[role.type]
  },
  allReward: async (nft: PublicKey) => {
    const role = await getRoleOfNuked(nft)

    console.log('role', role)

    const rewardsPerDay = {
      [NukedRole.Common]: {
        [EAwakenedType.DEFAULT]: 21,
        [EAwakenedType.AWAKENED]: 42,
        [EAwakenedType.SHOCKWAVE]: 44
      },
      [NukedRole.Rare]: {
        [EAwakenedType.DEFAULT]: 21,
        [EAwakenedType.AWAKENED]: 46,
        [EAwakenedType.SHOCKWAVE]: 52
      },
      [NukedRole.Epic]: {
        [EAwakenedType.DEFAULT]: 21,
        [EAwakenedType.AWAKENED]: 55,
        [EAwakenedType.SHOCKWAVE]: 69
      },
      [NukedRole.Mystic]: {
        [EAwakenedType.DEFAULT]: 21,
        [EAwakenedType.AWAKENED]: 69,
        [EAwakenedType.SHOCKWAVE]: 95
      },
      [NukedRole.Legendary]: {
        [EAwakenedType.DEFAULT]: 21,
        [EAwakenedType.AWAKENED]: 90,
        [EAwakenedType.SHOCKWAVE]: 111
      },
    }
    const roleReward = rewardsPerDay[role.role]
    return roleReward[role.type]
  },
  getRole: async (nft: PublicKey) => {
    return await getRoleOfNuked(nft)
  },
}

export const honoraryCollection = {
  name: 'SAC Honorary',
  symbol: 'SACH',
  creator: 'FXkkYAiiVRrm2r6uXQojiebRQMEjgobCJYuvKnp7QVQ9',
  getReward: async (nft: PublicKey) => {
    return 30
  },
  getAwakeningCost: (nft: NftMetadata) => {
    return {
      puff: 100000,
      all: 500000,
    }
  },
  getAwakeningCostAsync: async (nft: PublicKey) => {
    return {
      puff: 100000,
      all: 500000,
    }
  },
  allReward: async (nft: PublicKey) => 42,
  getRole: async (nft: PublicKey) => {
    return 'Honorary'
  },
}

export const collections = [sacCollection, nukedCollection, honoraryCollection]
