import {
  Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { useColorMode, useColorModeValue } from '@chakra-ui/system'
import PropagateLoader from 'react-spinners/PropagateLoader'
import { AiOutlineLeft } from 'react-icons/ai'
import { WalletMultiButton } from '../../../components/wallet-ui'

const MOCK_WALLET_LIST = [
  {
    name: 'Phantom',
    detected: true,
  },
  {
    name: 'Solflare',
    detected: false,
  },
  {
    name: 'Torus',
    detected: false,
  },
  {
    name: 'Ledger',
    detected: false,
  },
  {
    name: 'Sollet',
    detected: false,
  },
  {
    name: 'Slope',
    detected: false,
  },
]

interface WalletItemProps {
  name: string
  detected?: boolean
  onClick: (address: string) => void
}

const WalletItem = (props: WalletItemProps) => {
  const { name, detected, onClick } = props

  return (
    <HStack
      justifyContent={'space-between'}
      width='100%'
      py='1rem'
      borderBottom={'1px solid #EEEEEE'}
      onClick={() => onClick(name)}
      cursor='pointer'
    >
      <HStack>
        <Avatar
          size='sm'
          // sx={{ width: '5.625rem', height: '5.625rem' }}
        ></Avatar>
        <Text fontWeight={600}>{name}</Text>
      </HStack>
      {detected && <Text fontSize={'0.75rem'}>{'Detected'}</Text>}
    </HStack>
  )
}

export default function Connectwallet() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode } = useColorMode()
  const modalBg = useColorModeValue('#fff', '#1F2023')
  const [status, setStatus] = useState('initial')

  const handleConnect = (address: string) => {
    setStatus('connecting')

    setTimeout(() => {
      setStatus('connected')
    }, 5000)
  }

  const renderContent = useCallback(() => {
    if (status === 'initial') {
      return (
        <Stack alignItems={'center'}>
          <Text fontSize={'1.25rem'} fontWeight={600} mb='2rem' mt='1rem'>
            Connect a Solana wallet
          </Text>
          {MOCK_WALLET_LIST.map((wallet) => (
            <WalletItem
              key={wallet.name}
              name={wallet.name}
              detected={wallet.detected}
              onClick={handleConnect}
            />
          ))}
        </Stack>
      )
    } else if (status === 'connecting') {
      return (
        <Stack
          alignItems={'center'}
          justifyContent='center'
          height='100%'
          spacing={10}
        >
          <Stack alignItems={'center'} justifyContent='center'>
            <Text fontSize={'1.25rem'} fontWeight={600} mt='1rem'>
              Connecting
            </Text>
            <Text fontSize={'0.75rem'} fontWeight={600} mb='2rem'>
              Please unlock your Phantom wallet
            </Text>
          </Stack>

          <HStack justifyContent={'space-between'} width='80%'>
            <Image src='/images/logo-solana.png' width='3.125rem'></Image>

            <PropagateLoader color={'#C4C4C4'} />

            <Image src='/images/logo-black.png' width='3.125rem'></Image>
          </HStack>
        </Stack>
      )
    } else if (status === 'connected') {
      return (
        <Stack
          alignItems={'center'}
          justifyContent='center'
          height='100%'
          spacing={10}
        >
          <Stack alignItems={'center'} justifyContent='center'>
            <Text fontSize={'1.25rem'} fontWeight={600} mt='1rem'>
              Connected 🎉
            </Text>
          </Stack>
        </Stack>
      )
    }
  }, [status])

  return <WalletMultiButton />

  return (
    <>
      <Button
        onClick={onOpen}
        rounded='md'
        bg='#393E46'
        color='#fff'
        fontWeight={600}
        height='2rem'
      >
        Connect Wallet
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={modalBg} minH='30rem'>
          <ModalHeader position={'relative'}>
            <Box position='absolute' top='0.6rem' left='0.6rem'>
              <IconButton
                colorScheme='gray'
                aria-label='Plus'
                icon={<AiOutlineLeft size={'md'} />}
                border='unset'
                p='0.1rem'
                size={'sm'}
                bg='transparent'
                onClick={() => setStatus('initial')}
              />
            </Box>

            <Image
              src={
                colorMode === 'light'
                  ? '/images/logo.png'
                  : '/images/semi-logo.png'
              }
              alt='logo'
              width='1.875rem'
              height='1.6875rem'
              mx='auto'
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px={'3rem'}>{renderContent()}</ModalBody>

          <ModalFooter>
            <Stack alignItems={'center'} width='100%'>
              <Text fontSize={'0.875rem'} fontWeight={600}>
                New to Solana?
              </Text>
              <Link>Learn about wallets</Link>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
