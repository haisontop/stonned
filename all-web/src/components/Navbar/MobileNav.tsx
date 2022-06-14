import { Box, Stack, Link, Flex, IconButton, Collapse } from '@chakra-ui/react'
import { NAV_ITEMS } from './constants'
import { MobileSubMenu } from './MobileSubMenu'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { ApplyNowButton } from '../ApplyNowButton'
import { Logo } from '../Logo'
import { WalletMultiButton } from '../wallet-ui'

interface Props {
  fontColor: string
  bgColor: string
  isOpen: boolean
  onToggle: () => void
}

export const MobileNav: React.FC<Props> = ({
  fontColor,
  bgColor,
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
        <Link href={'/'}>
          <Logo
            height={'1rem'}
            fillColor='linear-gradient(0deg, #282936, #282936), #000000'
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
            alignItems='center'
            justifyContent='center'
            spacing={8}
            flex='1'
            marginTop={5}
          >
            <Link href='https://airtable.com/shrOYiab2lhb4ATzk' target='_blank'>
              <ApplyNowButton />
            </Link>
            <Box>
              <WalletMultiButton />
            </Box>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  )
}
