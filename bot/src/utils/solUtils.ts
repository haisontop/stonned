import * as web3 from '@solana/web3.js'
import * as splToken from '@solana/spl-token'
import * as nacl from 'tweetnacl'
import { clusterApiUrl, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import * as fs from 'fs'
import { Account, programs } from '@metaplex/js'

import * as metaplex from '@metaplex/js'
import axios from 'axios'
import {
  wallet,
  connection,
  stakingProgram,
  stakingProgramId,
  evolutionProgramId,
  evolutionProgram,
  awakeningProgramId,
  awakeningProgram,
} from '../config'
import { SacStaking } from '../../../staking/target/types/sac_staking'
import { breedingProgramId, breedingProgram } from '../config'
import { apeOwnerRoleName } from '../service'
import { collections } from '../collectonsConfig'

const MetadataProgram = programs.metadata.MetadataProgram

export async function transfer(
  tokenMintAddress: string,
  wallet: web3.Signer,
  to: string,
  amount: number
): Promise<any> {
  console.log(
    'Our balance',
    (await connection.getBalance(wallet.publicKey)) / 1000000000
  )

  const mintPublicKey = new web3.PublicKey(tokenMintAddress)
  const mintToken = new splToken.Token(
    connection,
    mintPublicKey,
    splToken.TOKEN_PROGRAM_ID,
    wallet // the wallet owner will pay to transfer and to create recipients associated token account if it does not yet exist.
  )

  const destPublicKey = new web3.PublicKey(to)

  console.log(`has no token already, dropping one, mint=${tokenMintAddress}!'`)

  /* const accounts = await connection.getTokenLargestAccounts(mintPublicKey);

  const fromTokenAccount = accounts.value
    .sort((a, b) => (b.uiAmount ?? 0) - (a.uiAmount ?? 0))
    .find((v) => Number(v.amount) > 0);

  if (!fromTokenAccount) throw new Error("something went wrong"); */

  const accounts = await connection.getParsedTokenAccountsByOwner(
    wallet.publicKey,
    {
      mint: mintPublicKey,
      programId: TOKEN_PROGRAM_ID,
    }
  )

  const accountWithValue = accounts.value
    .map((v) => ({
      address: v.pubkey,
      amount: v.account.data.parsed.info.tokenAmount.uiAmount as number,
    }))
    .filter((v) => v.amount >= 1)

  const fromTokenAccount = accountWithValue[0].address

  /* const fromTokenAccountInfo = await mintToken.getOrCreateAssociatedAccountInfo(
    wallet.publicKey
  );

  const fromTokenAccount = fromTokenAccountInfo.address; */

  console.log('fromTokenAccount', fromTokenAccount.toBase58())

  // Get the derived address of the destination wallet which will hold the custom token
  const associatedDestinationTokenAddr =
    await splToken.Token.getAssociatedTokenAddress(
      mintToken.associatedProgramId,
      mintToken.programId,
      mintPublicKey,
      destPublicKey
    )

  console.log(
    'associatedDestinationTokenAddr',
    associatedDestinationTokenAddr.toBase58()
  )

  const receiverAccount = await connection.getAccountInfo(
    associatedDestinationTokenAddr
  )

  if (!receiverAccount) {
    throw new Error('Need to create an associated token account first')
  }

  console.log(`dropping ${mintPublicKey.toString()} to ${to}`)

  const instructions: web3.TransactionInstruction[] = []

  /* console.log(
    "mintToken.associatedProgramId",
    mintToken.associatedProgramId.toString()
  );
  console.log("mintToken.programId", mintToken.programId.toBase58()); */

  // if (receiverAccount === null) {
  //   instructions.push(
  //     splToken.Token.createAssociatedTokenAccountInstruction(
  //       mintToken.associatedProgramId,
  //       mintToken.programId,
  //       mintPublicKey,
  //       associatedDestinationTokenAddr,
  //       destPublicKey,
  //       wallet.publicKey,
  //     ),
  //   )
  // }

  // return transaction.serialize({ requireAllSignatures: false }).toJSON()
  const tx = await mintToken.transfer(
    fromTokenAccount,
    associatedDestinationTokenAddr,
    wallet.publicKey,
    [wallet],
    amount
  ) /* await sol.sendAndConfirmTransaction(connection, transaction, [
    wallet,
  ]); */
  console.log('tx', tx)

  return tx
}

export function verifySignature(address: string, signature: number[]) {
  const wallet = new web3.PublicKey(address)
  const message = new TextEncoder().encode('verify address')

  const res = nacl.sign.detached.verify(
    message,
    Uint8Array.from(signature),
    wallet.toBytes()
  )

  return res
}

export async function verifyRole(address: string) {
  const wallet = new web3.PublicKey(address)

  return address
}

export async function getRolesForUser(ownerAddressString: string) {
  console.time('getNFTsForOwner' + ownerAddressString)
  const ownedNfts = await getNFTsForOwner(ownerAddressString)
  const stakedNfts = await getStakedNftsForOwner(ownerAddressString)

  console.log('ownedNfts', ownedNfts)


  const awakeningNfts = await getAwakeningNftsForOwner(ownerAddressString)

  const breedingNfts = await getBreedingNftsForOwner(ownerAddressString)
  const breedingNftsOfRenters = await getBreedingNftsForRenters(
    ownerAddressString
  )
  const nftsInRescuePool = await getNftsOfRescuePool(ownerAddressString)

  const evolutionNfts = await getEvolutionNftsForOwner(ownerAddressString)
  console.timeEnd('getNFTsForOwner' + ownerAddressString)
  const nfts: any[] = [
    ...ownedNfts,
    ...stakedNfts,
    ...evolutionNfts,
    ...breedingNfts,
    ...breedingNftsOfRenters,
    ...nftsInRescuePool,
    ...awakeningNfts
  ]

  const roles = nfts
    .map(
      (n) =>
        n.attributes.find((attribute: any) => {
          return attribute?.trait_type === 'Role'
        })?.value as string
    )
    .filter((r) => !!r)
    .filter((item, pos, self) => {
      return self.indexOf(item) == pos
    })
  if (roles.length > 0) roles.push(apeOwnerRoleName)

  const nukedRole = nfts.find((nft: any) => {
    return nft.attributes.find((attribute: any) => {
      return attribute?.trait_type === 'Rarity Rank'
    })
  })

  if (nukedRole) {
    roles.push('NAC Holder')
  }

  return [...roles]
}

export async function getNFTsForOwner(ownerAddressString: string) {
  const ownerAddress = new PublicKey(ownerAddressString)
  const allTokens: any[] = []

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    ownerAddress,
    {
      programId: splToken.TOKEN_PROGRAM_ID,
    }
  )

  // due to arweave rate limit

  for (let index = 0; index < tokenAccounts.value.length; index++) {
    const tokenAccount = tokenAccounts.value[index]
    const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount

    if (tokenAmount.amount == '1' && tokenAmount.decimals == '0') {
      let [pda] = await web3.PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          MetadataProgram.PUBKEY.toBuffer(),
          new web3.PublicKey(
            tokenAccount.account.data.parsed.info.mint
          ).toBuffer(),
        ],
        MetadataProgram.PUBKEY
      )
      const accountInfo: any = await connection.getParsedAccountInfo(pda)

      try {
        const metadata: any = new programs.metadata.Metadata(
          ownerAddress.toString(),
          accountInfo.value
        )

        if (
          !metadata?.data?.data?.creators?.find((creator: any) =>
            collections.find(
              (collection) => collection.creator === creator.address
            )
          )
        )
          continue

        const dataRes = await axios.get(metadata.data.data.uri)

        if (dataRes.status === 200) {
          allTokens.push({
            ...dataRes.data,
            mint: tokenAccount.account.data.parsed.info.mint,
          })
        }
      } catch (e: any) {}
    }
  }

  return allTokens
}

