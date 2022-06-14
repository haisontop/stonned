import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Container,
  Heading,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  TextProps,
} from '@chakra-ui/react'
import React from 'react'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { whiten } from '@chakra-ui/theme-tools'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { useColorModeValue } from '@chakra-ui/system'
import { ProjectDetailModel } from '../types/project'
import { FaLinkedin, FaTwitter } from 'react-icons/fa'
import { ProjectTeamMember } from '@prisma/client'

const handleDragStart = (event: any) => event.preventDefault()

type TeamCardProps = ProjectTeamMember & {
  onDragStart?: (e: any) => void
}

const TeamCard = (props: TeamCardProps) => {
  const cardBg = useColorModeValue('#fff', '#101011')

  const { onDragStart, imageUrl,  } = props

  return (
    <Stack
      spacing={2}
      alignItems='flex-start'
      borderRadius={'10px'}
      boxShadow='0px 2px 10px rgba(0, 0, 0, 0.15)'
      p={4}
      my={1}
      mx={2}
      bg={cardBg}
    >
      {props.imageUrl ? (
        <Box>
          <Image
            src={props.imageUrl}
            height='166px'
            objectFit={'cover'}
            borderRadius='5px'
          />
        </Box>
      ) : ''}

      <Text fontSize='1rem' fontWeight={600}>
        {props.memberName}
      </Text>
      <Text fontSize='.875rem'>{props.description}</Text>
      {props.twitterUrl && (
          <Link
            href={`${props.twitterUrl}`}
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
        {props.linkedInUrl && (
          <Link
            href={`${props.linkedInUrl}`}
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
    </Stack>
  )
}

interface MemberModel {
  id: string
  imageURL: string
  title: string
  description: string
}

interface MeetTeamCarouselProps {
  members: ProjectDetailModel['teamMembers']
}

export default function MeetTeamCarousel(props: MeetTeamCarouselProps) {
  const titleColor = useColorModeValue('#000', '#fff')

  const { members } = props

  const carouselItems: React.ReactNode[] = React.useMemo(() => {
    return members.map((member) => {
      return (
        <TeamCard
          onDragStart={handleDragStart}
          {...member}
        />
      )
    })
  }, [])

  const renderPrevButton = ({ isDisabled }: { isDisabled: boolean }) => {
    return (
      <IconButton
        position={'absolute'}
        bottom={['-40px']}
        right={['55px', '70px']}
        border='none'
        borderRadius={'100%'}
        p={0}
        aria-label='To previous'
        icon={<ArrowBackIcon />}
      ></IconButton>
    )
  }

  const renderNextButton = ({ isDisabled }: { isDisabled: boolean }) => {
    return (
      <IconButton
        position={'absolute'}
        bottom={['-40px']}
        right={['0px', '15px']}
        border='none'
        borderRadius={'100%'}
        p={0}
        aria-label='To next'
        icon={<ArrowForwardIcon />}
      ></IconButton>
    )
  }

  return (
    <Stack justifyContent={'center'} width='100%' maxW={'100%'} pb={'4rem'}>
      <Heading
        color={titleColor}
        textAlign='left'
        fontWeight={600}
        fontSize={['1.25rem', '1.5rem']}
        mb={'1.25rem'}
      >
        Meet the Team
      </Heading>
      <Box margin={['1rem 0 0', '1rem 0 0', '2rem 0 0']} py={2}>
        <AliceCarousel
          mouseTracking
          disableDotsControls
          items={carouselItems}
          controlsStrategy='responsive'
          autoPlayInterval={20}
          keyboardNavigation
          animationType='slide'
          animationEasingFunction='ease-in-out'
          autoPlayDirection='ltr'
          renderPrevButton={renderPrevButton}
          renderNextButton={renderNextButton}
          responsive={{
            0: { items: 1.5 },
            405: {
              items: 2,
            },
            525: {
              items: 2.5,
            },
            640: {
              items: 3,
            },
            830: {
              items: 4,
            },
            991: {
              items: 2,
            },
            1100: {
              items: 2,
            },
            1280: {
              items: 3,
            },
          }}
        ></AliceCarousel>
      </Box>
    </Stack>
  )
}
