import React from 'react'
import CicadaApe from '../../modules/cicada/components/cicadaApe'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from 'next'
import CicadaAuth from '../../modules/cicada/components/CicadaAuth'
import { Text } from '@chakra-ui/react'
import { sleep } from '../../utils/utils'
import { verifySignature } from '../../utils/middlewareUtils'
import { signingMessage } from '../../modules/cicada/cicadaConfig'
import { withSolana } from '../../modules/common/hoc/withSolana'
import {
  getCicadaAuthServerSideProps,
  isUserAllowedPageAndUpdate,
} from '../../modules/cicada/cicadaService'
import withCicadaAuth from '../../modules/cicada/withCicadaAuth'

export const getServerSideProps = getCicadaAuthServerSideProps(1, true)

function CicadaOnePage() {
  return <CicadaApe />
}

export default withSolana(withCicadaAuth(CicadaOnePage))
