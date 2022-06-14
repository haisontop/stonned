import * as web3 from '@solana/web3.js'
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import { createRouter } from '../../createRouter'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { Program, Provider, Wallet } from '@project-serum/anchor'
import config, {
  backendUserPubkey,
  breedingIdl,
  breedingProgramId,
  connection,
  isNukedWhitelistSale,
  nuked,
  nukedMintWallet,
  puffBurnerWallet,
  puffToken,
} from '../../../config/config'
import { getBreedingConfigPda } from '../../../modules/breeding/breeding.service'
import {
  getRawRoleOfNft,
  getRoleOfNft,
  getTokenAccount,
  Role,
} from '../../../utils/solUtils'
import { mintV2 } from '../../../utils/mintV2'
import Reattempt from 'reattempt'
import { createRevealInstruction } from '../../../modules/breeding/breeding.utils'
import _ from 'lodash'
import {
  createTransferInstruction,
  getTokenAccountsForOwner,
} from '../../../utils/splUtils'
import { Metadata } from '@metaplex/js'
import { getMetadata } from '../../../utils/candyMachineIntern/candyMachineHelpers'
import {
  getNukedMintNfts,
  getNukedPrice,
} from '../../../modules/nuked/nukedUtils'



const nukedMintUser = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.NUKED_MINT_WALLET as string))
)

const provider = new Provider(connection, new Wallet(nukedMintUser), {
  commitment: 'confirmed',
})
const program = new Program(breedingIdl, breedingProgramId, provider)

export const mintNukedRouter = createRouter()
  // create
  .mutation('mint', {
    input: z.object({
      user: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        console.log('input', input)

        const user = new PublicKey(input.user)

        const instructions: web3.TransactionInstruction[] = []

        const nfts = await getNukedMintNfts()
        if (nfts.length === 0) throw new Error('sold out')

        const nftStr = _.sample(nfts)!

        const nft = new PublicKey(nftStr)

        if (isNukedWhitelistSale) {
          const transferWhitelistInstructions = await createTransferInstruction(
            {
              from: user,
              to: nuked.rentalFeeDepositAccount,
              mint: config.nuked.whiteListToken,
              amount: 1,
              payer: user,
            }
          )
          instructions.push(...transferWhitelistInstructions)
        }

        const transferNftInstructions = await createTransferInstruction({
          from: nukedMintUser.publicKey,
          to: user,
          mint: nft,
          amount: 1,
          payer: user,
          signers: [nukedMintUser],
        })
        instructions.push(...transferNftInstructions)

        const price = getNukedPrice()

        instructions.push(
          SystemProgram.transfer({
            fromPubkey: user,
            toPubkey: nukedMintUser.publicKey,
            lamports: price * web3.LAMPORTS_PER_SOL,
          })
        )

        const recentBlockhash = await connection.getRecentBlockhash()
        const transaction = new web3.Transaction({
          feePayer: user,
          recentBlockhash: recentBlockhash.blockhash,
        }).add(...instructions)

        await transaction.partialSign(nukedMintUser)

        const serializedTransaction = transaction.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        })

        return {
          trans: serializedTransaction.toJSON(),
        }
      } catch (e) {
        console.error('error in minting', e)
        throw e
      }
    },
  })
// read

async function getAvailableMintNfts() {
  const { value: tokenAccounts } =
    await connection.getParsedTokenAccountsByOwner(
      nukedMintWallet,
      {
        programId: spl.TOKEN_PROGRAM_ID,
      },
      'recent'
    )

  const tokenAccountsWithAmount = tokenAccounts.filter(
    (t) => t.account.data.parsed.info.tokenAmount.uiAmount
  )

  return tokenAccountsWithAmount
}

/* console.time('load nfts')
        const nfts = await getTokenAccountsForOwner(nukedMintUser.publicKey, {
          withAmount: true,
          commitment: 'confirmed',
        })
        console.timeEnd('load nfts')

        const nftTokenAccount = await Reattempt.run({ times: 5 }, async () => {
          const nftTokenAccount = _.sample(nfts)!
          const nft = new PublicKey(
            nftTokenAccount.account.data.parsed.info.mint
          )

          const metadata = await Metadata.load(
            connection,
            await Metadata.getPDA(nft)
          )

          if (
            !metadata.data.data.creators?.find(
              (c) => c.address === nuked.creator.toBase58() && c.verified
            )
          ) {
            console.error('not an nuked', nft.toBase58())
            throw new Error('not an nuked')
          }

          return nftTokenAccount
        })*/
