import { PublicKey } from '@solana/web3.js'
import { getRoleOfNft, Role } from '../utils/solUtils'
import { connection } from './config'

export const collections = [
  {
    name: 'Best Buds',
    mints: require('../assets/mints/bestbuds-mints.json') as string[],
    mintsFilename: 'bestbuds-mints',
    getReward: async (nft: PublicKey, user: PublicKey) => {
      return 8
    },
    creators: ['8vqBa53noFwhPUxzfJetAneWpxZEnQUbrNdBwnQB55dX'],
  },
  {
    name: 'Mary Jane',
    getReward: async (nft: PublicKey, user: PublicKey) => {
      return 8
    },
    creators: [
      'Gh5S5bZkqmbEHxLvv2PW3rtfHa95WGUwLdvYG2VVPFGN',
      '3rLdEiN83agggYbDcMwn2vnveRu89U1Gks9rqfCna4ZG',
      'A1pjQhCeLzWB9fQwogMJMbNx2niWbF8w9DucLUmxD3C5',
    ],
  },
  /* {
    name: 'Stoned Apes',
    mints: require('../assets/mints/sac-mints.json') as string[],
    mintsFilename: 'sac-mints',
    getReward: async (nft: PublicKey, user: PublicKey) => {
      const role = await getRoleOfNft(nft, user, connection)

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
  }, */
]

