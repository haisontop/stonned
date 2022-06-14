import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import AliceCarousel from 'react-alice-carousel'
import { BsArrowLeft, BsArrowRight, BsTwitter } from 'react-icons/bs'
import QuoteLeftIcon from './icons/QuoteLeftIcon'

const handleDragStart = (event: any) => event.preventDefault()

interface Collaborator {
  id: number
  img: string
  name: string
  role: string
  twitterId: string
  desc: string
}

const collaborators: Collaborator[] = [
  {
    id: 1,
    img: '/images/project/man-1.png',
    name: 'John Doe',
    role: 'Stoned Ape Crew Enthusiast',
    twitterId: '@robby_vac',
    desc: 'What do you think of the $3,600 Gucci Ghost? Also, you didn’t let me finish earlier. That image that Beeple was auctioning off',
  },
  {
    id: 2,
    img: '/images/project/man-2.png',
    name: 'John Doe',
    role: 'Stoned Ape Crew Enthusiast',
    twitterId: '@robby_vac',
    desc: 'What do you think of the $3,600 Gucci Ghost? Also, you didn’t let me finish earlier. That image that Beeple was auctioning off',
  },
  {
    id: 3,
    img: '/images/project/man-1.png',
    name: 'John Doe',
    role: 'Stoned Ape Crew Enthusiast',
    twitterId: '@robby_vac',
    desc: 'What do you think of the $3,600 Gucci Ghost? Also, you didn’t let me finish earlier. That image that Beeple was auctioning off',
  },
  {
    id: 4,
    img: '/images/project/man-2.png',
    name: 'John Doe',
    role: 'Stoned Ape Crew Enthusiast',
    twitterId: '@robby_vac',
    desc: 'What do you think of the $3,600 Gucci Ghost? Also, you didn’t let me finish earlier. That image that Beeple was auctioning off',
  },
]

const CollaboratorCard = (props: Collaborator) => {
  return (
    <Stack
      onDragStart={handleDragStart}
      alignItems={'flex-start'}
      rowGap={[1, 0, 0]}
      columnGap={[0, 0, 6]}
      cursor='pointer'
      flexDir={['column', 'column', 'row']}
    >
      <Image src={props.img} width='15rem' height='15rem'></Image>
      <Stack spacing={3}>
        <Text fontSize={'2rem'} fontWeight={600} lineHeight={1}>
          {props.name}
        </Text>
        <Text color='#7A7A7A' fontSize={'0.875rem'}>
          {props.role}
        </Text>
        <HStack
          bg='#1C8DEE'
          color='#fff'
          alignItems={'center'}
          justifyContent='center'
          borderRadius={'md'}
          py={2}
          px={4}
          width='fit-content'
        >
          <BsTwitter />
          <Text>{props.twitterId}</Text>
        </HStack>
        <HStack spacing={1}>
          <QuoteLeftIcon />
          <QuoteLeftIcon />
        </HStack>
        <Text color='#fff' fontSize={'1.5rem'} width='90%' lineHeight={1.5}>
          {props.desc}
        </Text>
      </Stack>
    </Stack>
  )
}

export default function CollaborationCarousel() {
  const smallDevice = useBreakpointValue({ base: true, md: false })
  const largeDevice = useBreakpointValue({ base: false, xl: false })

  let carouselItems: any[] | undefined = collaborators.map((collaborator) => (
    <CollaboratorCard {...collaborator} key={collaborator.id} />
  ))

  const renderPrevButton = ({ isDisabled }: { isDisabled: boolean }) => {
    return smallDevice ? null : (
      <Button
        position={'absolute'}
        top={['-90px', '-90px', '-115px', '-125px']}
        right={['55px', '15rem']}
        variant='ghost'
        border='unset'
      >
        <BsArrowLeft size={30} />
      </Button>
    )
  }

  const renderNextButton = ({ isDisabled }: { isDisabled: boolean }) => {
    return smallDevice ? null : (
      <Button
        position={'absolute'}
        top={['-90px', '-90px', '-115px', '-125px']}
        right={['0px', '10rem']}
        variant='ghost'
        border='unset'
      >
        <BsArrowRight size={30} />
      </Button>
    )
  }

  return (
    <Box margin='4rem 0'>
      <Text
        sx={{
          '& > span': {
            color: '#595FD7',
          },
        }}
        fontSize={['1.75rem', '1.75rem', '3rem']}
        mb='2rem'
        fontWeight={700}
        fontFamily='heading'
        lineHeight={[1.2, 1.2, 1.1]}
        width={["90%", "90%", "100%"]}
      >
        What <span>Stoned Ape Crew</span>
        <br /> said about <span>ALLBlue </span>
        collaboration?
      </Text>
      <Box minH={['100%', '100%', '260px']}>
        <AliceCarousel
          mouseTracking
          disableDotsControls
          items={carouselItems}
          controlsStrategy='responsive'
          autoPlayInterval={20}
          infinite
          keyboardNavigation
          animationType='slide'
          animationEasingFunction='linear'
          autoPlayDirection='ltr'
          renderPrevButton={renderPrevButton}
          renderNextButton={renderNextButton}
          paddingRight={largeDevice ? 300 : 0}
          responsive={{
            0: {
              items: 1,
            },
            600: {
              items: 1,
            },
          }}
        ></AliceCarousel>
      </Box>
    </Box>
  )
}
