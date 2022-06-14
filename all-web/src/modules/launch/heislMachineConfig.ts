import { Program, Provider } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { HeislMachine } from '../../../../heisl-machine/target/types/heisl_machine'
import config, { connection } from '../../config/config'

const provider = new Provider(connection, {} as any, {})

export const idl =
  require('../../../../heisl-machine/target/idl/heisl_machine.json') as HeislMachine & {
    metadata: { address: string }
  }
export const heislMachineProgramId = new PublicKey(idl.metadata.address)

export const heislMachineProgram = new Program(
  idl,
  heislMachineProgramId,
  provider
)

export const heislMachineProgramRecent = new Program(
  idl,
  heislMachineProgramId,
  new Provider(new Connection(config.rpcHost, 'recent'), {} as any, {})
)

