import dynamic from 'next/dynamic'
import { WalletBalanceProvider } from '../../../utils/useWalletBalance'

const WalletConnectionProvider = dynamic(
  () => import('../../../components/WalletConnectionProvider'),
  {
    ssr: false,
  }
)

export function withSolana(Component: React.FC<any>) {
  return (props: any) => (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <Component {...props} />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}
