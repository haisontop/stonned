import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Image,
  createIcon,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons'
import { RiTwitterLine, RiInstagramLine } from 'react-icons/ri'
import { FaDiscord } from 'react-icons/fa'

const MEIcon = createIcon({
  displayName: 'MagicEdenIcon',
  viewBox: '0 0 119 73',
  d: 'M84.1666 19.0568L91.1116 27.2168C91.9066 28.1333 92.6116 28.8872 92.8966 29.3159C94.9736 31.38 96.1383 34.1698 96.1366 37.0768C95.9416 40.5063 93.7066 42.842 91.6366 45.3402L86.7766 51.0463L84.2416 54.0028C84.1506 54.1048 84.092 54.2308 84.0729 54.3652C84.0538 54.4997 84.0751 54.6367 84.1341 54.7593C84.1932 54.882 84.2874 54.9849 84.4051 55.0554C84.5228 55.1259 84.6589 55.1608 84.7966 55.1559H110.132C114.002 55.1559 118.877 58.4081 118.592 63.3455C118.584 65.5896 117.676 67.7395 116.065 69.3263C114.455 70.9132 112.274 71.8081 109.997 71.8159H70.3216C67.7116 71.8159 60.6916 72.0968 58.7266 66.1098C58.3087 64.8588 58.2516 63.5179 58.5616 62.2368C59.1327 60.3423 60.0364 58.5611 61.2316 56.9742C63.2266 54.0176 65.3866 51.0611 67.5166 48.1933C70.2616 44.4385 73.0816 40.802 75.8566 36.9733C75.9551 36.8487 76.0086 36.6952 76.0086 36.5372C76.0086 36.3792 75.9551 36.2257 75.8566 36.1011L65.7766 24.275C65.7109 24.1893 65.6259 24.1198 65.5283 24.0719C65.4307 24.024 65.3231 23.9991 65.2141 23.9991C65.1051 23.9991 64.9975 24.024 64.8999 24.0719C64.8023 24.1198 64.7173 24.1893 64.6516 24.275C61.9516 27.8672 50.1316 43.7733 47.6116 46.9959C45.0916 50.2185 38.8816 50.3959 35.4466 46.9959L19.6816 31.4002C19.5809 31.3007 19.4525 31.2328 19.3126 31.2053C19.1727 31.1777 19.0276 31.1918 18.8958 31.2456C18.7641 31.2995 18.6515 31.3907 18.5724 31.5077C18.4933 31.6247 18.4513 31.7623 18.4516 31.9028V61.8968C18.4887 64.0252 17.8492 66.1118 16.6226 67.864C15.396 69.6163 13.6438 70.9464 11.6116 71.6681C10.3131 72.1134 8.92534 72.2464 7.56408 72.0559C6.20281 71.8655 4.90748 71.357 3.78609 70.573C2.6647 69.789 1.74975 68.7521 1.11752 67.5489C0.485298 66.3456 0.154123 65.0109 0.151611 63.6559V9.72894C0.241987 7.78555 0.951544 5.91965 2.17946 4.39639C3.40737 2.87313 5.09117 1.76999 6.99161 1.24372C8.62177 0.815714 10.3378 0.819997 11.9657 1.25613C13.5937 1.69226 15.0757 2.54475 16.2616 3.7272L40.5016 27.6455C40.5741 27.7181 40.662 27.7742 40.759 27.8096C40.8559 27.845 40.9596 27.859 41.0627 27.8506C41.1658 27.8421 41.2657 27.8114 41.3554 27.7606C41.445 27.7098 41.5223 27.6402 41.5816 27.5568L58.8016 4.0672C59.5974 3.11361 60.595 2.34299 61.7247 1.80931C62.8544 1.27562 64.0889 0.991771 65.3416 0.977634H110.132C111.357 0.979625 112.569 1.23953 113.684 1.73996C114.8 2.24039 115.794 2.96982 116.601 3.87946C117.407 4.7891 118.008 5.85797 118.361 7.01461C118.715 8.17124 118.814 9.38896 118.652 10.5863C118.336 12.6634 117.267 14.5572 115.642 15.9164C114.017 17.2756 111.948 18.008 109.817 17.9776H84.7366C84.6106 17.9807 84.4877 18.0169 84.3807 18.0827C84.2737 18.1484 84.1866 18.2412 84.1284 18.3514C84.0702 18.4616 84.043 18.5852 84.0498 18.7092C84.0565 18.8333 84.0968 18.9533 84.1666 19.0568Z',
})

