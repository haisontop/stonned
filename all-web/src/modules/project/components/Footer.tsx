import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Link,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import React from 'react'
import { RiFacebookFill, RiTwitterFill, RiInstagramFill } from 'react-icons/ri'
import { Logo } from '../../../components/Logo'
import { MAIN_LAUNCH_CONTAINER_MAX_WIDTH } from '../../../constants'
import CategoryTitle from '../../info/CategoryTitle'

const linksText = [
  {
    label: 'Terms of Service',
    href: 'https://twitter.com/stonedapecrew',
  },
  {
    label: 'Privacy Policy',
    href: 'https://twitter.com/stonedapecrew',
  },
]

export default function Footer() {
  const smallDevice = useBreakpointValue({ base: true, md: false })

  const linksIcons = [
    {
      label: 'Facebook',
      href: '',
      icon: <RiFacebookFill size={smallDevice ? 25 : 20} color="#7D89FF"/>,
    },
    {
      label: 'Twitter',
      href: 'https://twitter.com/stonedapecrew',
      icon: <RiTwitterFill size={smallDevice ? 25 : 20} />,
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/stonedapesofficial/',
      icon: <RiInstagramFill size={smallDevice ? 25 : 20} />,
    },
  ]

  return (
    <Box bg='#000' width='100%'>
      <Container maxW={MAIN_LAUNCH_CONTAINER_MAX_WIDTH} py='4rem' bg='#000'>
        <Grid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(1, 1fr)',
            'repeat(3, 1fr)',
          ]}
          columnGap='8rem'
          rowGap={'2rem'}
        >
          <GridItem>
            <Stack>
              <Logo fillColor='#fff' maxW={"15rem"}/>
              <Text fontSize={'0.75rem'} lineHeight={2} color='#B0B0B0'>
                All Blue’s technology and strategy powers some of the most
                innovative and best performing projects on Solana.
              </Text>
            </Stack>
          </GridItem>
          <GridItem>
            <Box display='flex' flexDir={'column'}>
              <CategoryTitle label='LAUNCH' iconWidth={['6rem']} />
              <Text fontSize={'0.75rem'} lineHeight={2} color='#B0B0B0'>
                ALL Launch provides a great mint experience for minters and
                creators. With anti-bot and whitelisting features we secure your
                launch and by providing rich information about projects, users
                mint with confidence.
              </Text>
            </Box>
            <Box
              display='flex'
              flexDir={'column'}
              mt={['2rem', '2rem', '5rem']}
            >
              <CategoryTitle
                label='TECH'
                iconColor={'#DC1670'}
                iconWidth={['6rem']}
              />
              <Text fontSize={'0.75rem'} lineHeight={2} color='#B0B0B0'>
                ALL Launch provides a great mint experience for minters and
                creators. With anti-bot and whitelisting features we secure your
                launch and by providing rich information about projects, users
                mint with confidence.
              </Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box display='flex' flexDir={'column'}>
              <CategoryTitle
                label='COIN'
                iconColor={'#820FB8'}
                iconWidth={['6rem']}
              />
              <Text fontSize={'0.75rem'} lineHeight={2} color='#B0B0B0'>
                ALL Launch provides a great mint experience for minters and
                creators. With anti-bot and whitelisting features we secure your
                launch and by providing rich information about projects, users
                mint with confidence.
              </Text>
            </Box>
            <Box
              display='flex'
              flexDir={'column'}
              mt={['2rem', '2rem', '5rem']}
            >
              <CategoryTitle
                label='STRATEGY'
                iconColor={'#1399D9'}
                iconWidth={['6rem']}
              />
              <Text fontSize={'0.75rem'} lineHeight={2} color='#B0B0B0'>
                ALL Launch provides a great mint experience for minters and
                creators. With anti-bot and whitelisting features we secure your
                launch and by providing rich information about projects, users
                mint with confidence.
              </Text>
            </Box>
          </GridItem>
        </Grid>
      </Container>
      <Box borderTop={'1px solid #2B2B2B'}></Box>
      <Container maxW={MAIN_LAUNCH_CONTAINER_MAX_WIDTH} py='1rem' bg='#000'>
        <Grid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(1, 1fr)',
            'repeat(3, 1fr)',
          ]}
          columnGap='8rem'
          rowGap={'1rem'}
        >
          <GridItem order={[3, 3, 1]}>
            <Text color='#B0B0B0' textAlign={['center', 'center', 'left']}>
              ©ALLBlue 2022
            </Text>
          </GridItem>
          <GridItem order={[1, 1, 2]}>
            <HStack justifyContent={'center'} columnGap={["2rem", "2rem", "0.5rem"]} width="100%">
              {linksIcons.map((linkIcon, i) => (
                <Link
                  key={linkIcon.href}
                  href={linkIcon.href}
                  target='_blank'
                  role='group'
                >
                  <Icon
                    key={i}
                    color={'#fff'}
                    transition='ease-in-out all .2s'
                    _groupHover={{
                      color: 'textGrey',
                    }}
                    width={['3rem', '3rem', '1.5rem']}
                    height={['3rem', '3rem', '1.5rem']}
                  >
                    {linkIcon.icon}{' '}
                  </Icon>
                </Link>
              ))}
            </HStack>
          </GridItem>
          <GridItem order={[2, 2, 3]}>
            <Flex
              justifyContent='space-between'
              flexDir={['column', 'column', 'row']}
              alignItems={'center'}
              rowGap={"1rem"}
            >
              {linksText.map((linkText) => (
                <Link
                  key={linkText.label}
                  href={linkText.href}
                  target='_blank'
                  role='group'
                >
                  <Text color='#B0B0B0'>{linkText.label}</Text>
                </Link>
              ))}
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}
