import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { ProjectCard } from './components/ProjectCard'
import { Project } from './types'

export const Projects = () => {
  return (
    <Box>
      <Heading
        fontSize={['2xl', '4xl', '5xl']}
        fontWeight='700'
        color={'#888888'}
        maxWidth='58rem'
        css={{
          position: 'relative',
          '& > span': {
            color: 'black',
          },
        }}
        _before={{
          content: '""',
          position: 'absolute',
          left: 0,
          bottom: 0,
          display: 'block',
          width: '100%',
          height: '100%',
          backgroundColor: '#101011',
          transformOrigin: '0 bottom 0',
          transform: 'scaleY(0)',
          transition: '.4s ease-out',
          zIndex: -1,
        }}
        // _hover={{
        //   color: 'rgba(255, 255, 255, 0.7)',
        //   transition: '.4s ease-out',
        //   '&:before': {
        //     transform: 'scaleY(1)',
        //   },
        //   '& > span': {
        //     transition: '.4s ease-out',
        //     color: 'white',
        //   },
        // }}
      >
        ALL Blue is <span>not just an incubator.</span>
        <br />
        We are an <span>ecosystem</span> of the <span>best NFT projects</span>{' '}
        on Solana.
      </Heading>
      {/* <Text color='#888888' fontSize={'lg'} mt={['1rem', '1rem', '1.5rem']}>
        (Click on a project below to learn more)
      </Text> */}
      <Flex
        flexWrap={'wrap'}
        columnGap={['1rem', '2rem']}
        rowGap={['2rem', '4rem']}
        mt={['3rem', '4rem', '5.6rem']}
        justifyContent={{ base: 'center', md: 'start' }}
        maxWidth='71rem'
      >
        {PROJECTS.map((project, index) => {
          return <ProjectCard key={`project-${index}`} project={project} onDragStart={(event) => {event.preventDefault}} />
        })}
      </Flex>
    </Box>
  )
}

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
    img: '/images/projects/questionmark.png',
    title: 'Coming soon'
  }
]
