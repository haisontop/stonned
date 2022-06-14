import { Container, Heading, Stack, Text } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { GradientText } from '../../../components/GradientText'
import { MerchDropContext, MerchDropStatus } from '../MerchDropContextProvider'
interface PiecesProps {
  pieceCount: number
}

export default function Pieces(props: PiecesProps) {
  const { pieceCount } = props
  const { status } = useContext(MerchDropContext)
  const isSoldOut = status === MerchDropStatus.SOLD_OUT

  return (
    <Container maxW={'xl'}>
      <Stack
        textAlign='center'
        alignItems='center'
        spacing={16}
        mt={isSoldOut ? 6 : 0}
      >
        {isSoldOut ? (
          <Stack spacing={0}>
            <GradientText
              as='span'
              fontWeight='600'
              direction='left'
              fontSize='3xl'
            >
              SOLD OUT
            </GradientText>
          </Stack>
        ) : (
          <Stack spacing={0}>
            <Text
              fontSize={[20]}
              lineHeight={['24px']}
              fontWeight={600}
              fontFamily='Montserrat'
              color='#A0A0A0'
            >
              Pieces
            </Text>
            <GradientText
              as='span'
              fontWeight='600'
              direction='left'
              fontSize='3xl'
            >
              {pieceCount}
            </GradientText>
          </Stack>
        )}

        <Heading
          textAlign='center'
          fontWeight={500}
          maxWidth='100vw'
          paddingX={'16px'}
          color={isSoldOut ? '#000' : '#A0A0A0'}
          fontSize='1.5xl'
          pb={16}
        >
          {isSoldOut
            ? 'Everybody who has purchased a token can swap it for a real box from 06/03/2022 21:00 UTC on this page. You will be able to choose your size there. Also, there will be the possibility for a re-order in the next 72 hours.'
            : 'The Token Purchase gets you an NFT that can be used to swap for a real SAC Hoodie from March 6th 2022.'}
        </Heading>
      </Stack>
    </Container>
  )
}
