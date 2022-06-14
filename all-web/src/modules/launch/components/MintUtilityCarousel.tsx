import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Container,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  TextProps,
} from '@chakra-ui/react'
import React, { useRef } from 'react'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { whiten } from '@chakra-ui/theme-tools'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { useColorModeValue } from '@chakra-ui/system'
import { ProjectDetailModel } from '../types/project'

const handleDragStart = (event: any) => event.preventDefault()

interface UtilityCardProps {
  onDragStart?: (e: any) => void
  iconURL: string
  title: string
  description: string
}

const UtilityCard = (props: UtilityCardProps) => {
  const { onDragStart, iconURL, title, description } = props
  const cardBg = useColorModeValue('#fff', '#101011')

  return (
    <Stack
      spacing={2}
      alignItems='flex-start'
      borderRadius={'10px'}
      boxShadow='0px 2px 10px rgba(0, 0, 0, 0.15)'
      p={4}
      my={1}
      mx={2}
      mr={5}
      bg={cardBg}
    >
      {iconURL ? (
        <Avatar name={props.title} src={iconURL} size='sm' />
      ) : ''}
      <Text fontSize='1rem' fontWeight={600}>
        {title}
      </Text>
      <Text fontSize='.875rem'>{description}</Text>
    </Stack>
  )
}

interface UtilityModel {
  id: string
  iconURL: string
  title: string
  description: string
}

interface MintUtilityCarouselProps {
  utilities: ProjectDetailModel['utilities']
}

export default function MintUtilityCarousel(props: MintUtilityCarouselProps) {
  const titleColor = useColorModeValue('#000', '#fff')
  const { utilities } = props

  const carouselItems: React.ReactNode[] = React.useMemo(() => {
    return utilities.map((utility) => {
      return (
        <UtilityCard
          onDragStart={handleDragStart}
          iconURL={utility.utilityIconUrl ? utility.utilityIconUrl : ''}
          title={utility.headline}
          description={utility.description}
        />
      )
    })
  }, [])

  const utilityElemBox = useRef()

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
        Utilities
      </Heading>
      <Box>
        <AliceCarousel
          mouseTracking
          disableDotsControls
          items={carouselItems}
          autoPlayInterval={20}
          keyboardNavigation
          animationType='slide'
          animationEasingFunction='ease-in-out'
          autoPlayDirection='ltr'
          renderPrevButton={renderPrevButton}
          renderNextButton={renderNextButton}
          infinite={true}
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
