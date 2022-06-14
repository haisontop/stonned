import React from 'react'
import { getCicadaAuthServerSideProps } from '../../modules/cicada/cicadaService'
import CicadaOne from '../../modules/cicada/components/cicadaApe'
import CicadaRiddle from '../../modules/cicada/components/cicadaRiddle'
import withCicadaAuth from '../../modules/cicada/withCicadaAuth'
import { withSolana } from '../../modules/common/hoc/withSolana'

export const getServerSideProps = getCicadaAuthServerSideProps(3)

function CicadaThreePage() {
  return <CicadaRiddle />
}

export default withSolana(withCicadaAuth(CicadaThreePage))
