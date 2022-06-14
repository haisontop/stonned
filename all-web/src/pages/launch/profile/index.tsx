import React from 'react'
import { Spinner, Divider, Container } from '@chakra-ui/react'
import themeFlat from '../../../themeFlat'
import Navbar from '../../../modules/launch/components/Navbar'
import UserOverview from '../../../modules/launch/components/UserOverview'
import WalletList from '../../../modules/launch/components/WalletList'
import WalletProjectList from '../../../modules/launch/components/WalletProjectList'
import { useUser } from '../../../modules/common/authHooks'
import { NonAuth } from '../../../components/NonAuth'

export default function Profile() {
  const { data, isLoading, isAuthed } = useUser()

  if (!isAuthed) {
    return <NonAuth />
  }

  if (isLoading || !data) {
    return <Spinner position='fixed' top='48%' left='49%'></Spinner>
  }

  return (
    <>
      <Navbar></Navbar>
      <Container
        maxW={'82rem'}
        my={[0, 12, 24]}
        padding={['0 2rem', '0 2rem', '0 4rem', '0 4rem']}
      >
        <UserOverview user={data} />
        <Divider m={['4.375rem 0 1.75rem']} />
        <WalletList />
        <Divider m={['5rem 0 2rem']} />
        <WalletProjectList />
      </Container>
    </>
  )
}
