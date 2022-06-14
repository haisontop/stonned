import { Program, Provider } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { Lottery } from '../../../../lottery/target/types/lottery'
import { connection } from '../../config/config'

const provider = new Provider(connection, {} as any, {})

export const lotteryIdl =
  require('../../../../lottery/target/idl/lottery.json') as Lottery & {
    metadata: { address: string }
  }
export const lotteryProgramId = new PublicKey(lotteryIdl.metadata.address)

export const lotteryProgram = new Program(
  lotteryIdl,
  lotteryProgramId,
  provider
)

export const activeRaffleName = 'Lucky Dip #2'
