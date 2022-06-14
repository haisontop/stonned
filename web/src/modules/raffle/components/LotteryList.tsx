import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { useAllLotteries } from '../lotteryHooks'
import LotteryOverviewItem, {
  LotteryOverViewItemSkeleton,
} from './LotteryOverviewItem'

export default function LotteryList() {
  const lotteries = useAllLotteries()

  const allLotteries =
    lotteries.data &&
    lotteries.data.sort((a, b) => {
      return b.endDate.getTime() - a.endDate.getTime()
    })

  return (
    <Container
      justifyContent={'center'}
      mt={[0]}
      //backgroundImage=' linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)'
      //borderRadius={'8px'}
      //boxShadow='0px 4px 20px rgba(0, 0, 0, 0.1)'
      py={[6]}
      maxW='container.xl'
      position={'relative'}
    >
      <Heading color='white' fontWeight='700' mb='2rem'>
        All Lucky Dips
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacingY='2rem'>
        {lotteries.isLoading ? (
          <LotteryOverViewItemSkeleton />
        ) : (
          allLotteries &&
          allLotteries.map((lottery) => {
            return <LotteryOverviewItem raffle={lottery}></LotteryOverviewItem>
          })
        )}
      </SimpleGrid>
    </Container>
  )
}
