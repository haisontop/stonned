import React, { useContext } from 'react'
import { Box } from '@chakra-ui/react'
import { MainLayout } from '../../../layouts/MainLayout'
import Awakening from '../../../modules/awakening/Awakening'
import AwakeningContextProvider from '../../../modules/awakening/AwakeningProvider'

const HolderDashBoardAwaking = () => {
  return (
    <MainLayout
      navbar={{
        colorTheme: 'dark',
        showWallet: true,
        bgTransparent: false,
      }}
    >
      <Box overflow={'hidden'} paddingTop='4rem' background={'#000'}>
        <Awakening></Awakening>
      </Box>
    </MainLayout>
  )
}

export default function () {
  return (
    <AwakeningContextProvider>
      <HolderDashBoardAwaking />
    </AwakeningContextProvider>
  )
}
