import { Link } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const NavMenuItem: React.FC<ComponentProps<typeof Link>> = ({
  color,
  children,
  ...restProps
}) => {
  return (
    <Link
      position={'relative'}
      p={2}
      fontSize={{ lg: 'sm', xl: 'md' }}
      fontWeight={500}
      display='inline-block'
      w='100%'
      textAlign='center'
      _hover={{
        ':after': {
          content: "''",
          width: '1.6em',
          height: '2px',
          position: 'absolute',
          bottom: 1,
          left: 'calc(50% - 0.8rem)',
          bg: color || 'black',
          zIndex: -1,
        },
      }}
      color={color}
      {...restProps}
    >
      {children}
    </Link>
  )
}
