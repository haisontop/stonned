import React from 'react'
import {
  Text,
  Spinner,
  Link,
  ChakraProvider,
  Container,
  IconButton,
  Divider,
  Box,
} from '@chakra-ui/react'
import themeFlat from '../../../../themeFlat'
import Navbar from '../../../../modules/launch/components/Navbar'
import UserAvatarEdit from '../../../../modules/launch/components/UserAtatarEdit'
import AccountInfoEdit from '../../../../modules/launch/components/AccountInfoEdit'
import { AiOutlineLeft } from 'react-icons/ai'
import { useUser } from '../../../../modules/common/authHooks'
import { ManageNotifications } from '../../../../modules/launch/components/ManageNotifications'
import { NonAuth } from '../../../../components/NonAuth'

export default function ProfileEdit() {
  const { data, isLoading, isAuthed } = useUser()

  if (!isAuthed) {
    return <NonAuth />
  }

  if (isLoading || !data) {
    return <Spinner position='fixed' top='48%' left='49%'></Spinner>
  }

  return (
    <>
      <Navbar />

      <Container
        maxW={'82rem'}
        my={[6, 10, 12]}
        padding={['0 0.8rem', '0 2rem', '0 4rem', '0 4rem']}
      >
        <Link
          mb={9}
          display='flex'
          alignItems={'center'}
          href='/launch/profile'
          width='min-content'
        >
          <IconButton
            colorScheme='gray'
            aria-label='Plus'
            icon={<AiOutlineLeft size={'md'} />}
            border='unset'
            p='0.5rem'
          />
          <Text
            color='#888888'
            fontSize={'0.875rem'}
            ml='1rem'
            whiteSpace={'nowrap'}
            fontWeight={500}
          >
            Back to your Profile
          </Text>
        </Link>
        <UserAvatarEdit />
        <Divider m={'3.75rem 0 1.5rem'} />
        <AccountInfoEdit />
        <Divider m={'3.75rem 0 2rem'} />
        <ManageNotifications />
        <Box p={'3rem'} />
      </Container>
    </>
  )
}
