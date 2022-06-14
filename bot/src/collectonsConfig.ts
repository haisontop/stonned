import { PublicKey } from '@solana/web3.js'

import { connection } from './config'

export const collections = [
  {
    name: 'Stoned Apes',
    mints: require('./assets/sacMints.json') as string[],
    creator: '7RCBr3ZQ8yhY4jHpFFo3Kmh7MnaCPi1bFuUgXUB9WURf',
    mintsFilename: 'sac-mints',
  },
  {
    name: 'Nuked Apes',
    mints: require('./assets/nukedMints.json') as string[],
    creator: '2sPBjQtpQuGx2WQg7kn8mbC1r19AQBPREkcajDDcrbxt',
    mintsFilename: 'nukedMints',
  },
]
