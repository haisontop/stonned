import React from 'react'

import { ChakraProvider, Container, Box, Stack } from '@chakra-ui/react'

import themeFlat from '../../themeFlat'
import Navbar from '../../modules/launch/components/Navbar'
import Hero from '../../modules/launch/components/Hero'
import LaunchListView from '../../modules/launch/components/LauchListView'

import { useQuery } from 'react-query'

import rpc from '../../utils/rpc'
import LaunchHeroSkeleton from '../../modules/launch/components/HeroSkeleton'

export default function Launch() {
  const { data: mintRes, isLoading } = useQuery(
    'getProjects',
    async () => await rpc.query('launch.getProjects')
  )

  return (
    <ChakraProvider resetCSS theme={themeFlat}>
      <Navbar></Navbar> 

      <Container width='100%' maxW='82rem' pos='relative' padding='0 2rem'>
        {isLoading ? (
          <LaunchHeroSkeleton />
        ) : (
          mintRes &&
          mintRes?.featured?.length > 0 && (
            <Hero launch={mintRes?.featured[0]}></Hero> 
          )
        )}

        <Box my={['4rem', '7.5rem']}>
          <Stack spacing={24}>
            {(isLoading || (mintRes?.current?.length || 0) > 0) && (
              <LaunchListView
                launches={mintRes?.current ?? ([] as any)}
                title='Live Launches 🚀'
                category='current'
                isLoading={isLoading}
              />
            )}
            {(isLoading || (mintRes?.upcoming?.length || 0) > 0) && (
              <LaunchListView
                launches={mintRes?.upcoming ?? ([] as any)}
                title='Future Launches 👀'
                category='upcoming'
                isLoading={isLoading}
              />
            )}
            <LaunchListView
              launches={mintRes?.ended ?? ([] as any)}
              title='Past Launches'
              hideTabs={true}
              category='ended'
              isLoading={isLoading}
            />
          </Stack>
        </Box>
      </Container>
    </ChakraProvider>
  )
}
