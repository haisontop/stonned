import {
  Box,
  BoxProps,
  Container,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react'
import {
  MAIN_CONTAINER_MAX_WIDTH,
  MAIN_LAUNCH_CONTAINER_MAX_WIDTH,
  MAIN_PROJECT_CONTAINER_MAX_WIDTH,
} from '../../../constants'

export const LearnAllBlue = () => {
  return (
    <Container
      maxWidth={MAIN_LAUNCH_CONTAINER_MAX_WIDTH}
      pt={['0rem', '5rem', '6rem']}
      pb={['40rem', '30rem', '24rem']}
      px={['1rem', '2rem']}
      position='relative'
    >
      <Grid
        templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(5, 1fr)']}
        rowGap={"2rem"}
      >
        <GridItem colSpan={[1, 1, 3]}>
          <Stack spacing={8}>
            <Heading
              sx={{
                '& > span': {
                  color: '#595FD7',
                },
              }}
              as='h2'
              fontSize={['1.75rem', '1.75rem', '3rem']}
            >
              Learn how <span>ALLBlue</span>
              <br /> helped <span>Stoned Ape Crew</span>?
            </Heading>
            <Text
              maxW={[null, null, '31.25rem']}
              fontSize={'1rem'}
              lineHeight={2}
              sx={{
                '& > span': {
                  color: '#595FD7',
                },
              }}
            >
              There’s nothing like an explosion of blockchain news to leave you
              thinking, “Um… what’s going on here?” That’s the feeling I’ve
              experienced while reading about Grimes getting millions of dollars
              for NFTs or about Nyan Cat being sold as one. And by the time we
              all thought we sort of knew what the deal was, the founder of
              Twitter put an autographed tweet up for sale as an NFT. Now,
              months after we first published this explainer, we’re still seeing
              headlines about people paying house-money for clip art of rocks —
              and my mom still doesn’t really understand what an NFT is. Right,
              sorry. “Non-fungible” more or less means that it’s unique and
              can’t be replaced with something else. For example, a bitcoin is
              fungible — trade one for another bitcoin, and you’ll have exactly
              the same thing. A one-of-a-kind trading card, however, is
              non-fungible. If you traded it for a different card, you’d have
              something completely different. You gave up a Squirtle, and got a
              1909 T206 Honus Wagner.
            </Text>
          </Stack>
        </GridItem>
        <GridItem colSpan={[1, 1, 2]}>
          <Image src='/images/project/learn-all-blue.png' width='100%' />
        </GridItem>
      </Grid>
    </Container>
  )
}