export async function getStakingAccountsForOwner(ownerAddress: string) {
  const accounts = await connection.getParsedProgramAccounts(stakingProgramId, {
    filters: [
      {
        memcmp: {
          offset: 8,
          bytes: ownerAddress,
        },
      },
    ],
  })

  const parsedAccounts = await Promise.all(
    accounts.map(async (a) => {
      return stakingProgram.coder.accounts.decode(
        'StakeAccount',
        a.account.data as any
      ) as ReturnType<typeof stakingProgram.account.stakeAccount.fetch>
    })
  )
  return parsedAccounts
}

export async function getBreedingAccountsOfRenters(ownerAddress: string) {
  const accounts = (await breedingProgram.account.breedingAccount.all()).filter(
    (b: any) => b.account?.rentalUser?.toBase58() === ownerAddress
  )

  return accounts
}

export async function getRentingAccounts(ownerAddress: string) {
  const accounts = (await breedingProgram.account.rentAccount.all()).filter(
    (b) => b.account?.authority?.toBase58() === ownerAddress
  )

  return accounts
}

export async function getEvolutionAccountsForOwner(ownerAddress: string) {
  const accounts = await connection.getParsedProgramAccounts(
    evolutionProgramId,
    {
      filters: [
        {
          memcmp: {
            offset: 8,
            bytes: ownerAddress,
          },
        },
      ],
    }
  )

  const parsedAccounts = await Promise.all(
    accounts.map(async (a) => {
      return evolutionProgram.coder.accounts.decode(
        'EvolutionAccount',
        a.account.data as any
      ) as ReturnType<typeof evolutionProgram.account.evolutionAccount.fetch>
    })
  )
  return parsedAccounts
}

