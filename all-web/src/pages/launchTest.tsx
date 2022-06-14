import { ChakraProvider } from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import dynamic from 'next/dynamic'
import useWalletBalance, {
  WalletBalanceProvider,
} from '../utils/useWalletBalance'
import themeFlat from '../themeFlat'
import { useGetProjectsOverview } from '../modules/launch/project.hooks'
import { trpc } from '../utils/trpc'

function LaunchTest() {
  const wallet = useWallet()
  const { connected } = wallet
  const [balance] = useWalletBalance()

  const getOverviewOfProjects = trpc.useQuery(['launch.getOverview'])
  console.log(getOverviewOfProjects)

  return <ChakraProvider resetCSS theme={themeFlat}></ChakraProvider>
}

const WalletConnectionProvider = dynamic(
  () => import('../components/WalletConnectionProvider'),
  {
    ssr: false,
  }
)

export default function HOC() {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <LaunchTest />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}
