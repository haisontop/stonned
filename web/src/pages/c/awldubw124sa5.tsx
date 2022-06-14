import React from 'react'
import { getCicadaAuthServerSideProps } from '../../modules/cicada/cicadaService'
import CicadaAuth from '../../modules/cicada/components/CicadaAuth'
import CicadaEmail from '../../modules/cicada/components/cicadaEmail'
import withCicadaAuth from '../../modules/cicada/withCicadaAuth'
import { withSolana } from '../../modules/common/hoc/withSolana'

export const getServerSideProps = getCicadaAuthServerSideProps(2)

function CicadaTwoPage(props: any) {
  return <CicadaEmail />
}

export default withSolana(withCicadaAuth(CicadaTwoPage))
