import { breedingProgramId } from '../../config/config'
import * as web3 from '@solana/web3.js'

export async function getBreedingConfigPda() {
  console.log('breedingProgramId', breedingProgramId.toBase58())

  return await web3.PublicKey.findProgramAddress(
    [Buffer.from('sac')],
    breedingProgramId
  )
}
