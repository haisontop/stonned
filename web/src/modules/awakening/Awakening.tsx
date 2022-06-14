import { Container, Box } from '@chakra-ui/react'
import Footer from './components/Footer'
import ApeAwakening from './components/ApeAwakening'
import Hero from './components/Hero'
import OverlayImages from './components/OverlayImages'
import { AwakenStatus, AwakeningContext } from './AwakeningProvider'
import { useContext } from 'react'
import OverlayImagesInprogress from './components/OverlayImagesInprogress'
import ApeAwakened from './components/ApeAwakened'
import { useQuery } from 'react-query'

export default function Awakening() {
  const { status } = useContext(AwakeningContext)

  return (
    <Container
      maxW='unset'
      minH='100vw'
      h='100%'
      pr='0'
      pl='0'
      position='relative'
      backgroundColor='#000'
    >
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignContent='center'
        alignItems='center'
      >
        <Hero></Hero>
        {status.status === AwakenStatus.AWAKEN && status.apeToAwaken ? <ApeAwakened /> : <ApeAwakening />}
      </Box>
      <Footer></Footer>
      <Container
        display={{ base: 'none', sm: 'none', md: 'none', lg: 'unset' }}
        pr='0'
        maxW='unset'
        pl='0'
        position='absolute'
        top='0'
      >
        {status.status === AwakenStatus.IN_PROGRESS ? (
          <OverlayImagesInprogress></OverlayImagesInprogress>
        ) : (
          <OverlayImages></OverlayImages>
        )}
      </Container>
    </Container>
  )
}
