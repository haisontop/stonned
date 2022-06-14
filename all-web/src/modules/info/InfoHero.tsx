import {
  Box,
  BoxProps,
  Container,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { AiOutlineLeft } from 'react-icons/ai'
import { ApplyNowButton } from '../../components/ApplyNowButton'
import {
  MAIN_CONTAINER_MAX_WIDTH,
  MAIN_LAUNCH_CONTAINER_MAX_WIDTH,
} from '../../constants'
interface InfoHeroProps {
  icon: React.ReactNode
  subtitle: string
  titleContent: React.ReactNode
  bg: BoxProps['bg']
}

export const InfoHero = ({
  icon,
  subtitle,
  titleContent,
  bg,
}: InfoHeroProps) => {
  return (
    <Container
      width='100%'
      marginX='auto'
      position={'relative'}
      px={['1rem', '2rem']}
      bg={bg}
      maxW={'unset'}
    >
      <Container
        maxWidth={MAIN_LAUNCH_CONTAINER_MAX_WIDTH}
        pt={['5rem', '6rem']}
        pb={['2rem', '6rem']}
        px={[0, '2rem']}
      >
        <Stack spacing={8}>
          <Link
            mb={[0, 8]}
            display='flex'
            alignItems={'center'}
            href='/launch/profile/test'
            width='min-content'
          >
            <IconButton
              colorScheme='gray'
              aria-label='Plus'
              icon={<AiOutlineLeft size={'md'} color='#393E46' />}
              border='unset'
              p='0.5rem'
            />
            <Text
              color='#fff'
              fontSize={'1rem'}
              ml='1rem'
              whiteSpace={'nowrap'}
              fontFamily='heading'
              fontWeight={500}
            >
              Back to Overview
            </Text>
          </Link>
          {icon}
          <Heading
            mt={['1rem', '2.5rem']}
            fontSize={['2rem', '2rem', '3rem']}
            fontFamily='heading'
            fontWeight='300'
            color={'#fff'}
            maxWidth='48rem'
            css={{
              '& > span': {
                fontWeight: 700,
              },
            }}
          >
            {titleContent}
          </Heading>
          <Text
            color='#fff'
            fontSize={'1rem'}
            maxW={['100%', '100%', '40%']}
            fontWeight={400}
          >
            {subtitle}
          </Text>
          <Link href='https://airtable.com/shrOYiab2lhb4ATzk' target='_blank'>
            <ApplyNowButton
              border='unset'
              sx={{ px: '4rem', py: '1.125rem' }}
              height='unset'
              fontSize='1rem'
              lineHeight={'1.5rem'}
              fontFamily='heading'
            />
          </Link>
        </Stack>
      </Container>
    </Container>
  )
}
