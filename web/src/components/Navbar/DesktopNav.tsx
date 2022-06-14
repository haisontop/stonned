import { Flex, Link, MenuItem, Image, Stack, Box, Icon } from '@chakra-ui/react'
import { NAV_ICONS, NAV_ITEMS } from './constants'
import { NavMenuItem } from './NavMenuItem'
import { NavSubItem } from './NavSubMenu'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

interface Props {
  fontColor: string
  showWallet?: boolean
}

export const DesktopNav: React.FC<Props> = ({ fontColor, showWallet }) => {
  return (
    <Flex width='100%' height='3.5rem' padding='0 5rem'>
      <Flex justifyContent='center' alignItems={'center'}>
        <Link href={'/'}>
          <Image
            height={{ base: '1.7rem' }}
            src='/images/sac_logo_with_text.png'
          />
        </Link>
      </Flex>
      <Stack
        direction={'row'}
        spacing={3}
        alignItems='center'
        justifyContent='center'
        flex='10 0'
      >
        {NAV_ITEMS.map((navItem) => (
          <Box key={navItem.label} textAlign='center'>
            {navItem.subMenu ? (
              <NavSubItem label={navItem.label} color={fontColor}>
                {navItem.items?.map((item, index) => (
                  <MenuItem key={`${navItem.label}-sub-${index}`}>
                    <NavMenuItem
                      href={item.href ?? '#'}
                      isExternal={navItem.isExternal}
                      color={'black'}
                    >
                      {item.label}
                    </NavMenuItem>
                  </MenuItem>
                ))}
              </NavSubItem>
            ) : (
              <NavMenuItem
                href={navItem.href ?? '#'}
                color={fontColor}
                isExternal={navItem.isExternal}
              >
                {navItem.label}
              </NavMenuItem>
            )}
          </Box>
        ))}
      </Stack>

      <Stack
        direction='row'
        alignItems='center'
        justifyContent={'center'}
        spacing={5}
        flex='1'
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
          ></WalletMultiButton>
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
    </Flex>
  )
}
