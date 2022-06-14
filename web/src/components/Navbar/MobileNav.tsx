import {
  Box,
  Stack,
  Link,
  Icon,
  Flex,
  Image,
  IconButton,
  Collapse,
} from '@chakra-ui/react'
import { NAV_ICONS, NAV_ITEMS } from './constants'
import { MobileSubMenu } from './MobileSubMenu'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'

interface Props {
  fontColor: string
  bgColor: string
  showWallet?: boolean
  isOpen: boolean
  onToggle: () => void
}

export const MobileNav: React.FC<Props> = ({
  fontColor,
  bgColor,
  showWallet,
  isOpen,
  onToggle,
}) => {
  return (
    <Box width={'100%'}>
      <Flex
        padding='0 2rem'
        height={'4rem'}
        alignItems='center'
        justifyContent={'space-between'}
      >
        <Link href='/' justifySelf='flex-end'>
          <Image
            display='inline-block'
            ml={{ md: '1rem' }}
            height={{ base: '1.7rem' }}
            src='/images/sac_logo_with_text.png'
          />
        </Link>

        <IconButton
          onClick={onToggle}
          icon={
            isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={3} h={3} />
          }
          color={fontColor}
          borderColor={fontColor}
          variant='outline'
          isRound
          aria-label={'Toggle Navigation'}
          size='xs'
        />
      </Flex>

      <Collapse in={isOpen} unmountOnExit>
        <Box pb={9}>
          <Stack bg={bgColor} color={fontColor} p={'1rem 2rem'}>
            {NAV_ITEMS.map((navItem) => {
              if (navItem.subMenu) {
                return (
                  <MobileSubMenu
                    key={navItem.label}
                    navItem={navItem}
                    fontColor={fontColor}
                  />
                )
              }
              return (
                <Box
                  key={navItem.label}
                  sx={{ borderBottom: '1px solid #EEEEEE' }}
                  paddingY='2'
                >
                  <Link
                    href={navItem.href ?? '#'}
                    fontSize={{ lg: 'sm', xl: 'md' }}
                    fontWeight={500}
                    color={fontColor}
                    isExternal={navItem.isExternal}
                  >
                    {navItem.label}
                  </Link>
                </Box>
              )
            })}
          </Stack>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='center'
            spacing={6}
            flex='1'
            marginTop={6}
          >
            {showWallet ? (
              <WalletMultiButton
                style={{
                  background: '#393E46',
                  fontFamily: 'Poppins',
                  fontSize: '.8rem',
                  fontWeight: '600',
                  padding: '0 1rem',
                  borderRadius: '5px',
                  height: '1.7rem',
                  lineHeight: '100%',
                  whiteSpace: 'nowrap',
                }}
              >
                Connect Wallet
              </WalletMultiButton>
            ) : (
              NAV_ICONS.map((navIcon, i) => (
                <Link
                  key={navIcon.href}
                  href={navIcon.href}
                  target='_blank'
                  role='group'
                  display='flex'
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <Icon
                    key={i}
                    width='24px'
                    height='24px'
                    color={fontColor}
                    transition='ease-in-out all .2s'
                    _groupHover={{
                      color: 'textGrey',
                    }}
                  >
                    {navIcon.icon}
                  </Icon>
                </Link>
              ))
            )}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  )
}
