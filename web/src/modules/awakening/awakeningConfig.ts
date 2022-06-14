import { Program, Provider } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { Awakening } from '../../../../awakening/target/types/awakening'
import { connection } from '../../config/config'

const provider = new Provider(connection, {} as any, {})

export const awakeningIdl =
  require('../../../../awakening/target/idl/awakening.json') as Awakening & {
    metadata: { address: string }
  }
export const awakeningProgramId = new PublicKey(awakeningIdl.metadata.address)

export const awakeningProgram = new Program(
  awakeningIdl,
  awakeningProgramId,
  provider
)
