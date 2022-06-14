import { Box, Divider, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { convertJobCategory } from './jobUtils'
import { Job } from './types'

interface JobCardProps {
  job: Job
}

export default function JobCard(props: JobCardProps) {
  const { job } = props
  const router = useRouter()

  const jobTypeLabel = useMemo(() => {
    if (job.isFulltime) {
      return 'Full Time'
    }

    return 'Part Time'
  }, [job.isFulltime])

  const handleClickCard = () => {
    router.push(`/careers/${job.id}`)
  }

  // const mainCategory = React.useMemo(() => {
  //   const categories = convertJobCategory(job.category)
  //   if (categories && categories.length > 0) {
  //     return categories[0]
  //   } else {
  //     return null
  //   }
  // }, [job.category])

  const jobCategoryColor = {
    Creative: '#F1C40F',
    Marketing: '#147D5A',
    Dev: '#3498DB',
    Design: '#48069A'
  }

  console.log(job.category)

  return (
    <Stack
      bg='#F9F9F9'
      pt={['2rem', '2rem', '5rem']}
      pb={['2rem', '2rem']}
      px='2rem'
      borderRadius={'10px'}
      cursor='pointer'
      onClick={handleClickCard}
      transition='all .2s ease-in-out'
      _hover={{
        boxShadow: '2px 8px 15px 10px rgb(0 0 0 / 5%)',
      }}
    >
      <Heading
        color='#000'
        fontWeight={700}
        as='h1'
        fontSize={{ base: '1rem', md: '1.5rem' }}
        transition='all .2s ease-in-out'
      >
        {job.title}
      </Heading>
      <HStack>
        {job.isRemote && <Text>Remote</Text>}
        <Box color="#EDEDED">|</Box>
        <Text>{jobTypeLabel}</Text>
      </HStack>
      {job.category && (
        <Box
          bg={jobCategoryColor[job.category as keyof typeof jobCategoryColor]}
          width='fit-content'
          px='0.5rem'
          py='0rem'
          borderRadius={'3px'}
        >
          <Text color='#fff' fontSize={'0.75rem'}>
            {job.category}
          </Text>
        </Box>
      )}
    </Stack>
  )
}
