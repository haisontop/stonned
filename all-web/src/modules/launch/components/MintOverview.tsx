import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  IconButton,
  Link,
  Progress,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { Project } from '@prisma/client'
import React, { useCallback, useMemo } from 'react'
import { BsGlobe, BsTriangleFill } from 'react-icons/bs'
import { FaDiscord, FaHeart } from 'react-icons/fa'
import { MdCheck, MdFingerprint } from 'react-icons/md'
import { RiInstagramLine, RiTwitterLine } from 'react-icons/ri'
import { trpc } from '../../../utils/trpc'
import { ProjectDetailModel } from '../types/project'
import ChipTag from './ChipTag'
import CreatorWithAvatar from './CreatorWithAvatar'
import LabelTitle from './LabelTitle'
import { LaunchModel } from './LaunchCard'
import MeetTeamCarousel from './MeetTeamCarousel'
import MintUtilityCarousel from './MintUtilityCarousel'
import RoadmapCarousel from './RoadmapCarousel'
import toast from 'react-hot-toast'
import { useUser } from '../../common/authHooks'

export const linksIcons = [
  {
    label: 'Twitter',
    href: 'https://twitter.com/stonedapecrew',
    icon: <RiTwitterLine />,
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/stonedapecrew',
    icon: <FaDiscord />,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/stonedapesofficial/',
    icon: <RiInstagramLine />,
  },
]

interface MintOverviewProps {
  launch: ProjectDetailModel
}

export default function MintOverview(props: MintOverviewProps) {
  const { launch } = props
  const { data: user } = useUser()
  const { colorMode } = useColorMode()
  const iconColor = useColorModeValue('#000000', '#FFFFFF')

  const { data: votes, refetch } = trpc.useQuery(
    [
      'launch.getProjectLikes',
      {
        projectId: launch.id,
      },
    ],
    {
      enabled: !!launch.id,
    }
  )
  const likeProject = trpc.useMutation('launch.likeProject', {
    onSuccess: () => {
      refetch()
      toast.success('success')
    },
    onError: () => {
      toast.error('failed')
    },
  })

  const likePercent = useMemo(() => {
    if (!votes) return ''
    if (votes.length === 0) return '0%'
    const likesCount = votes.filter((vote) => vote.isUpvote).length
    let percent = ((likesCount / votes.length) * 100).toFixed(2)
    if (percent.endsWith('.00')) percent = parseInt(percent).toString()
    return percent + '%'
  }, [votes])

  const handleLikeProject = useCallback(
    (like: boolean) => {
      if (!user) return

      likeProject.mutate({
        projectId: launch.id,
        userId: user?.id,
        like,
      })
    },
    [likeProject, user, launch.id]
  )

  return (
    <Box>
      <Stack width='100%' spacing={4}>
        <CreatorWithAvatar
          name={launch.creatorName ?? ''}
          isAwarded={launch.isIncubator ?? false}
          size='sm'
          avatarURL={launch.logoUrl ?? ''}
          showSuper
        />
        <Text fontSize={['2rem', '2.25rem']} fontWeight='700'>
          {launch.projectName}
        </Text>
        <HStack width='100%' justifyContent={'start'} gap={4} flexWrap='wrap'>
          {launch.isVerified && (
            <ChipTag
              label='Verified'
              color={colorMode === 'dark' ? '#E7EEDD' : '#152F33'}
              bg={colorMode === 'dark' ? '#152F33' : '#E7EEDD'}
              icon={
                <MdCheck color={colorMode === 'dark' ? '#E7EEDD' : '#152F33'} />
              }
            />
          )}
          {launch.isDoxxed && (
            <ChipTag
              label='Doxxed'
              color={colorMode === 'dark' ? '#E2E3FF' : '#595FD7'}
              bg={colorMode === 'dark' ? '#595FD7' : '#E2E3FF'}
              icon={
                <MdFingerprint
                  color={colorMode === 'dark' ? '#E2E3FF' : '#595FD7'}
                />
              }
            />
          )}

          {/*<ChipTag
          label={`XYZ Score: ${xyzScore}%`}
          color='#00509A'
          bg='#DEF4FF'
        />*/}
        </HStack>

        {/* Save Project will be implemented later */}
        {/* <HStack pt={'1rem'} spacing={'3rem'}>
          <HStack>
            <Icon as={FaHeart} color='#EEEFEE' width={'2rem'} height='2rem' />
            <Text fontSize={['1rem']} fontWeight={600}>
              Save
            </Text>
          </HStack>
          <HStack spacing={0}>
            <IconButton
              aria-label='like-project'
              icon={<BsTriangleFill />}
              variant='link'
              color={'black'}
              onClick={() => handleLikeProject(true)}
              pointerEvents={user?.id ? undefined : 'none'}
            />
            <Text fontSize={['1rem']} fontWeight={600}>
              {likePercent} Likes
            </Text>
            <IconButton
              aria-label='like-project'
              icon={<BsTriangleFill />}
              transform='rotate(180deg)'
              variant='link'
              color={'#EEEFEE'}
              onClick={() => handleLikeProject(false)}
              pointerEvents={user?.id ? undefined : 'none'}
            />
          </HStack>
        </HStack> */}

        <Text
          fontSize='1rem'
          fontWeight={500}
          lineHeight={'1.5rem'}
          pt={['1rem', '2rem']}
        >
          {launch.projectDescription}
        </Text>

        <Stack
          direction='row'
          alignItems='center'
          justifyContent={{ base: 'flex-start' }}
          spacing={5}
          flex='1'
        >
          {launch.twitterUrl && (
            <Link href={launch.twitterUrl} target='_blank' role='group'>
              <Icon
                color={iconColor}
                transition='ease-in-out all .2s'
                _groupHover={{
                  color: 'textGrey',
                }}
                fontSize='1.5rem'
              >
                <RiTwitterLine />
              </Icon>
            </Link>
          )}
          {launch.discordUrl && (
            <Link href={launch.discordUrl} target='_blank' role='group'>
              <Icon
                color={iconColor}
                transition='ease-in-out all .2s'
                _groupHover={{
                  color: 'textGrey',
                }}
                fontSize='1.5rem'
              >
                <FaDiscord />
              </Icon>
            </Link>
          )}
          {launch.websiteUrl && (
            <Link href={launch.websiteUrl} target='_blank' role='group'>
              <Icon
                color={iconColor}
                transition='ease-in-out all .2s'
                _groupHover={{
                  color: 'textGrey',
                }}
                fontSize='1.5rem'
              >
                <BsGlobe />
              </Icon>
            </Link>
          )}
        </Stack>
      </Stack>
      <Divider my={'1.75rem'} />
      <MintUtilityCarousel utilities={launch.utilities} />
      <Divider my={'1.75rem'} />
      <MeetTeamCarousel members={launch.teamMembers} />
      <Divider my={'1.75rem'} />
      <RoadmapCarousel roadmapPeriods={launch.roadmapPeriods} />
    </Box>
  )
}
