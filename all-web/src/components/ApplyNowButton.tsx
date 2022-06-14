import { Button } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const ApplyNowButton: React.FC<ComponentProps<typeof Button>> = ({
  ...restProps
}) => {
  return (
    <Button
      bg='#282936'
      color='white'
      size={'md'}
      _hover={{
        color: '#282936',
        bg: 'transparent',
        border: '1px solid #282936',
      }}
      css={{ borderRadius: '10px' }}
      {...restProps}
    >
      Apply now
    </Button>
  )
}
