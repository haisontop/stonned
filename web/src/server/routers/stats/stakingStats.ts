/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { createRouter } from '../../createRouter'
import {
  connection,
  livingSacApesCount,
  stakingIdl,
  stakingProgramId,
} from '../../../config/config'
import {
  nukedCollection,
  sacCollection,
} from '../../../config/collectonsConfig'
import { Program, Provider } from '@project-serum/anchor'
import asyncBatch from 'async-batch'
import { getMetadataForMint } from '../../../utils/splUtils'
import axios from 'axios'

export const stakingStatsRouter = createRouter().query('all', {
  async resolve({ ctx, type }) {
    const provider = new Provider(connection, {} as any, {
      commitment: 'recent',
    })
    const program = new Program(stakingIdl, stakingProgramId, provider)

    console.log('start loading stats')

    const stakingAccounts = await program.account.stakeAccount.all()

    const stakingAccountsWithMetaPromise = (async () => {
      const res = asyncBatch(
        stakingAccounts,
        async (stakingAccount, index, workerIndex) => {
          const meta = await getMetadataForMint(
            stakingAccount.account.token.toBase58()
          )
          return {
            account: stakingAccount,
            meta,
          }
        },
        8
      )
      console.log('finished stakingAccountsWithMetaPromise')
      return res
    })()
    /* const nukedNftsPromise = (async () => {
      const res = Metadata.findMany(connection, {
        creators: [nuked.creator],
      })

      console.log('finished nukedNftsPromise')
      return res
    })() */

    const [stakingAccountsWithMeta] = await Promise.all([
      stakingAccountsWithMetaPromise,
    ])

    const nukedMoonrankRes = await axios.get(
      'https://moonrank.app/crawl/nuked_apes'
    )

    let livingNukedApesCount = nukedMoonrankRes.data.seen_pieces

    const sacStakingAccounts = stakingAccountsWithMeta?.filter((s) =>
      s.meta.data?.creators?.find((c) => sacCollection.creator === c.address)
    )
    const nukedStakingAccounts = stakingAccountsWithMeta?.filter((s) =>
      s.meta.data?.creators?.find((c) => nukedCollection.creator === c.address)
    )

    return {
      sac: {
        size: livingSacApesCount,
        amount: sacStakingAccounts.length,
        percentage: (sacStakingAccounts.length / livingSacApesCount) * 100,
        livingApesCount: livingSacApesCount,
      },
      nuked: {
        size: livingNukedApesCount,
        amount: nukedStakingAccounts.length,
        percentage: (nukedStakingAccounts.length / livingNukedApesCount) * 100,
        livingApesCount: livingNukedApesCount,
      },
    }
  },
})
