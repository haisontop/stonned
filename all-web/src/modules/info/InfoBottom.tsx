import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { AiOutlineLeft } from 'react-icons/ai'
import { ApplyNowButton } from '../../components/ApplyNowButton'

export const InfoBottom = () => {
  const bgImage = useBreakpointValue({
    base: '/images/ecosystem-mobile.png',
    md: '/images/ecosystem.png',
  })

  return (
    <Stack position={'relative'}>
      <Image
        position='absolute'
        width={'100%'}
        height={['auto', 'auto', '100%']}
        src={bgImage}
        objectFit={'cover'}
        top={0}
      ></Image>
      <Box
        px={['0.5rem', 0, '15rem']}
        py={['0.5rem', 0, '25rem']}
        pt={['15rem', '12rem', '25rem']}
        height='100%'
      >
        <Stack
          width={['100%', '100%', '60%', '50%']}
          mx='auto'
          alignItems={'center'}
          spacing={3}
          height='100%'
        >
          <Text fontSize={'3rem'} fontWeight={700} textAlign={'center'} fontFamily="heading">
            ALLBlue Ecosystem
          </Text>
          <Text width='90%' textAlign={'center'} color="#676767">
            ALL Blue is not just a tech platform. We are an ecosystem of the
            best NFT projects on Solana
          </Text>
          <Stack alignItems={'center'} flexDir={['column', 'column', 'row']} rowGap={2} columnGap={2} spacing={0}>
            <Link href='https://airtable.com/shrOYiab2lhb4ATzk' target='_blank'>
              <ApplyNowButton
                border='unset'
                sx={{ px: '4rem', py: '1.125rem' }}
                height='unset'
                fontSize='1rem'
                lineHeight={'1.5rem'}
                fontFamily="heading"
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
              fontFamily="heading"
            >
              Download Pitchdeck
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}
