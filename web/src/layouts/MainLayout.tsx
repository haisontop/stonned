import { Box } from '@chakra-ui/react'
import { FC } from 'react'
import Navbar, { NavbarProps } from '../components/Navbar'

interface Prop {
  navbar: NavbarProps
}

export const MainLayout: FC<Prop> = ({ navbar, children }) => {
  return (
    <Box>
      <Navbar {...navbar} />
      {children}
    </Box>
  )
}
