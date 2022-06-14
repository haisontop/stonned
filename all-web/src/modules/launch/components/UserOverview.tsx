import {
  Avatar,
  Button,
  Heading,
  HStack,
  Icon,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { User } from '@prisma/client'
import React, { FC } from 'react'
import { RiTwitterFill } from 'react-icons/ri'
import { useUser } from '../../../modules/common/authHooks'

interface UserOverviewProps {
  user: User
}

const UserOverview: FC<UserOverviewProps> = ({ user }) => {
  const { data } = useUser()
  const linkColor = useColorModeValue('#393E46', '#888888')

  return (
    <HStack justifyContent={'space-between'}>
      <HStack spacing={4}>
        <Avatar
          size='xl'
          sx={{ width: '5.625rem', height: '5.625rem' }}
          src={data?.profilePictureUrl ?? undefined}
        ></Avatar>
        <Stack>
          <Heading fontSize={'1.5rem'} fontWeight='600'>
            {user.username || '---'}
          </Heading>
          <HStack color={'#888888'} gap='1rem'>
            <Text fontSize={'0.75rem'}>Verified</Text>
            {user.twitterUrl && (
              <Link href={user.twitterUrl} isExternal>
                <Icon
                  transition='ease-in-out all .2s'
                  fontSize='1.5rem'
                  cursor={'pointer'}
                >
                  <RiTwitterFill />
                </Icon>
              </Link>
            )}
          </HStack>
        </Stack>
      </HStack>
      <Link href='/launch/profile/edit'>
        <Button
          variant='link'
          rounded={'unset'}
          border='unset'
          color={linkColor}
          fontSize={'0.875rem'}
          textDecoration={'underline'}
          fontWeight={400}
        >
          Edit Profile
        </Button>
      </Link>
    </HStack>
  )
}

export default UserOverview
