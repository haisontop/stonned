import { PublicKey } from "@solana/web3.js";

export interface ParsedTokenAccount {
  account: Account
  pubkey: PublicKey
}

export interface Account {
  data: Data
  executable: boolean
  lamports: number
  owner: PublicKey
  rentEpoch: number
}

export interface Data {
  parsed: Parsed
  program: string
  space: number
}

export interface Parsed {
  info: Info
  type: string
}

export interface Info {
  isNative: boolean
  mint: string
  owner: string
  state: string
  tokenAmount: TokenAmount
}

export interface TokenAmount {
  amount: string
  decimals: number
  uiAmount: number
  uiAmountString: string
}


