import { Box, Text, Image, Link } from '@chakra-ui/react'
import React, { ReactElement, useMemo } from 'react'
import AliceCarousel from 'react-alice-carousel'
import * as _ from 'lodash'
import { RiTwitterLine } from 'react-icons/ri'
import { FaLinkedin, FaTwitter } from 'react-icons/fa'

export interface TeamProps {
  name: string
  position: string
  img: string
  twitter?: string
  linkedin?: string
}
const team: TeamProps[] = [
  {
    name: 'ABO',
    position: 'Head of Art',
    img: '/images/team/abo.jpeg',
    twitter: 'stoner0015',
    linkedin: 'anh-bui-graphicrecording'
  },
  {
    name: 'PFO',
    position: 'Head of Everything',
    img: '/images/team/pfo.jpeg',
    twitter: 'pfo_sac',
  },
  {
    name: 'MTS',
    position: 'Head of Development',
    img: '/images/team/mts.jpeg',
    twitter: 'NftNoob69',
  },
  {
    name: 'CFO',
    position: 'Head of Marketing',
    img: '/images/team/cfo.jpeg',
    twitter: '',
  },
  {
    name: 'BCM',
    position: 'Head of Community',
    img: '/images/team/bcm.jpeg',
    twitter: 'coffeeshop_host',
  },
  {
    name: 'Emilio',
    position: `Head of IRL Products`,
    img: '/images/team/emilio.jpeg',
    twitter: 'emilioofh',
  },
  {
    name: 'MLE',
    position: 'Head of Digital Products',
    img: '/images/team/mle.jpeg',
    twitter: 'mle_sac',
  },
  {
    name: 'Jkov',
    position: 'Head of Corporate Development',
    img: '/images/team/jkov.jpeg',
    twitter: 'jkovlov',
  },
  {
    name: 'Guildor',
    position: 'Head of HR',
    img: '/images/team/guildor.jpeg',
    twitter: 'CptGuildor',
  },
  {
    name: 'Ir0n_S0l',
    position: 'Community Manager',
    img: '/images/team/iron.jpeg',
    twitter: 'ir0n_S0L',
  },
  {
    name: 'TacTickled',
    position: 'Alpha Manager',
    img: '/images/team/tac.jpeg',
    twitter: 'TacTickled',
  },
  {
    name: 'Zay-T',
    position: 'PR',
    img: '/images/team/zayt.jpeg',
    twitter: 'whoiszayt',
  },
]

const TeamItem: React.FC<TeamProps> = (props) => {
  return (
    <Box
      p='0.5rem'
      alignItems='center'
      justifyContent={'center'}
      mx='auto'
      width={['100vw', , '220px'] as any}
    >
      <Image
        m='0 auto'
        src={props.img}
        height={{ base: '200px', md: '200px' }}
        width={{ base: '200px', md: '200px' }}
        borderRadius='50%'
      />
      <Text
        mt='30px'
        fontSize='xl'
        textAlign='center'
        fontFamily={'Montserrat, sans-serif'}
        fontWeight={700}
      >
        {props.name}
      </Text>
      <Text
        fontSize='md'
        textAlign='center'
        fontFamily={'Montserrat, sans-serif'}
        fontWeight={500}
      >
        {props.position}
      </Text>
        {props.twitter && (
          <Link
            href={`https://twitter.com/${props.twitter}`}
            target='blank'
            textAlign='center'
            mx='.25rem'
            color='#AAA'
            _hover={{
              color: '#1DA1F2',
            }}
          >
            <FaTwitter size='18px' style={{ display: 'inline' }} />
          </Link>
        )}
        {props.linkedin && (
          <Link
            href={`https://www.linkedin.com/in/${props.linkedin}`}
            target='blank'
            textAlign='center'
            mx='.25rem'
            color='#AAA'
            _hover={{
              color: '#0e76a8',
            }}
          >
            <FaLinkedin size='18px' style={{ display: 'inline' }} />
          </Link>
        )}
    </Box>
  )
}

const items: any[] = team.map((item, i) => {
  return (
    <TeamItem
      name={item.name}
      position={item.position}
      img={item.img}
      twitter={item.twitter}
      linkedin={item.linkedin}
      key={i}
    />
  )
})

export default function TeamCarousel() {
  return (
    <Box>
      <AliceCarousel
        items={items}
        // controlsStrategy='responsive'
        mouseTracking={true}
        responsive={{
          0: {
            items: 1,
          },
          500: {
            items: 2,
          },
          800: {
            items: 3,
          },
          1200: {
            items: 5,
          },
          1450: {
            items: 6,
          },
        }}
      />
    </Box>
  )
}
