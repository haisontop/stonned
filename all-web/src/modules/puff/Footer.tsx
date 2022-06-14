import {
  Box,
  chakra,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  Input,
  IconButton,
  useColorModeValue,
  Image,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import { BiMailSend } from 'react-icons/bi'

const links = [
  {
    label: 'DISCORD',
    href: 'https://discord.gg/dnxE4fHZKs',
  },
  {
    label: 'TWITTER',
    href: 'https://twitter.com/stonedapecrew',
  },
  {
    label: 'SOLNART',
    href: 'https://twitter.com/stonedapecrew',
  },
]

const linksUnnedig = [
  {
    label: 'TERMS OF SERVICE',
    href: 'https://twitter.com/stonedapecrew',
  },
  {
    label: 'PRIVACY POLICE',
    href: 'https://twitter.com/stonedapecrew',
  },
  {
    label: 'OWNERSHIP',
    href: 'https://twitter.com/stonedapecrew',
  },
]

export default function Footer() {
  return (
    <Box pb='1rem'>
      <Stack spacing='2rem' alignItems='center'>
        <Image
          display={{ base: 'block', md: 'none' }}
          width={{ base: '150px', md: '200px' }}
          src='/images/puff-ape.png'
        />
        <Stack
          width='70%'
          direction={{ base: 'row', md: 'row' }}
          alignItems={{ base: 'start', md: 'center' }}
          justifyContent='space-around'
          spacing={{ base: '3rem' }}
        >
          <Stack
            flex='1 1 0px'
            spacing={{ base: '0.5rem', md: '1.25rem' }}
            justifyContent='center'
            alignItems='flex-end'
          >
            {links.map((l, i) => (
              <Text
                key={i}
                fontSize={{ md: 'xs' }}
                as='a'
                href={l.href}
                target='_blank'
                fontWeight={'500'}
              >
                {l.label}
              </Text>
            ))}
          </Stack>
          <Image
            display={{ base: 'none', md: 'block' }}
            width={{ base: '150px', md: '200px' }}
            src='images/puff-ape.png'
          />
          <Stack
            flex='1 1 0px'
            spacing={{ base: '0.5rem', md: '1.25rem' }}
            justifyContent='center'
            alignItems='flex-start'
          >
            {linksUnnedig.map((l, i) => (
              <Text
                key={i}
                fontSize={{ md: 'xs' }}
                as='a'
                href={l.href}
                target='_blank'
                fontWeight={'500'}
                lineHeight={'32px'}
              >
                {l.label}
              </Text>
            ))}
          </Stack>
        </Stack>
        <Text pl='-5rem' fontSize='sm' fontWeight={'700'}>
          Built with love on{' '}
          <Image
            display='inline-block'
            width='30px'
            src='/images/sol-logo.png'
          />{' '}
          Solana
        </Text>
      </Stack>
    </Box>
  )
}
