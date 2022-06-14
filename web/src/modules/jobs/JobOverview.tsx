import { Box, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { convertJobCategory } from './jobUtils'
import { Job } from './types'

interface JobOverviewProps {
  job: Job
}

export default function JobOverview(props: JobOverviewProps) {
  const { job } = props

  const jobTypeLabel = useMemo(() => {
    if (job.isFulltime) {
      return 'Full Time'
    }

    return 'Part Time'
  }, [job.isFulltime])

  return (
    <Box>
      <Box>
        <Heading
          color='#000'
          fontWeight={700}
          as='h1'
          fontSize={{ base: '2rem', lg: '2.5rem' }}
          transition='all .2s ease-in-out'
        >
          {job.title}
        </Heading>
        <HStack mt='0.875rem' spacing='1.5rem'>
          {job.isRemote && (
            <Text fontSize={'0.75rem'} fontWeight={600}>
              Remote
            </Text>
          )}

          <Text fontSize={'0.75rem'} fontWeight={600}>
            {jobTypeLabel}
          </Text>

          {convertJobCategory(job.category).map((category) => (
            <Text fontSize={'0.75rem'} fontWeight={600} key={category}>
              {category}
            </Text>
          ))}
        </HStack>
        <Text
          mt='1.75rem'
          fontSize={'0.875rem'}
          fontWeight={500}
          fontFamily='heading'
        >
          {/* {job.description} */}
          We are always looking for bright and motiviated individuals who strive to make their mark in this world. 
          We are guided by our builder mentality to create beautiful art, support a sprited community
          and craft freakin' dope products.
        </Text>
      </Box>
      <Stack
        spacing={['2rem', '2rem', '2.8rem']}
        mt={['2.5rem', '2.5rem', '4.5rem']}
      >
        {job.jobDescriptions &&
          job.jobDescriptions?.length > 0 &&
          job.jobDescriptions.map((description, index) => (
            <Box key={index}>
              <Text fontWeight={700} fontFamily='heading'>
                {description.title}
              </Text>
              <Text
                mt='1rem'
                fontSize={'0.875rem'}
                fontWeight={500}
                fontFamily='heading'
                dangerouslySetInnerHTML={{ __html: description.content }}
              ></Text>
            </Box>
          ))}
      </Stack>
    </Box>
  )
}
