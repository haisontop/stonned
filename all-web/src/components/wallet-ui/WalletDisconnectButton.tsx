import { Button, ButtonProps } from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import { defaultButtonStyle } from './common'
import { WalletIcon } from './WalletIcon'

export const WalletDisconnectButton: FC<ButtonProps> = ({
  children,
  disabled,
  onClick,
  ...props
}) => {
  const { wallet, disconnect, disconnecting } = useWallet()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (onClick) onClick(event)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      if (!event.defaultPrevented) disconnect().catch(() => {})
    },
    [onClick, disconnect]
  )

  const content = useMemo(() => {
    if (children) return children
    if (disconnecting) return 'Disconnecting ...'
    if (wallet) return 'Disconnect'
    return 'Disconnect Wallet'
  }, [children, disconnecting, wallet])

  return (
    <Button
      disabled={disabled || !wallet}
      starticon={wallet ? <WalletIcon wallet={wallet} /> : undefined}
      onClick={handleClick}
      css={defaultButtonStyle}
      {...props}
    >
      {content}
    </Button>
  )
}