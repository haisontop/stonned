import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Container,
  Heading,
  IconButton,
  Image,
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
import { ProjectRoadmapItem } from '@prisma/client'
const handleDragStart = (event: any) => event.preventDefault()

interface RoadmapCardProps {
  onDragStart?: (e: any) => void
  title: string
  roadmapItems: ProjectRoadmapItem[]
}

const RoadmapCard = (props: RoadmapCardProps) => {
  const cardBg = useColorModeValue('#fff', '#101011')

  const { onDragStart, title, roadmapItems } = props

  return (
    <Stack
      spacing={2}
      alignItems='flex-start'
      borderRadius={'10px'}
      boxShadow='0px 2px 10px rgba(0, 0, 0, 0.15)'
      p={4}
      mx={2}
      my={1}
      bg={cardBg}
    >
      <Text fontSize='1.5rem' fontWeight={600} color='#8E9BAF' mb='.5rem'>
        {title}
      </Text>
      <Stack>
        {(roadmapItems ?? []).map((roadmap, index) => (
          <React.Fragment key={roadmap.id}>
            <Text fontSize='1rem' fontWeight={600}>
              {roadmap.headline}
            </Text>
            <Text fontSize='.875rem'>{roadmap.description}</Text>
          </React.Fragment>
        ))}
      </Stack>
    </Stack>
  )
}

interface RoadmapCarouselProps {
  roadmapPeriods: ProjectDetailModel['roadmapPeriods']
}

export default function RoadmapCarousel(props: RoadmapCarouselProps) {
  const titleColor = useColorModeValue('#000', '#fff')
  const { roadmapPeriods } = props

  const carouselItems: React.ReactNode[] = React.useMemo(() => {
    return (roadmapPeriods ?? []).map((roadmapPeriod) => {
      return (
        <RoadmapCard
          key={roadmapPeriod.id}
          onDragStart={handleDragStart}
          title={roadmapPeriod.periodName}
          roadmapItems={roadmapPeriod.roadmapItems}
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
        Roadmap
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
