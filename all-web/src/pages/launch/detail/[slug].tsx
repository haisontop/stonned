import React, { useEffect } from 'react'
import {
  Box,
  SimpleGrid,
  Spinner,
  ChakraProvider,
  Container,
  GridItem,
  Divider,
  Stack,
  StackDivider,
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import themeFlat from '../../../themeFlat'
import Navbar from '../../../modules/launch/components/Navbar'
import MintCard from '../../../modules/launch/components/MintCard'
import MintOverview from '../../../modules/launch/components/MintOverview'
import { useRouter } from 'next/router'
import HeroGallery from '../../../modules/launch/components/HeroGallery'
import ArtGallery from '../../../modules/launch/components/ArtGallery'
import CommentsList from '../../../modules/launch/components/CommentsList'
import { useUser } from '../../../modules/common/authHooks'
import { ExpertOpinion } from '../../../modules/launch/components/ExpertOpinion'
import rpc from '../../../utils/rpc'
import { useQuery } from 'react-query'
import { LaunchDetailSkeleton } from '../../../modules/launch/components/LaunchDetailSkeleton'
import { HeaderType } from '@prisma/client'
import HeroBanner from '../../../modules/launch/components/HeroBanner'

function LauchDetail() {
  const router = useRouter()
  const solanaAuth = useUser()
  const slug = (router.query.slug as string) || ''
  const { data: project, isLoading } = useQuery(
    ['getProjectDetail', slug],
    async () =>
      await rpc.query('launch.getProject', {
        projectUrlIdentifier: slug,
      }),
    {
      enabled: !!slug,
    }
  )

  if (router.isFallback) {
    return <Spinner position='fixed' top='48%' left='49%'></Spinner>
  }

  return (
    <ChakraProvider resetCSS theme={themeFlat}>
      <Navbar></Navbar>
      {isLoading ? (
        <LaunchDetailSkeleton />
      ) : (
        project && (
          <>
            <Container
              width='100vw'
              maxW='100vw'
              pos='relative'
              padding='0 2rem'
            >
              {project.headerType == HeaderType.GALLERY && (
                <HeroGallery project={project} gradientPosition='bottom' />
              )}
              {project.headerType != HeaderType.GALLERY && (
                <HeroBanner project={project} gradientPosition='bottom' />
              )}
            </Container>
            <Container
              maxW={'82rem'}
              my={[12, 12, 24]}
              padding={['0 2rem', '0 2rem', '0 4rem', '0 4rem']}
            >
              <SimpleGrid columns={[1, 1, 2, 5]} spacing={24}>
                <GridItem order={[1, 1, 0]} colSpan={[1, 1, 1, 3]}>
                  <MintOverview launch={project} />
                </GridItem>
                <GridItem colSpan={[1, 1, 1, 2]} position={'relative'}>
                  {project.mintingPeriods.length && (
                    <Box
                      width={['100%', '100%', '100%']}
                      mr='auto'
                      mt={[0, 0, 0, '-12rem']}
                      order={[0, 0, 1]}
                      zIndex={100}
                      position={[null, null, 'sticky']}
                      top='5rem'
                    >
                      <MintCard launch={project} />
                    </Box>
                  )}
                </GridItem>
              </SimpleGrid>
              <Divider my={'1.75rem'} />
              <ArtGallery galleryUrls={project.galleryUrls} />
              {project.promoVideo && (
                <>
                  <Divider my={'1.75rem'} />
                  <Box>
                    <video controls width='100%'>
                      <source src={project.promoVideo} type='video/mp4' />
                    </video>
                  </Box>
                </>
              )}
              {/* <Divider m={'4rem 0 2.5rem'} />
              <Stack
                direction={['column', 'column', 'row']}
                divider={<StackDivider />}
                spacing={['2rem', '3rem', '4rem']}
              >
                <Box flexGrow={1} maxW={['100%', '100%', 'calc(50% - 4rem)']}>
                  <ExpertOpinion projectId={project.id} />
                </Box>
                <Box flexGrow={1} maxW={['100%', '100%', 'calc(50% - 4rem)']}>
                  <CommentsList projectId={project.id} />
                </Box>
              </Stack> */}
            </Container>
          </>
        )
      )}
    </ChakraProvider>
  )
}

const WalletConnectionProvider = dynamic(
  () => import('../../../components/WalletConnectionProvider'),
  {
    ssr: false,
  }
)

export default LauchDetail
