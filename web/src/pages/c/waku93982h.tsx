import React from 'react'
import CicadaChest from '../../modules/cicada/components/cicadaChest'
import { getCicadaAuthServerSideProps } from '../../modules/cicada/cicadaService'
import withCicadaAuth from '../../modules/cicada/withCicadaAuth'
import { withSolana } from '../../modules/common/hoc/withSolana'

export const getServerSideProps = getCicadaAuthServerSideProps(5, true)

function CicadaFivePage() {
  return <CicadaChest />
}

export default withSolana(withCicadaAuth(CicadaFivePage))
