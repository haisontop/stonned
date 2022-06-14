import { Flex, MenuItem, Stack, Box, Link, Button } from '@chakra-ui/react'
import { MAIN_CONTAINER_MAX_WIDTH } from '../../constants'
import { ApplyNowButton } from '../ApplyNowButton'
import { Logo } from '../Logo'
import { NAV_ITEMS } from './constants'
import { NavMenuItem } from './NavMenuItem'
import { NavSubItem } from './NavSubMenu'

interface Props {
  fontColor: string
  showWallet?: boolean
}

export const DesktopNav: React.FC<Props> = ({ fontColor, showWallet }) => {
  return (
    <Flex
      width='100%'
      height='4.375rem'
      justifyContent={'space-between'}
      maxWidth={MAIN_CONTAINER_MAX_WIDTH}
      marginX={'auto'}
      px='1rem'
    >
      <Flex justifyContent='center' alignItems={'center'}>
        <Link href={'/'}>
          <Logo
            height={'1.25rem'}
            fillColor='linear-gradient(0deg, #282936, #282936), #000000'
          />
        </Link>
      </Flex>
      <Stack
        direction={'row'}
        spacing={3}
        alignItems='center'
        justifyContent='center'
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

        <Link href='https://airtable.com/shrOYiab2lhb4ATzk' target='_blank'>
          <ApplyNowButton />
        </Link>
      </Stack>
    </Flex>
  )
}
