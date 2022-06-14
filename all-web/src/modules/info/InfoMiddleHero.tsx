import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { ApplyNowButton } from '../../components/ApplyNowButton'
import { AllColorIcon } from '../landing/components/icons/AllColorIcon'

interface InfoMiddleHeroProps {
  color: string
  category: string
  title: JSX.Element
  mintValue: number
  royalityValue: number
}

export const InfoMiddleHero = (props: InfoMiddleHeroProps) => {
  const { color, category, title, mintValue, royalityValue } = props

  return (
    <Stack spacing={8} alignItems='flex-start' width='100%' position='relative'>
      <HStack>
        <Box color={color} width={['10rem', '10rem', '15rem']}>
          <AllColorIcon />
        </Box>
        <Text
          fontSize={['2.5rem', '2.5rem', '4rem']}
          letterSpacing={'0.25rem'}
          textTransform='uppercase'
          fontFamily='heading'
        >
          {category}
        </Text>
      </HStack>
      <Box p={[0, 0, '2rem']} position='relative' width='100%'>
        <Box
          position={'absolute'}
          bg={`linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${color} 100%)`}
          height='60%'
          width='2px'
          bottom={0}
          left={0}
          display={['none', 'none', 'block']}
        ></Box>
        <Box
          position={'absolute'}
          bg={`linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, ${color} 100%)`}
          width='60%'
          height='2px'
          top={0}
          right={0}
          display={['none', 'none', 'block']}
        ></Box>

        <Box
          position={'absolute'}
          bg={`linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, ${color} 100%)`}
          height='60%'
          width='2px'
          top={'2rem'}
          right={0}
          display={['none', 'none', 'block']}
        ></Box>
        <Box
          position={'absolute'}
          bg={`linear-gradient(-90deg, rgba(255, 255, 255, 0) 0%, ${color} 100%)`}
          width='60%'
          height='2px'
          bottom={0}
          left={'2rem'}
          display={['none', 'none', 'block']}
        ></Box>
        <Grid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(1, 1fr)',
            'repeat(11, 1fr)',
          ]}
          rowGap={4}
        >
          <GridItem colSpan={[1, 1, 6]}>
            <Heading
              fontSize={['2rem', '2rem', '2rem']}
              fontWeight='700'
              color={'#000'}
              maxWidth={'30rem'}
              fontFamily='heading'
              css={{
                '& > span': {
                  fontWeight: 700,
                  color: color,
                },
              }}
            >
              {title}
            </Heading>
            <Text fontSize={'1rem'} fontFamily='heading'>
              We have a large scale group to support each other in this game,
              Join us to get the news as soon as possible and follow our latest
              announcements!
            </Text>
          </GridItem>
          <GridItem colSpan={[1, 1, 5]}>
            <Stack alignItems={'center'} justifyContent='center' height='100%'>
              <Link
                href='https://airtable.com/shrOYiab2lhb4ATzk'
                target='_blank'
                width={['100%', '100%', 'fit-content']}
              >
                <ApplyNowButton
                  border='unset'
                  sx={{ px: '4rem', py: '1.125rem' }}
                  height='unset'
                  fontSize='1rem'
                  lineHeight={'1.5rem'}
                  width={['100%', '100%', 'fit-content']}
                  fontFamily='heading'
                />
              </Link>
              <span>or</span>
              <Button
                sx={{ py: '0.875rem', px: '1.5rem' }}
                height='unset'
                fontSize='1rem'
                lineHeight={'1.5rem'}
                rounded='md'
                variant={'ghost'}
                border='4px solid #282936'
                width={['100%', '100%', 'fit-content']}
                fontFamily='heading'
              >
                Download Pitchdeck
              </Button>
            </Stack>
          </GridItem>
        </Grid>
      </Box>
      <Box
        px={['2rem', '4rem']}
        py={['3rem', '3rem', '6rem']}
        bottom={[0, 0, '-30rem']}
        position={['relative', 'relative', 'absolute']}
        width='100%'
        bg='#fff'
        boxShadow={'0px 15px 150px rgba(0, 0, 0, 0.08)'}
        borderRadius='1.5rem'
      >
        <Grid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(1, 1fr)',
            'repeat(7, 1fr)',
          ]}
          rowGap={4}
        >
          <GridItem colSpan={[1, 1, 4]}>
            <Stack spacing='2rem'>
              <Heading
                fontSize={['2rem', '2rem', '2.25rem']}
                fontWeight='700'
                color={'#000'}
                maxWidth='48rem'
                fontFamily='heading'
                css={{
                  '& > span': {
                    fontWeight: 900,
                  },
                }}
              >
                Pricing
              </Heading>
              <Text fontSize={'1rem'} color="#676767">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s
              </Text>
              <Button
                sx={{ py: '1.125rem', px: '1.5rem' }}
                height='unset'
                fontSize='1rem'
                lineHeight={'1.5rem'}
                rounded='md'
                width='fit-content'
                variant={'solid'}
                border='unset'
                bg='#282936'
                color='#fff'
                fontFamily='heading'
              >
                Pricing Table
              </Button>
            </Stack>
          </GridItem>
          <GridItem colSpan={1} position='relative' width='100%'>
            <Box
              position={[null, null, 'absolute']}
              bg={[
                'linear-gradient(180deg, rgba(220, 22, 112, 0) 0%, rgba(220, 22, 112, 0.5) 100%)',
                'linear-gradient(180deg, rgba(220, 22, 112, 0) 0%, rgba(220, 22, 112, 0.5) 100%)',
                `linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, ${color} 100%)`,
              ]}
              height={['2px', '2px', '60%']}
              width={['100%', '100%', '2px']}
              top={[null, null, '2rem']}
              right={[null, null, 0]}
            ></Box>
          </GridItem>
          <GridItem colSpan={[1, 1, 2]}>
            <Stack
              alignItems={['center', 'center', 'flex-start']}
              justifyContent={['space-between', 'space-between', 'center']}
              height='100%'
              pl={[0, 0, '3rem']}
              flexDir={['row', 'row', 'column']}
              spacing={[0, 0, 4]}
            >
              <Stack
                flexDir={['row', 'row', 'column']}
                spacing={[0, 0, 2]}
                alignItems={['center', 'center', 'start']}
              >
                <Text
                  fontSize={['1.75rem']}
                  fontWeight={[400, 600, 700]}
                  fontFamily='heading'
                >
                  {mintValue}%
                </Text>
                <Text color={color} fontFamily='heading'>
                  of mint
                </Text>
              </Stack>
              <Stack
                flexDir={['row', 'row', 'column']}
                spacing={[0, 0, 2]}
                alignItems={['center', 'center', 'start']}
              >
                <Text
                  fontSize={['1.75rem']}
                  fontWeight={[400, 600, 700]}
                  fontFamily='heading'
                >
                  {royalityValue}%
                </Text>
                <Text color={color} fontFamily='heading'>
                  of royalties
                </Text>
              </Stack>
            </Stack>
          </GridItem>
        </Grid>
      </Box>
    </Stack>
  )
}
