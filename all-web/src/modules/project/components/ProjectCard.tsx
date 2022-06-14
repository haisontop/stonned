import { Box, Heading, Image } from '@chakra-ui/react'
import { FC } from 'react'
import { Project } from '../../landing/types'

interface Props {
  project: Project
  onDragStart: (event: any) => any
}

export const ProjectCard: FC<Props> = ({ project, onDragStart }) => {
  return (
    <Box width={['100%', '100%', '12.5rem']} cursor='pointer' onDragStart={onDragStart}>
      <Image
        src={project.img}
        width={['100%', '100%', '12.5rem']}
        height={['100%', '100%', '12.5rem']}
        borderRadius='10px'
        objectFit='cover'
        transition='filter .15s ease-in-out'
        filter='grayscale(1)'
        _hover={{
          filter: 'unset',
        }}
      />
      <Heading fontSize={'xl'} fontWeight='700' color='black' mt='1rem' fontFamily="heading">
        {project.title}
      </Heading>
    </Box>
  )
}
