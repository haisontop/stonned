import {
  Box,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react'
import Header from '../components/Header'
import Footer from '../modules/puff/Footer'
import Hero from '../modules/puff/Hero'
import Links from '../modules/puff/Links'
import Tokenomics from '../modules/puff/Tokenomics'
import Features from '../modules/puff/Features'
import PuffStats from '../modules/puff/Stats'
import { MainLayout } from '../layouts/MainLayout'

export default function Puff() {
  return (
    <MainLayout
      navbar={{
        colorTheme: 'dark',
        bgColor: '#0F182A',
        bgTransparent: true,
      }}
    >
      <Box
        background='#131737'
        color='white'
        fontFamily={'Poppins'}
        overflow='hidden'
      >
        <Hero />
        <Box
          width={['90%', '86%']}
          marginX={'auto'}
          zIndex={1}
          position='relative'
          overflow='visible'
        >
          <Features />
          <PuffStats zIndex={1} />
          <Box
            position='relative'
            background={'#0F182A'}
            clipPath={[
              'polygon(0 0, 100% 40%, 100% 100%, 0% 100%)',
              'polygon(0 0, 100% 80%, 100% 100%, 0% 100%)',
            ]}
            width='100vw'
            left={['-5%', '-8%']}
            marginTop={'-190px'}
            paddingTop={'200px'}
            zIndex={-1}
            overflow='visible'
            height='200px'
          ></Box>
          <Box
            position='relative'
            background={'#0F182A'}
            width='100vw'
            left={['-5%', '-8%']}
            overflow='visible'
          >
            <Box
              color='#fff'
              position={'relative'}
              width={['90%', '86%']}
              margin={'0 auto'}
            >
              <Tokenomics />
            </Box>
          </Box>
          <Box
            position={'relative'}
            clipPath={[
              'polygon(0 0, 100% 3%, 100% 100%, 0% 100%)',
              'polygon(0 0, 100% 12%, 100% 100%, 0% 100%)',
            ]}
            background={'#fff'}
            color={'#0F182A'}
            marginTop='-130px'
            paddingTop={'200px'}
            width='104vw'
            left={['-6%', '-8%']}
          >
            <Links />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  )
}

interface StatsCardProps {
  title: string
  stat: string
}
function StatsCard(props: StatsCardProps) {
  const { title, stat } = props
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}
    >
      <StatLabel fontWeight={'medium'} isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
        {stat}
      </StatNumber>
    </Stat>
  )
}
