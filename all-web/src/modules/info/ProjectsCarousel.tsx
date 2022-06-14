import { Box, Button, Container, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import AliceCarousel from 'react-alice-carousel'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { ProjectCard } from '../landing/components/ProjectCard'
import { Project } from '../landing/types'
const handleDragStart = (event: any) => event.preventDefault()

const PROJECTS: Project[] = [
  {
    img: '/images/projects/sac.gif',
    title: 'Stoned Ape Crew',
  },
  {
    img: '/images/projects/nukedapes.png',
    title: 'Nuked Apes',
  },
  {
    img: '/images/projects/bestbuds.png',
    title: 'Best Buds',
  },
  {
    img: '/images/projects/maryjanes.png',
    title: 'Mary Janes',
  },
  {
    img: '/images/projects/bongheads.png',
    title: 'Bongheads',
  },
  {
    img: '/images/projects/questionmark.png',
    title: 'Coming soon',
  },
]

export default function ProjectsCarousel() {
  let carouselItems: any[] | undefined = PROJECTS.map((project) => (
    <ProjectCard
      key={`project-${project.title}`}
      project={project}
      onDragStart={handleDragStart}
    />
  ))

  const renderPrevButton = ({ isDisabled }: { isDisabled: boolean }) => {
    return (
      <Button
        position={'absolute'}
        top={['-90px', '-90px', '-115px', '-125px']}
        right={['55px', '80px']}
        variant='ghost'
        border='unset'
      >
        <BsArrowLeft size={30}/>
      </Button>
    )
  }

  const renderNextButton = ({ isDisabled }: { isDisabled: boolean }) => {
    return (
      <Button
        position={'absolute'}
        top={['-90px', '-90px', '-115px', '-125px']}
        right={['0px', '15px']}
        variant='ghost'
        border='unset'
      >
        <BsArrowRight size={30}/>
      </Button>
    )
  }

  return (
    <Container
      justifyContent={'center'}
      maxW='container.xl'
      px={0}
      // pt={[0, 0, '30rem']}
    >
      <Heading
        textAlign='left'
        fontWeight={700}
        fontSize={['2rem', '2rem', '3rem']}
        mb={4}
        fontFamily="heading"
      >
        Our Projects
      </Heading>

      <Box py={4}>
        <Box margin={['1rem 0 0', '1rem 0 0', '2rem 0 0']}>
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
            responsive={{
              0: {
                items: 1,
              },
              400: {
                items: 1,
              },
              550: {
                items: 2,
              },
              800: {
                items: 3,
              },
              1200: {
                items: 3.5,
              },
              1400: {
                items: 4,
              },
              1700: {
                items: 5,
              },
              2000: {
                items: 5,
              },
              2500: {
                items: 8,
              },
            }}
          ></AliceCarousel>
        </Box>
      </Box>
    </Container>
  )
}
