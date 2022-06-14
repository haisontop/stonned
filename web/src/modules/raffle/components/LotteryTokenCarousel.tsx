import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import AliceCarousel from 'react-alice-carousel'
import LotteryTokenItem from './LotteryTokenItem'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { whiten } from '@chakra-ui/theme-tools'
import { AsyncState } from 'react-use/lib/useAsync'
import { Lottery } from '../lotteryUtils'
import { useActiveLottery, useLottery } from '../lotteryHooks'
import { RaffleType } from '../type'
import { useRouter } from 'next/router'
const handleDragStart = (event: any) => event.preventDefault()

export type LotteryTokenCarouselProps = {
  raffle: RaffleType
}

export default function LotteryTokenCarousel({
  raffle,
}: LotteryTokenCarouselProps) {
  const router = useRouter()
  const slug = router.query.slug

  const raffleRes = useLottery(slug)

  const renderPrevButton = ({ isDisabled }: { isDisabled: boolean }) => {
    return (
      <Button
        position={'absolute'}
        top={['-90px', '-90px', '-115px', '-125px']}
        right={['55px', '80px']}
      >
        <BsArrowLeft />
      </Button>
    )
  }

  const renderNextButton = ({ isDisabled }: { isDisabled: boolean }) => {
    return (
      <Button
        position={'absolute'}
        top={['-90px', '-90px', '-115px', '-125px']}
        right={['0px', '15px']}
      >
        <BsArrowRight />
      </Button>
    )
  }

  return (
    <Container
      justifyContent={'center'}
      mt={['.5rem', '1rem', '3rem']}
      py={[6, 8, 12]}
      maxW='container.xl'
      px={0}
    >
      <Heading
        color='white'
        textAlign='left'
        fontWeight={700}
        fontSize={['3xl', '3xl', '4xl']}
        mb={4}
      >
        ALL{' '}
        <Heading
          as='span'
          fontFamily={'Poppins'}
          color='transparent'
          textAlign='left'
          fontWeight={700}
          fontSize={['3xl', '3xl', '4xl']}
          css={{
            WebkitTextStroke: '2px #fff',
          }}
        >
          PRIZES
        </Heading>
      </Heading>

      <Box
        bg='linear-gradient(180deg, rgba(255, 255, 255, 0.025) 0%, rgba(255, 255, 255, 0.0) 100%)'
        borderRadius={'8px'}
        boxShadow='0px 4px 20px rgba(0, 0, 0, 0.1)'
        px={4}
        py={4}
      >
        <Box margin={['1rem 0 0', '1rem 0 0', '2rem 0 0']}>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacingY='1rem'>
            {raffleRes.data?.prices.map((p) => (
              <LotteryTokenItem
                tokenName={p.name}
                valueLabel=''
                tokenImageURL={p.image}
                tokenNameStyle={{}}
              />
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Container>
  )
}
