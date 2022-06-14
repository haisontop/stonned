import { Button, ButtonProps } from '@chakra-ui/react'
import React, { FC, MouseEvent, useCallback } from 'react'
import { defaultButtonStyle } from './common'
import { useWalletModal } from './useWalletModal'

export const WalletModalButton: FC<ButtonProps> = ({
  children = 'Connect Wallet',
  onClick,
  ...props
}) => {
  const { visible, setVisible } = useWalletModal()

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(event)
      if (!event.defaultPrevented) setVisible(!visible)
    },
    [onClick, visible]
  )

  return (
    <Button onClick={handleClick} css={defaultButtonStyle} {...props}>
      {children}
    </Button>
  )
}
