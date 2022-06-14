import { PlusSquareIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react'
import React from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import WalletListItem from './WalletListItem'

interface WalletListProps {}

export default function WalletList(props: WalletListProps) {
  // const plusIconColor = useColorModeValue("#")

  return (
    <Stack spacing='2rem'>
      <Heading fontSize={'1.5rem'} fontWeight={600}>
        Your Wallets
      </Heading>
      <Wrap spacing={'1.5rem'}>
        <WalletListItem
          title='Main Wallet'
          address='6eirmoDtemPVIE93orinvidunCJIVtla09boreetdolo'
        />
        <WalletListItem
          title='Burner #1'
          address='6eirmoDtemPVIE93orinvidunCJIVtla09boreetdolo'
        />
        <WalletListItem
          title='Burner xyz'
          address='6eirmoDtemPVIE93orinvidunCJIVtla09boreetdolo'
        />

        <Flex alignItems={'center'}>
          <IconButton
            aria-label='Plus'
            icon={<AiOutlinePlus />}
            border='unset'
            bg='#EEEFEE'
            color='#000'
          />
        </Flex>
      </Wrap>
    </Stack>
  )
}
