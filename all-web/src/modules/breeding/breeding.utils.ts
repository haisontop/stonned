import * as web3 from '@solana/web3.js'
import { Keypair } from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import { getBreedingConfigPda } from './breeding.service'
import { Program, Provider } from '@project-serum/anchor'
import { breedingIdl, breedingProgramId, connection } from '../../config/config'

const provider = new Provider(connection, {} as any, {
  commitment: 'confirmed',
})
const program = new Program(breedingIdl, breedingProgramId, provider)

export async function createRevealInstruction({
  breedingAccount,
  ape1TokenAccount,
  user,
  ape1,
  ape2,
  ape2TokenAccount,
  adminUser,
}: {
  ape1: web3.PublicKey
  ape2: web3.PublicKey
  breedingAccount: web3.PublicKey
  ape1TokenAccount: web3.PublicKey
  ape2TokenAccount: web3.PublicKey
  user: web3.PublicKey
  rentAccountPubkey?: web3.PublicKey
  adminUser: web3.PublicKey
}) {
  const [vault1, vault1Bump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from('vault'), ape1.toBuffer()],
    program.programId
  )

  const [vault2, vault2Bump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from('vault'), ape2.toBuffer()],
    program.programId
  )

  let [configAddress, configBump] = await getBreedingConfigPda()
  console.log('configAddress', configAddress.toBase58())

  return program.instruction.reveal(vault1Bump, vault2Bump, {
    accounts: {
      configAccount: configAddress,
      breedingAccount: breedingAccount,
      user: user,
      ape1UserAccount: ape1TokenAccount,
      ape1Vault: vault1,
      ape2UserAccount: ape2TokenAccount,
      ape2Vault: vault2,
      backendUser: adminUser,
      tokenProgram: spl.TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [],
  })
}