export async function getBreedingAccountsForOwner(ownerAddress: string) {
  const accounts = await connection.getParsedProgramAccounts(
    breedingProgramId,
    {
      filters: [
        {
          memcmp: {
            offset: 8,
            bytes: ownerAddress,
          },
        },
      ],
    }
  )

  const parsedAccounts = await Promise.all(
    accounts.map(async (a) => {
      return breedingProgram.coder.accounts.decode(
        'BreedingAccount',
        a.account.data as any
      ) as ReturnType<typeof breedingProgram.account.breedingAccount.fetch>
    })
  )
  return parsedAccounts.filter((a) => !a.finished)
}

export async function getAwakeningAccountsForOwner(ownerAddress: string) {
  const accounts = await connection.getParsedProgramAccounts(
    awakeningProgramId,
    {
      filters: [
        {
          memcmp: {
            offset: 8,
            bytes: ownerAddress,
          },
        },
      ],
    }
  )

  const parsedAccounts = await Promise.all(
    accounts.map(async (a) => {
      return awakeningProgram.coder.accounts.decode(
        'Awakening',
        a.account.data as any
      ) as ReturnType<typeof awakeningProgram.account.awakening.fetch>
    })
  )
  return parsedAccounts
}

export async function getStakedNftsForOwner(ownerAddress: string) {
  const stakingAccounts = await getStakingAccountsForOwner(ownerAddress)

  const nfts = await getNFTsForTokens(
    stakingAccounts.map((s) => s.token),
    true
  )
  return nfts
}

export async function getEvolutionNftsForOwner(ownerAddress: string) {
  const stakingAccounts = await getEvolutionAccountsForOwner(ownerAddress)

  const nfts = await getNFTsForTokens(stakingAccounts.map((s) => s.token))
  return nfts
}

export async function getBreedingNftsForOwner(ownerAddress: string) {
  const breedingAccounts = await getBreedingAccountsForOwner(ownerAddress)

  const nfts = await getNFTsForTokens(breedingAccounts.map((s) => s.ape1))
  const nfts2 = await getNFTsForTokens(
    breedingAccounts.filter((s) => !s.rentalUser).map((s) => s.ape2)
  )
  nfts.push(...nfts2)
  return nfts
}

export async function getAwakeningNftsForOwner(ownerAddress: string) {
  const breedingAccounts = await getAwakeningAccountsForOwner(ownerAddress)

  const nfts = await getNFTsForTokens(breedingAccounts.map((s) => s.mint))

  return nfts
}

export async function getBreedingNftsForRenters(ownerAddress: string) {
  const breedingAccounts = await getBreedingAccountsOfRenters(ownerAddress)

  const nfts = await getNFTsForTokens(
    breedingAccounts.map((s) => s.account.ape2)
  )
  return nfts
}

export async function getNftsOfRescuePool(ownerAddress: string) {
  const accounts = await getRentingAccounts(ownerAddress)

  const nfts = await getNFTsForTokens(accounts.map((s) => s.account.ape))
  return nfts
}

export async function getNFTsForTokens(
  tokens: PublicKey[],
  dontCheckMintlist?: boolean
) {
  const allTokens: any[] = []

  // due to arweave rate limit

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]

    let [pda] = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        MetadataProgram.PUBKEY.toBuffer(),
        token.toBuffer(),
      ],
      MetadataProgram.PUBKEY
    )
    const accountInfo: any = await connection.getParsedAccountInfo(pda)

    const metadata: any = new programs.metadata.Metadata(
      token.toString(),
      accountInfo.value
    )
    const dataRes = await axios.get(metadata.data.data.uri)

    if (dataRes.status === 200) {
      allTokens.push({
        ...dataRes.data,
        mint: token.toBase58(),
      })
    }
  }

  return allTokens
}

export async function getNFT(address: PublicKey) {
  let [pda] = await web3.PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      MetadataProgram.PUBKEY.toBuffer(),
      address.toBuffer(),
    ],
    MetadataProgram.PUBKEY
  )
  const accountInfo: any = await connection.getParsedAccountInfo(pda)

  const metadata: any = new programs.metadata.Metadata(
    address.toString(),
    accountInfo.value
  )
  const dataRes = await axios.get(metadata.data.data.uri)

  if (dataRes.status !== 200) {
    throw new Error('could not fetch nft')
  }
  return {
    ...dataRes.data,
    mint: address.toBase58(),
  }
}

export enum ERoles {
  Chimpion = 'Chimpion',
  Artist = 'Artist',
  Farmer = 'Artist',
  Scientist = 'Scientist',
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
