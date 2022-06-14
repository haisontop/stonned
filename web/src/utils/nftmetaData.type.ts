import { PublicKey } from '@solana/web3.js'

export interface NftMetadata {
  pubkey: PublicKey
  info: Info
  data: NftMetadataData
  name: string
  symbol: string
  image: string
  properties: Properties
  description: string
  seller_fee_basis_points: number
  attributes: Attribute[]
  collection: Collection
}

export interface Attribute {
  trait_type: string
  value: string
}

export interface Collection {
  name: string
  family: string
}

export interface NftMetadataData {
  key: number
  updateAuthority: string
  mint: string
  data: DataData
  primarySaleHappened: number
  isMutable: number
}

export interface DataData {
  name: string
  symbol: string
  uri: string
  sellerFeeBasisPoints: number
  creators: DataCreator[]
}

export interface DataCreator {
  address: string
  verified: number
  share: number
}

export interface Info {
  data: InfoData
  executable: boolean
  lamports: number
  owner: PublicKey
  rentEpoch: number
}

export interface InfoData {
  type: string
  data: number[]
}

export interface Properties {
  files: File[]
  category: string
  creators: PropertiesCreator[]
}

export interface PropertiesCreator {
  address: string
  share: number
}

export interface File {
  uri: string
  type: string
}
