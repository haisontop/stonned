import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import _, { drop } from 'lodash'
import React, { useContext, useMemo } from 'react'
import { useAsync } from 'react-use'
import { GradientButton } from '../../../components/GradientButton'
import { getNftsFromOwnerByCreators } from '../../../utils/splUtils'
import { trpc } from '../../../utils/trpc'
import DropTitle from './DropTitle'
import { merchConfig } from '../merchConfig'
import { MerchDropContext, MerchDropStatus } from '../MerchDropContextProvider'
import MerchWaiting from './MerchWaiting'
import Pieces from './Pieces'
import PurchaseToken from './PurchaseToken'
import TimingSection from './TimingSection'
import { useProduct } from '../merchHooks'

export default function MerchHero() {
  const { status } = useContext(MerchDropContext)

  const renderContent = React.useCallback(() => {
    const product = useProduct()
    if (status === MerchDropStatus.TOKEN_PURCHASE) {
      return (
        <Stack spacing={[6, 10]}>
          <DropTitle label={product.data?.name!} />
          <Grid
            templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
            gap={[6, 20]}
          >
            <GridItem alignItems={'center'} display='flex'>
              <Image
                width={['300px', null, '400px']}
                height={['300px', null, '400px']}
                src={product.data?.image}
                /*  fallback={
                  <Flex
                    width='250px'
                    height='250px'
                    alignItems={'center'}
                    justifyContent='center'
                  >
                    <Spinner alignSelf={'center'} />
                  </Flex>
                } */
                /* maxWidth='90rem' */
                zIndex='1'
                mx='auto'
              />

              {/*  <TimingSection /> */}
            </GridItem>
            <GridItem display={'flex'} alignItems={'center'}>
              <PurchaseToken />
            </GridItem>
          </Grid>
        </Stack>
      )
    }

    if (status === MerchDropStatus.WAITING) {
      return null
    }

    return (
      <>
        <Image
          src='https://ipfs.io/ipfs/QmTfY1YAPhibkHL3z1WWrzg1ydsM4mzJneH1gP3UwXiMuF?ext=gif'
          width='806px'
          maxWidth='90rem'
          zIndex='1'
          mx='auto'
        ></Image>
        <DropTitle label={'SAC OG Box'} />
        <TimingSection />
        <Pieces pieceCount={600} />
      </>
    )
  }, [status])

  return (
    <Container
      // h={['90vh', '100vh']}
      pt={['3rem', '3rem']}
      pos='relative'
      maxWidth='unset'
      justifyContent='center'
      alignItems='center'
    >
      <Container maxW='6xl'>
        <Stack spacing={[20]} alignItems='center'>
          {renderContent()}
        </Stack>
      </Container>
    </Container>
  )
}

function useNavigate() {
  throw new Error('Function not implemented.')
}
