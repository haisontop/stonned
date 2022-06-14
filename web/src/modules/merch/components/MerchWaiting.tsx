import {
  Box,
  Container,
  Heading,
  Icon,
  Image,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { GradientButton } from '../../../components/GradientButton'
import MerchFAQ from './FAQ'
import { linksIcons } from './Footer'

export default function MerchWaiting() {
  return (
    <>
      <Container
        h={['90vh', '100vh']}
        pt={['8rem', '10rem']}
        pos='relative'
        maxWidth='unset'
        background='black'
        alignItems={'center'}
        justifyContent='center'
      >
        <Stack
          zIndex='100'
          display={'flex'}
          justifyContent='center'
          alignItems={'center'}
          spacing={12}
        >
          <Image
            src='/images/sac_logo_with_text.png'
            width='444px'
            maxWidth='70vw'
            zIndex='1'
          ></Image>
          <Text color='#fff'>06/03/2022 9PM UTC</Text>

          <Stack spacing={0}>
            {/* <Link
            px={2}
            href={'#'}
            fontSize={{ lg: 'sm', xl: 'md' }}
            fontWeight={500}
            color={"#fff"}
            display='inline-block'
            w='100%'
            textAlign='center'
          >
            Previous Drops
          </Link> */}
            <Link
              px={2}
              href={'/'}
              fontSize={{ lg: 'sm', xl: 'md' }}
              fontWeight={500}
              color={'#fff'}
              display='inline-block'
              w='100%'
              textAlign='center'
            >
              Back to Homepage
            </Link>
          </Stack>

          <Stack
            direction='row'
            alignItems='center'
            justifyContent={{ base: 'center', md: 'flex-end' }}
            spacing={5}
            flex='1'
          >
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
                >
                  {linkIcon.icon}{' '}
                </Icon>
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
      <MerchFAQ />
    </>
  )
}

function useNavigate() {
  throw new Error('Function not implemented.')
}
