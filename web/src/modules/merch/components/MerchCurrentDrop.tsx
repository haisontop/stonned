import { Container } from '@chakra-ui/react'
import React, { useContext } from 'react'
import MerchFAQ from './FAQ'
import MerchFooter from './Footer'
import MerchHero from './Hero'
import { MerchDropContext, MerchDropStatus } from '../MerchDropContextProvider'
import MerchWaiting from './MerchWaiting'
import MerchNavbar from './Navbar'

export default function MerchCurrentDrop() {
  const { status } = useContext(MerchDropContext)

  const renderContent = React.useCallback(() => {
    if (status === MerchDropStatus.WAITING) {
      return (
        <>
          <MerchNavbar></MerchNavbar>
          <MerchWaiting />
        </>
      )
    }
    return (
      <>
        <MerchNavbar></MerchNavbar>
        <Container
          // h={['90vh', '100vh']}
          px={0}
          pt={['3rem', '6rem']}
          pos='relative'
          maxWidth='unset'
          justifyContent='center'
          alignItems='center'
        >
          <MerchHero></MerchHero>
        </Container>
        <MerchFAQ />
        <MerchFooter theme='light'></MerchFooter>
      </>
    )
  }, [status])

  return renderContent()
}
