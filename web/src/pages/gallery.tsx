import {
  Container,
  Heading,
  Stack,
  Button,
  Input,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
  Box,
  Text,
} from '@chakra-ui/react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Head from 'next/head'
import React, { useState } from 'react'
import Footer from '../modules/nuked/Footer'
import { SearchIcon } from '@chakra-ui/icons'
import ApeCard from '../modules/gallery/ApeCard'
import moonRankImport from '../../public/output.json'
import { useAllApeUsed } from '../modules/breeding/breeding.hooks'
import { MainLayout } from '../layouts/MainLayout'

const genisisApesFull: any[] = moonRankImport as any[]

const ApeGallery = () => {
  const [selectedCollection, setSelectedCollection] =
    useState<string>('genisis')
  const colorTheme = () => (selectedCollection == 'nuked' ? 'dark' : 'light')

  const lightBgGradient = 'linear(to-b, #F5F5F7 0%, #F5F5F7 100%)'
  const darkBgGradient = 'linear(to-b, #000000 0%, #30424D 250%)'
  const darkBoxBg = '#333639'
  const nukedGradient = 'linear(to-r, blueGradient, purpleGradient)'
  const genisisGradient =
    'linear(to-r, #F0BBDC, #EA9FF1 33%, #EA9FF1 66%, #E08686 94%)'

  const bgGradient = () =>
    colorTheme() == 'light' ? lightBgGradient : darkBgGradient
  const fontColor = () => (colorTheme() == 'light' ? '#000' : '#fff')
  const inverseFontColor = () => (colorTheme() == 'light' ? '#fff' : '#000')
  const secondaryFontColor = () =>
    colorTheme() == 'light' ? '#686868' : '#A1A1A6'
  const buttonBg = () => (colorTheme() == 'light' ? '#fff' : darkBoxBg)
  const borderBgHover = () => (colorTheme() == 'light' ? darkBoxBg : 'gray.200')

  const [searchValue, setSearchValue] = useState<string>('')

  const [genisisApesFiltered, setGenisisApesFiltered] =
    useState<any[]>(genisisApesFull)
  const [genisisApesOnDisplay, setGenisisApesOnDisplay] = useState<any[]>(
    genisisApesFiltered.slice(0, 24)
  )
  const allApesUsedRes = useAllApeUsed()

  const fetchApesGenisis = () => {
    setGenisisApesOnDisplay(
      genisisApesOnDisplay.concat(
        genisisApesFiltered.slice(
          genisisApesOnDisplay.length,
          genisisApesOnDisplay.length + 12
        )
      )
    )
  }

  console.log('allApesUsedRes', allApesUsedRes)

  const handleSearch = (event: React.SyntheticEvent) => {
    event.preventDefault()

    if (selectedCollection == 'genisis') {
      const filtered = genisisApesFull.filter((item) =>
        item.name.includes(searchValue)
      )
      setGenisisApesFiltered(filtered)
      setGenisisApesOnDisplay(filtered.slice(0, 24))
    } else if (selectedCollection == 'nuked') {
      // TODO
    }
  }

  return (
    <MainLayout
      navbar={{
        colorTheme: colorTheme(),
        bgTransparent: true,
      }}
    >
      <Container
        w='100vw'
        maxW='unset'
        minH='100vh'
        h='100%'
        pr='0'
        pl='0'
        pt={['6rem', '8rem']}
        pb='8rem'
        bgGradient={bgGradient()}
        pos='relative'
      >
        <Heading
          color={fontColor()}
          fontWeight={600}
          as='h1'
          fontSize={{ base: '4xl', lg: '5xl' }}
          textAlign='center'
          transition='all .2s ease-in-out'
        >
          APE GALLERY
        </Heading>

        <Stack
          direction={['column', 'row']}
          margin='2rem auto'
          maxWidth='33rem'
          alignItems='center'
        >
          <Button
            width='95%'
            bg={buttonBg()}
            color={secondaryFontColor()}
            border='none'
            padding='1.5rem'
            margin='0 .5rem'
            _hover={{
              bgGradient: genisisGradient,
              color: 'white',
              shadow: 'lg',
            }}
            _active={{
              bgGradient: genisisGradient,
              color: 'white',
              shadow: 'lg',
            }}
            isActive={selectedCollection == 'genisis'}
            onClick={() => setSelectedCollection('genisis')}
          >
            Stoned Ape Crew Genisis
          </Button>
          <Button
            width='95%'
            bg={buttonBg()}
            color={secondaryFontColor()}
            border='none'
            padding='1.5rem'
            margin='0 .5rem'
            _hover={{
              bgGradient: nukedGradient,
              color: 'white',
              shadow: 'lg',
            }}
            _active={{
              bgGradient: nukedGradient,
              color: 'white',
              shadow: 'lg',
            }}
            isActive={selectedCollection == 'nuked'}
            onClick={() => setSelectedCollection('nuked')}
          >
            Nuked Apes
          </Button>
        </Stack>

        <Container maxWidth='40rem' textAlign='center' mt='5rem'>
          <form onSubmit={handleSearch}>
            <InputGroup bg={buttonBg()} rounded='md' mb='1.5rem'>
              <InputLeftElement
                pointerEvents='none'
                children={<SearchIcon color={secondaryFontColor()} />}
              />
              <Input
                type='text'
                placeholder='Search for Name'
                _placeholder={{
                  color: secondaryFontColor(),
                }}
                _hover={{
                  shadow: 'lg',
                }}
                _focus={{
                  shadow: 'lg',
                }}
                border='none'
                bg='none'
                color={fontColor()}
                transition='all .2s ease-in-out'
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </InputGroup>

            <Button
              bg={buttonBg()}
              color={fontColor()}
              border='none'
              padding='0 3rem'
              _hover={{
                bg: borderBgHover(),
                color: inverseFontColor(),
              }}
              type='submit'
            >
              Search
            </Button>
          </form>
        </Container>

        <Container maxWidth='60rem' mt='5rem' mb='7rem'>
          {selectedCollection == 'genisis' && (
            <InfiniteScroll
              dataLength={genisisApesOnDisplay.length}
              next={fetchApesGenisis}
              hasMore={genisisApesOnDisplay.length < genisisApesFiltered.length}
              loader={
                <Text textAlign='center' color={secondaryFontColor()}>
                  Loading...
                </Text>
              }
            >
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3 }}
                spacingY={['10', '10', '20']}
                spacingX='10'
              >
                {genisisApesOnDisplay.map((item) => {
                  console.log('item', item)

                  return (
                    <ApeCard
                      key={item.address}
                      pubKey={item.address}
                      name={item.name}
                      tag={item.role}
                      imgUrl={item.image}
                      allApesUsed={allApesUsedRes.apesUsed}
                      fontColor={fontColor()}
                      bgColor={buttonBg()}
                    ></ApeCard>
                  )
                })}
              </SimpleGrid>
            </InfiniteScroll>
          )}

          {selectedCollection == 'nuked' && (
            <Box mb='3rem'>
              <Text textAlign='center' color={fontColor()}>
                Coming soon...
              </Text>
            </Box>
          )}
        </Container>

        <Box pos='absolute' bottom='0' left='50%' transform='translateX(-50%)'>
          <Footer theme={colorTheme()}></Footer>
        </Box>
      </Container>
    </MainLayout>
  )
}

export default ApeGallery
