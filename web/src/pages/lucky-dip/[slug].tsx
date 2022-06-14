import superjson from 'superjson'
import React from 'react'
import dynamic from 'next/dynamic'
import { WalletBalanceProvider } from '../../utils/useWalletBalance'
import RaffleDetailPage from '../../modules/raffle/RaffleDetailPage'
import {
  getAllLotteries,
  getLotteryByAddress,
} from '../../modules/raffle/lotteryUtils'
import { RaffleType } from '../../modules/raffle/type'
import { useRouter } from 'next/router'
import { Spinner } from '@chakra-ui/react'
import { useLottery, useLotterySSR } from '../../modules/raffle/lotteryHooks'
import { dehydrate, QueryClient } from 'react-query'

/* export async function getStaticPaths() {
  const allLotteries = await getAllLotteries()
  const paths = allLotteries.map(
    (lottery) => `/lucky-dip/${lottery.publicKey.toBase58()}`
  )
  console.log({ paths })

  return { paths, fallback: true }
} */

// export async function getStaticProps({ params }: any) {
//   const { slug } = params
//   console.log({ slug })

//   const raffle = await getLotteryByAddress(slug)

//   const queryClient = new QueryClient()

//   await queryClient.prefetchQuery('lottery', () => getLotteryByAddress(slug))

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   }

//   return {
//     props: {
//       /* raffleSerialized: { json, meta }, */
//       /* raffleJson: superjson.stringify(json),
//       raffleMeta: superjson.stringify(meta), */
//     },
//     revalidate: 60,
//   }
// }

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

const WalletConnectionProvider = dynamic(
  () => import('../../components/WalletConnectionProvider'),
  {
    ssr: false,
  }
)

export default function Raffle(props: any) {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <RaffleDetailPage />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}
