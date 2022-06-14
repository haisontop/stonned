import React, { useState, useEffect } from 'react'
import {
  Box,
  Stack,
  Heading,
  Text,
  Link,
  Button,
  useBreakpointValue,
  HStack,
  chakra,
  Modal,
  useDisclosure,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react'

import { useRouter } from 'next/dist/client/router'

export default function CTA() {
  const router = useRouter()
  const columns = useBreakpointValue({ base: 2, md: 3, lg: 4, xl: 6 })

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box paddingY='3' d='flex' justifyContent='center'>
      <Box>
        <Stack paddingY='4' direction={['column', 'row']}>
          <Button
            bg='linear-gradient(to top left, #7a00cc 22%,#f72c87 80.67%)'
            borderRadius='10px'
            color='white'
            _hover={{
              boxShadow: '1px 1px 5px 1px #acd0d67a',
            }}
            onClick={() =>
              window &&
              window.open(
                'https://magiceden.io/marketplace/stoned_ape_crew',
                '_blank'
              )
            }
          >
            Buy on MagicEden
          </Button>
          <Button
            onClick={onOpen}
            bg='primary'
            borderRadius='10px'
            color='white'           
            _hover={{
              boxShadow: '1px 1px 5px 1px #acd0d67a',
            }}
            margin='2px 0 2px 0'
          >
            Buy $PUFF
          </Button>
          <Button
            bg={useColorModeValue('black', 'white')}
            color='#fff'
            borderRadius='10px'
            variant='ghost'
            _hover={{
              boxShadow: '1px 1px 5px 1px #acd0d67a',
            }}
            onClick={() =>
              window &&
              window.open(
                'https://moonrank.app/collection/stoned_ape_crew',
                '_blank'
              )
            }
          >
            Rarity on moonrank
          </Button>
          <Modal
            isCentered
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'
            colorScheme={'teal'}
          >
            <ModalOverlay />
            <ModalContent background='black' color='white'>
              <ModalHeader>BUY $PUFF</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack direction='column'>
                  <Link
                    href='https://raydium.io/swap/?from=G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB&to=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
                    target='_blank'
                  >
                    Buy $PUFF on Raydium Swap
                  </Link>
                  <Link
                    href='https://raydium.io/liquidity/?ammId=7F3e8URDCJuJyHi1Yq45HECk4MD2bqtd6M3e3pfPRKVi'
                    target='_blank'
                  >
                    Provide Liquidity on Raydium
                  </Link>
                  <Link
                    href='https://dex.aldrin.com/swap?base=PUFF&quote=USDC'
                    target='_blank'
                  >
                    Buy $PUFF on Aldrin Swap
                  </Link>
                  <Link
                    href='https://dex.aldrin.com/pools/PUFF_USDC'
                    target='_blank'
                  >
                    Provide Liquidity on Aldrin
                  </Link>
                  <Link
                    href='https://solapeswap.io/#/market/FjkwTi1nxCa1S2LtgDwCU8QjrbGuiqpJvYWu3SWUHdrV'
                    target='_blank'
                  >
                    Buy $PUFF on SolApe
                  </Link>
                  <Link
                    href='https://trade.dexlab.space/#/market/FjkwTi1nxCa1S2LtgDwCU8QjrbGuiqpJvYWu3SWUHdrV'
                    target='_blank'
                  >
                    Buy $PUFF on DexLab
                  </Link>
                  <Divider />
                  <Text fontSize={'14px'} fontWeight='semibold'>Other links</Text>
                  <Link
                    href='https://www.coingecko.com/en/coins/puff'
                    target='_blank'
                  >
                    CoinGecko
                  </Link>
                  <Link href='/analytics' target='_blank'>
                    Puff Analysis
                  </Link>
                  <Link href='/puff' target='_blank'>
                    Puff Website
                  </Link>
                </Stack>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>

          {/*   <Button
            bg='linear-gradient(to top left, #7a00cc 22%,#f72c87 80.67%)'
            borderRadius='10px'
            boxShadow='10px 8px 10px 4px rgba(187,238,231,0.5)'
            color='white'
            _hover={{}}
            onClick={() =>
              window &&
              window.open(
                'https://magiceden.io/marketplace/stoned_ape_crew',
                '_blank'
              )
            }
          >
            Buy on MagicEden
          </Button>
          <Button
            bg='linear-gradient(to top left, rgba(187,238,231,1) 18%, rgba(206,252,122,1) 50%)'
            borderRadius='10px'
            boxShadow='10px 8px 10px 4px rgba(187,238,231,0.5)'
            _hover={{}}
            onClick={() =>
              window &&
              window.open(
                'https://trade.dexlab.space/#/market/FjkwTi1nxCa1S2LtgDwCU8QjrbGuiqpJvYWu3SWUHdrV',
                '_blank'
              )
            }
          >
            Buy $PUFF
          </Button> */}
          {/* <Link margin='auto' display='flex' justifyContent='center' marginTop='18px' href='/staking' _hover={{}}>
            <Button
              bg='linear-gradient(to top left, rgba(187,238,231,1) 18%, rgba(206,252,122,1) 50%)'
              borderRadius='10px'
              boxShadow='10px 8px 10px 4px rgba(187,238,231,0.5)'
              _hover={{}}
              margin='auto'
            >
              Stake your Apes
            </Button>
          </Link> */}
        </Stack>
      </Box>
    </Box>
  )
}
