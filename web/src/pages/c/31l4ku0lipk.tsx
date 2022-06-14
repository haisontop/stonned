import React from 'react'
import { getCicadaAuthServerSideProps } from '../../modules/cicada/cicadaService'
import CicadaCoordinates from '../../modules/cicada/components/cicadaCoordinates'
import withCicadaAuth from '../../modules/cicada/withCicadaAuth'
import { withSolana } from '../../modules/common/hoc/withSolana'

export const getServerSideProps = getCicadaAuthServerSideProps(4, true)

function CicadaFourPage() {
  return <CicadaCoordinates></CicadaCoordinates>
}

export default withSolana(withCicadaAuth(CicadaFourPage))
