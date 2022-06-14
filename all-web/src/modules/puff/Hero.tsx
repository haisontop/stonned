import { CtaButton } from './../../components/CtaButton'
import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
  Image,
  Text,
  Link,
  IconButton,
  SimpleGrid,
  useBreakpointValue,
  Collapse,
  useDisclosure,
  Icon,
  extendTheme,
} from '@chakra-ui/react'
import { FunctionComponent, useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import { HiOutlineMenu } from 'react-icons/hi'
import { ChevronDownIcon, CloseIcon, HamburgerIcon } from '@chakra-ui/icons'

interface HeroProps {}

const navItems = [
  { name: 'Tokenomics', link: '#tokenomics' },
  { name: ' Partners', link: '#exchanges' },
  { name: 'Stats', link: '/analytics' },
  { name: 'SAC', link: '/' },
]
const Hero: FunctionComponent<HeroProps> = () => {
  const { isOpen, onToggle } = useDisclosure()

  const showApe = useBreakpointValue([false, true])

  return (
    <Stack
      display='flex'
      alignItems={'center'}
      justifyContent={'center'}
      height={['calc(100vh - 86px)', 'calc(100vh - 86px)']}
      paddingTop={['1rem']}
      paddingBottom={['3rem', '1rem']}
      position='relative'
      overflow={'hidden'}
    >
      {!showApe && (
        <Image
          marginY='1rem'
          alt={'Hero Image'}
          fit={'cover'}
          align={'center'}
          borderRadius={'full'}
          w={'auto'}
          h={['180px']}
          src={'images/puff-logo.png'}
        />
      )}
      {/*<chakra.nav position='relative'>
        <Box px={0} py={6} maxW='full'>
          <Box
            display={{ md: 'flex' }}
            alignItems={{ md: 'center' }}
            /*  justifyContent={{ md: 'space-between' }} */
      /*
          >
            {/*<Flex alignItems='center'>
              <Box>
                <chakra.a
                  _hover={{
                    color: useColorModeValue('gray.700', 'gray.300'),
                  }}
                >
                  {/*   <Text color={'green'} fontSize={'5xl'} fontWeight={'600'}>
                    $PUFF
                  </Text> */}
      {/*
                  <Image height={'100px'} src='images/puff-logo.png' /> 
                </chakra.a>
              </Box>
              

              <Flex ml='auto' display={{ md: 'none' }}>
                <IconButton
                  onClick={onToggle}
                  icon={
                    isOpen ? (
                      <CloseIcon w={3} h={3} />
                    ) : (
                      <HamburgerIcon w={5} h={5} />
                    )
                  }
                  variant={'ghost'}
                  aria-label={'Toggle Navigation'}
                />
              </Flex>
            </Flex>

            <Box
              ml='2rem'
              display={['none', null, 'flex']}
              alignItems={{ md: 'center' }}
            >
              {navItems.map((item, i) => {
                return (
                  <chakra.a
                    key={i}
                    href={item.link}
                    display='block'
                    mx={4}
                    mt={[2, null, 0]}
                    fontSize='2xl'
                    fontWeight={'600'}
                    textTransform='capitalize'
                    _hover={{
                      color: useColorModeValue('brand.400', 'blue.400'),
                    }}
                  >
                    {item.name}
                  </chakra.a>
                )
              })}
            </Box>*/
      /*
          </Box>
        </Box>
        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </chakra.nav>*/}
      <SimpleGrid
        width={['100%', '80%']}
        columns={[1, 2]}
        spacing={[2, 4]}
        alignItems={'center'}
        paddingX={{ base: 4, md: 0 }}
       /*  direction={{ base: 'column', md: 'row' }} */
      >
        <Stack flex={1} display='flex' justifyContent={'center'}>
          <Heading
            mt={2}
            fontFamily={'body'}
            lineHeight={1.1}
            fontWeight={550}
            fontSize={['3xl', '3xl', '4xl']}
            textAlign={['left']}
            zIndex={1}
          >
            <chakra.span fontWeight={800} color={'primary'}>
              $PUFF Utility Token
            </chakra.span>
          </Heading>
          <Heading
            fontFamily={'body'}
            lineHeight={1.1}
            fontWeight={600}
            fontSize={['md', 'lg']}
            textAlign={['left']}
            zIndex={1}
            color='#ffffff'
          >
            is a unique, utility-first token on Solana used to buy Cannabis & more
          </Heading>
          <Heading
            fontFamily={'body'}
            lineHeight={1.1}
            fontWeight={550}
            fontSize={['xs']}
            display={['none', 'flex']}
            textAlign={['left']}
            zIndex={1}
            color='#ffffff'
          >
            $PUFF plays a central role in all of the SAC ecosystem including several
            burning mechanics & future IRL usage in the Cannabis Industry.
          </Heading>
          {/*<Heading
            mt={2}
            fontFamily={'body'}
            lineHeight={1.1}
            fontWeight={550}
            fontSize={['3xl', '3xl', '4xl']}
            textAlign={['left']}
            zIndex={1}
          >
            <chakra.span fontWeight={600} color={'primary'}>
              $PUFF
            </chakra.span>{' '}
            is a unique{' '}
            <chakra.span color={'primary'}>utility-first</chakra.span> token in
            the Solana Metaverse
          </Heading>*/}
          {/*   <Text color={'gray.500'}>
      Snippy is a rich coding snippets app that lets you create your own
      code snippets, categorize them, and even sync them in the cloud so
      you can use them anywhere. All that is free!
    </Text> */}
        </Stack>
        {showApe && (
          <Flex
            flex={1}
            justify={'center'}
            align={'center'}
            position={'relative'}
            w={'full'}
            id='beild'
          >
            <Image
              alt={'Hero Image'}
              fit={'cover'}
              align={'center'}
              borderRadius={'full'}
              w={'auto'}
              h={['150px', '300px', '300px']}
              src={'images/puff-logo.png'}
            />
          </Flex>
        )}
      </SimpleGrid>

      <Stack
        width={['90%', '80%']}
        justifyContent={'left'}
        spacing={{ base: 2, sm: 6 }}
        direction={{ base: 'column', sm: 'row' }}
        paddingTop={['1rem', '1rem']}
      >
        <CtaButton
          variant='solid'
          transition={'ease-in-out all .3s'}
          background={'linear-gradient(to right, #48D587, #3bb659)'}
          _hover={{
            background: 'linear-gradient(to right, #bcda14, #269e44)',
          }}
          target='_blank'
          href='https://solapeswap.io/#/market/FjkwTi1nxCa1S2LtgDwCU8QjrbGuiqpJvYWu3SWUHdrV'
        >
          <chakra.span>Buy $PUFF</chakra.span>
        </CtaButton>
        <CtaButton
          variant='gradient'
          bgcolor='black'
          fromcolor='#44ABE9'
          tocolor='#D713F9'
          href='#stats'
          display={['none', 'flex']}
        >
          Stats
        </CtaButton>
        <CtaButton
          variant='gradient'
          bgcolor='black'
          fromcolor='#d8e432'
          tocolor='#54ca71'
          href='#tokenomics'
        >
          Tokenomics
        </CtaButton>
      </Stack>
      <Box
        position='absolute'
        background='linear-gradient(169.21deg, rgba(144, 0, 211, 0.34) 8%, rgba(75, 115, 254, 0.32) 115.65%)'
        filter='blur(180px)'
        width='60vw'
        top='-5vh'
        right='-20vw'
        height='20vh'
      ></Box>
      <Box
        position='absolute'
        borderRadius={'50%'}
        background='radial-gradient(rgba(252, 56, 216, 0.4), rgba(131, 22, 158, 0.4))'
        filter={'blur(120px)'}
        width='50vw'
        top='-40vh'
        left='-40vh'
        height='50vh'
      ></Box>
    </Stack>
  )
}

export default Hero

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {navItems.map((navItem, i) => (
        <MobileNavItem key={i} label={navItem.name} href={navItem.link} />
      ))}
    </Stack>
  )
}

interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'ease-in-out all .3s'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}
