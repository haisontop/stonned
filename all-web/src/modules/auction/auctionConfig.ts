import { Program, Provider } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { Auctions } from '../../../../auctions/target/types/auctions'
import { connection } from '../../config/config'

const provider = new Provider(connection, {} as any, {})

export const auctionIdl =
  require('../../../../auctions/target/idl/auctions.json') as Auctions & {
    metadata: { address: string }
  }
export const auctionProgramId = new PublicKey(auctionIdl.metadata.address)

export const auctionProgram = new Program(
  auctionIdl,
  auctionProgramId,
  provider
)
