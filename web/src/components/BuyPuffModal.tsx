import { Divider, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text } from "@chakra-ui/react"
import { ComponentProps, FC } from "react"

export const BuyPuffModal: FC<ComponentProps<typeof Modal>> = (props) => {
  return (
  <Modal
    isCentered
    onClose={props.onClose}
    isOpen={props.isOpen}
    motionPreset='slideInBottom'
    colorScheme={'teal'}
  >
    <ModalOverlay />
    <ModalContent background='black' color='white' borderRadius='.5rem'>
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
          <Divider margin='1rem 0'/>
          <Text fontWeight='bold' mb='1rem!important'>Other links</Text>
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
  )
}