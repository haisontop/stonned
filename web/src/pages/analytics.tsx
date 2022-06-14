import React, { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Stack,
  Button,
  ButtonGroup,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Switch,
} from '@chakra-ui/react'
import ApePanel from '../modules/analytics/ApePanel'
import PuffPanel from '../modules/analytics/PuffPanel'
import Header from '../components/Header'
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import { MainLayout } from '../layouts/MainLayout'

function Analytics() {
  const [toggleActive, setToggleActive] = useState(false)

  useEffect(() => {})
  const handleSwitch = () => {
    if (toggleActive == true) {
      setToggleActive(false)
    } else {
      setToggleActive(true)
    }
  }

  return (
    <MainLayout
      navbar={{
        colorTheme: 'light',
        bgTransparent: true,
      }}
    >
      <Box pb='3rem' minHeight='100vh' backgroundColor='#FFFFFF'>
        <Box
          pt={['18%', '14%', '5%']}
          maxW={'1440px'}
          width={['95%', '90%', '90%']}
          marginX={'auto'}
        >
          <Box
            w='100%'
            d='flex'
            justifyContent='center'
            alignItems='center'
            mt={4}
          >
            <Image
              width='120px'
              borderRadius='50%'
              src='/images/puff-logo.png'
            ></Image>
            <Heading m={3} fontSize='2xl' fontFamily={'body'} fontWeight='bold'>
              $PUFF Stats
            </Heading>
          </Box>
          <Stack
            d='flex'
            justifyContent='flex-start'
            p={2}
            direction={['column', 'row']}
            alignItems='center'
            w='auto'
          >
            <Menu>
              {({ isOpen }: any) => {
                ;<>
                  <ButtonGroup
                    position={['unset', 'absolute']}
                    right='0px'
                    pr={['0', '8px']}
                  >
                    <MenuButton isActive={isOpen} as={Button}>
                      PUFF
                    </MenuButton>

                    <MenuList>
                      {PuffLinks.puff.map((item: any) => (
                        <MenuItem>{item.name}</MenuItem>
                      ))}
                    </MenuList>
                  </ButtonGroup>
                </>
              }}
            </Menu>
          </Stack>
          <PuffPanel />

          <ApePanel />
        </Box>
      </Box>
    </MainLayout>
  )
}

const PuffLinks = {
  puff: [
    {
      name: 'CoinGecko',
      href: 'https://www.coingecko.com/en/coins/puff',
    },
    {
      name: 'DexLab',
      href: 'https://trade.dexlab.space/#/market/FjkwTi1nxCa1S2LtgDwCU8QjrbGuiqpJvYWu3SWUHdrV',
    },
    {
      name: 'Raydium',
      href: 'https://raydium.io/swap/?from=G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB&to=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    },
  ],
  apes: [
    {
      name: 'MagicEden',
      href: 'https://magiceden.io/marketplace/stoned_ape_crew',
    },
    {
      name: 'AlphArt',
      href: 'https://alpha.art/collection/stoned-apes',
    },
  ],
}

export default Analytics
