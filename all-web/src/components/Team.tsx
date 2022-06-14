import {
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  Icon,
  useColorModeValue,
  Box,
  HStack,
  useDimensions,
  useBreakpoint,
  useBreakpointValue,
} from '@chakra-ui/react'
import { BsLinkedin, BsTwitter } from 'react-icons/bs'
import React, { ReactElement, useMemo } from 'react'
import Card from './Card'
import { sliceIntoChunks } from '../utils/utils'
import * as _ from 'lodash'

interface TeamProps {
  text: string
  iconBg: string
  icon?: ReactElement
}
const team = [
  {
    name: 'ABO',
    position: 'Stoned Artist',
    img: '/images/abo.jpg',
    twitter: 'https://twitter.com/stoner0015',
  },
  {
    name: 'PFO',
    position: 'Head of Stoners & Dev',
    img: '/images/pfo.jpg',
    twitter: 'https://twitter.com/pfo_collector',
  },
  // {
  //   name: 'APO7 / Art',
  //   img: 'https://pbs.twimg.com/profile_images/1452410305519263749/WpCu57hh_400x400.jpg',
  //   twitter: 'https://twitter.com/stoner0015',
  // },
  /* {
    name: 'APO',
    position: 'Stoned Artist',
    img: '/images/apo.jpg',
  }, */
  {
    name: 'MSF',
    position: 'Stoned Lead Dev',
    img: '/images/sciencebong.jpg',
    twitter: 'https://twitter.com/NftNoob69',
  },
  {
    name: 'Ir◎n_S◎L',
    position: 'Community Manager',
    img: '/images/iron_chef.jpg',
    twitter: 'https://twitter.com/Ir0n_S0L',
  },

  {
    name: 'BCM',
    position: 'Community & Dev',
    img: '/images/max.jpg',
    twitter: 'https://twitter.com/coffeeshop_host',
  },
  {
    name: 'Clemens',
    position: 'Strategy & Technical Analyst',
    img: '/images/clemens.png',
    twitter: 'https://twitter.com/CCClemensss',
  },
  {
    name: 'Stoned Emilio',
    position: `Social Media`,
    img: 'https://pbs.twimg.com/profile_images/1479727653515145220/ez5yoowk_400x400.jpg',
    twitter: 'https://twitter.com/emilioofh',
  },
  {
    name: 'Ēlevated Ēquity',
    position: 'Business Dev',
    img: '/images/elevated.jpeg',
    twitter: 'https://twitter.com/elevatedequity',
  },
  {
    name: 'Famouke',
    position: 'Ambassador',
    img: 'https://pbs.twimg.com/profile_images/1478874861275529216/hHCbTf3D_400x400.jpg',
    twitter: 'https://twitter.com/Ibrahimfamouke',
  },
  // {
  //   name: 'BCM / Dev',
  //   img: '/images/max.jpg',
  //   twitter: 'https://twitter.com/NftNoob69',
  // },
  // {
  //   name: 'CLF / Dealer',
  //   img: '/images/clemens.png',
  //   twitter: 'https://twitter.com/CCClemensss',
  // },
]

export default function Team() {
  const columns = useBreakpointValue({ base: 2, md: 3, lg: 4, xl: 6 })

  const chunks = useMemo(() => {
    return _.chunk(team, columns)
  }, [columns])
  return (
    <Stack id='team' paddingY='1rem' spacing='2rem'>
      <Heading fontSize='5xl' fontWeight={500} textAlign='center'>
        Team
      </Heading>

      <SimpleGrid
        columns={[1, 2, 3]}
        width={['90%', '70%', '60%']}
        mx='auto !important'
        spacing={{ md: '6' }}
        alignItems={'center'}
      >
        {team.map((t, i) => {
          return (
            <Stack
              key={i}
              p='0.5rem'
              alignItems='center'
              justifyContent={'center'}
              mx='auto'
            >
              <Image
                src={t.img}
                height={{ base: '130px', md: '170px' }}
                width={{ base: '130px', md: '170px' }}
                borderRadius='50%'
              />
              <Text fontSize='xl' textAlign='center' fontFamily='heading'>
                {t.name}
              </Text>
              <Text fontSize='md' textAlign='center' fontFamily='heading'>
                {t.position}
              </Text>
              <Stack direction='row' pb='0.5rem'>
                {t.twitter && (
                  <Box target='_blank' as='a' href={t.twitter}>
                    <BsTwitter color='#1DA1F2' />
                  </Box>
                )}
                {/*  {t.linkedIn && (
                      <Box target='_blank' as='a' href={t.linkedIn}>
                        <BsLinkedin color='#0072b1' />
                      </Box>
                    )} */}
              </Stack>
            </Stack>
          )
        })}
      </SimpleGrid>
    </Stack>
  )
}
