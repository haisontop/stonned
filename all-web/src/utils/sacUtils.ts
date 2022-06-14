import { Metadata, MetadataProgram } from '@metaplex/js'
import { web3 } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import axios from 'axios'
import { programs } from 'newMetaplex'
import { collections } from '../config/collectonsConfig'
import config, {
  connection,
  stakingProgramId,
  evolutionProgramId,
  breedingProgramId,
} from '../config/config'
import * as spl from '@solana/spl-token'
import {
  stakingProgram,
  breedingProgram,
  evolutionProgram,
} from '../config/solanaPrograms'
import { pub } from './solUtils'
import { NftMetadata } from './nftmetaData.type'

export async function getDexlabPrice(
  pair: 'PUFF/USDC' | 'SOL/USDC' | 'ALL/SOL'
) {
  const uris = {
    'PUFF/USDC': 'FjkwTi1nxCa1S2LtgDwCU8QjrbGuiqpJvYWu3SWUHdrV',
    'SOL/USDC': '9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT',
    'ALL/SOL': 'HnYTh7fKcXN4Dz1pu7Mbybzraj8TtLvnQmw471hxX3f5',
  }

  const recentPricesRes = await axios.get(
    `https://open-api.dexlab.space/v1/prices/${uris[pair]}/last`
  )

  let price = recentPricesRes.data.data.price as number

  return price
}

export async function getPriceInSol(pair: 'PUFF/USDC') {
  const [puffPrice, solPrice] = await Promise.all([
    getDexlabPrice(pair),
    getDexlabPrice('SOL/USDC'),
  ])
  return puffPrice / solPrice
}

export async function splToUsdc(amount: number, token: PublicKey) {
  if (token.equals(pub(config.puffToken)))
    return amount / (await getDexlabPrice('PUFF/USDC'))
  if (token.equals(pub(config.allToken)))
    return (
      amount /
      ((await getDexlabPrice('ALL/SOL')) / (await getDexlabPrice('SOL/USDC')))
    )

  throw new Error('cannot calculate price for token')
}

export async function doesUserOwnNfts(
  ownerAddressString: string,
  opts?: { collections?: typeof collections }
) {
  const stakedNfts = await getStakedNftsForOwner(ownerAddressString, opts)
  if (stakedNfts.length > 0) return true

  const ownedNfts = await getNFTsForOwner(ownerAddressString, opts)
  if (ownedNfts.length > 0) return true

  const evolutionNfts = await getEvolutionNftsForOwner(ownerAddressString, opts)
  if (evolutionNfts.length > 0) return true

  const breedingNfts = await getBreedingNftsForOwner(ownerAddressString, opts)
  if (breedingNfts.length > 0) return true

  const breedingNftsOfRenters = await getBreedingNftsForRenters(
    ownerAddressString,
    opts
  )
  if (breedingNftsOfRenters.length > 0) return true
  const nftsInRescuePool = await getNftsOfRescuePool(ownerAddressString, opts)
  if (nftsInRescuePool.length > 0) return true

  return false
}

export async function getNFTsForOwner(
  ownerAddressString: string,
  opts?: { collections?: typeof collections }
) {
  const ownerAddress = new PublicKey(ownerAddressString)
  const allTokens: any[] = []

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    ownerAddress,
    {
      programId: spl.TOKEN_PROGRAM_ID,
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
            (opts?.collections ?? collections).find(
              (collection: any) => collection.creator === creator.address
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

export async function getNFTsForTokens(
  tokens: PublicKey[],
  opts?: { collections?: typeof collections }
) {
  const allTokens: ({ mint: string } & NftMetadata)[] = []

  // due to arweave rate limit

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]

    const metadata = await Metadata.load(
      connection,
      await Metadata.getPDA(token)
    )

    if (
      opts?.collections &&
      !metadata?.data?.data?.creators?.find((creator: any) =>
        (opts?.collections ?? collections).find(
          (collection: any) => collection.creator === creator.address
        )
      )
    )
      continue

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
    (b: any) => b.account?.authority?.toBase58() === ownerAddress
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

  const parsedAccounts = (
    await Promise.all(
      accounts.map(async (a) => {
        try {
          return breedingProgram.coder.accounts.decode(
            'BreedingAccount',
            a.account.data as any
          ) as ReturnType<typeof breedingProgram.account.breedingAccount.fetch>
        } catch (e) {
          console.error('breedingAccount parsing failed')
          return null as unknown as ReturnType<
            typeof breedingProgram.account.breedingAccount.fetch
          >
        }
      })
    )
  ).filter((a) => a)

  return parsedAccounts.filter((a) => !a!.finished)
}

export async function getStakedNftsForOwner(
  ownerAddress: string,
  opts?: { collections?: typeof collections }
) {
  const stakingAccounts = await getStakingAccountsForOwner(ownerAddress)

  const nfts = await getNFTsForTokens(
    stakingAccounts.map((s) => s.token),
    opts
  )
  return nfts
}

export async function getEvolutionNftsForOwner(
  ownerAddress: string,
  opts?: { collections?: typeof collections }
) {
  const stakingAccounts = await getEvolutionAccountsForOwner(ownerAddress)

  const nfts = await getNFTsForTokens(
    stakingAccounts.map((s) => s.token),
    opts
  )
  return nfts
}

export async function getBreedingNftsForOwner(
  ownerAddress: string,
  opts?: { collections?: typeof collections }
) {
  const breedingAccounts = await getBreedingAccountsForOwner(ownerAddress)
  const nfts = await getNFTsForTokens(
    breedingAccounts.map((s) => s.ape1),
    opts
  )
  const nfts2 = await getNFTsForTokens(
    breedingAccounts.filter((s) => !s.rentalUser).map((s) => s.ape2),
    opts
  )
  nfts.push(...nfts2)
  return nfts
}

export async function getBreedingNftsForRenters(
  ownerAddress: string,
  opts?: { collections?: typeof collections }
) {
  const breedingAccounts = await getBreedingAccountsOfRenters(ownerAddress)

  const nfts = await getNFTsForTokens(
    breedingAccounts.map((s: any) => s.account.ape2),
    opts
  )
  return nfts
}

export async function getNftsOfRescuePool(
  ownerAddress: string,
  opts?: { collections?: typeof collections }
) {
  const accounts = await getRentingAccounts(ownerAddress)

  const nfts = await getNFTsForTokens(
    accounts.map((s: any) => s.account.ape, opts)
  )
  return nfts
}