export default function WithSubnavigation({
  linkColor,
  bgColor,
}: {
  linkColor?: string
  bgColor?: string
}) {
  const linkColorToUse = linkColor
    ? linkColor
    : 'white'
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Box w='100%' m={0} alignSelf='center' margin='auto'>
      <Flex
        bg={bgColor ? bgColor : 'transparent'}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 3 }}
        px={{ base: 4 }}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? (
                <CloseIcon color={linkColorToUse} w={3} h={3} />
              ) : (
                <HamburgerIcon color={linkColorToUse} w={5} h={5} />
              )
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justifyContent={{ base: 'flex-end', md: 'start' }}
        >
          <Link href='/'>
            <Image
              ml={{ md: '1rem' }}
              height={{ base: '46px', md: '52px' }}
              src='/images/sac_logo_with_text.png'
            />
          </Link>

          <Flex
            flex={1}
            alignItems='center'
            display={{ base: 'none', md: 'flex' }}
            ml={4}
          >
            <DesktopNav linkColor={linkColorToUse} />
            {/* <Button
              mr={[null, null, null, 4, 8]}
              display={{ base: 'none', md: 'inline-flex' }}
              size={'sm'}
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight={600}
              color={'white'}
              bg={'green.400'}
              href={'#'}
              _hover={{
                bg: 'green.300',
              }}
              ml='auto'
              justifySelf='flex-end'
            >
              Connect Wallet
            </Button> */}
          </Flex>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav bgColor={bgColor} color={linkColorToUse} />
      </Collapse>
    </Box>
  )
}

const DesktopNav = ({ linkColor }: { linkColor: string }) => {
  const linkHoverColor = useColorModeValue('gray.200', 'gray.200')
  const popoverContentBgColor = useColorModeValue('white', 'gray.800')

  return (
    <Stack direction={'row'} spacing={3} alignItems='center' flex='1'>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                fontSize={{ lg: 'md', xl: 'md' }}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
                fontFamily='heading'
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
      <Box d='flex' flex='1' justifyContent='end' pr='2'>
        <Stack direction='row' alignItems='center' spacing={5}>
          {NavIcons.map((navIcon, i) => (
            <Link key={navIcon.href} href={navIcon.href} target='_blank'>
              {/* <IconButton
                key={i}
                icon={navIcon.icon}
                aria-label={navIcon.label}
                variant=''
                size="sm"
                
              /> */}
              <Icon color={linkColor} key={i}>
                {navIcon.icon}{' '}
              </Icon>
            </Link>
          ))}
        </Stack>
      </Box>
    </Stack>
  )
}

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('green.50', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            fontFamily='heading'
            transition={'ease-in-out all .3s'}
            _groupHover={{ color: 'green.400' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'ease-in-out all .3s'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'green.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  )
}

const MobileNav = ({bgColor, color}: {bgColor?: string, color?: string}) => {
  return (
    <Stack
      bg={bgColor ? bgColor : 'initial'}
      color={color ? color : 'initial'}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem color={color} key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href, color }: NavItem) => {
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
          color={color ? color : useColorModeValue('gray.600', 'gray.200')}
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

interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
  color?: string
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Stoned Apes',
    href: '/',
  },
  {
    label: 'Nuked Apes',
    href: '/nukedapes',
  },
  /*{
    label: 'Gallery',
    href: '/gallery',
  },*/
  {
    label: '$PUFF',
    href: '/puff',
  },
  {
    label: 'Staking',
    href: '/staking',
  },
  { 
    label: 'Evolution', 
    href: '/evolution' 
  },
  {
    label: 'Rescue Missions',
    href: '/rescue',
  },
  {
    label: 'Stats',
    href: '/stats',
  }
]

const NavIcons = [
  {
    label: 'Twitter',
    href: 'https://twitter.com/stonedapecrew',
    icon: <RiTwitterLine />,
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/stonedapecrew',
    icon: <FaDiscord />,
  },
  {
    label: 'Magic Eden',
    href: 'https://magiceden.io/marketplace/stoned_ape_crew',
    icon: <MEIcon />,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/stonedapesofficial/',
    icon: <RiInstagramLine />,
  },
]
