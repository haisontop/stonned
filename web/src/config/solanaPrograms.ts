import { Program, Provider } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import {
  breedingIdl,
  connection,
  evolutionIdl,
  stakingIdl,
  stakingProgramId,
} from './config'

export const provider = new Provider(connection, {} as any, {
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
