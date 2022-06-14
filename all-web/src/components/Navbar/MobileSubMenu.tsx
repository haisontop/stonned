import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Link,
} from '@chakra-ui/react'
import { NavItem } from './types'

export const MobileSubMenu = ({
  navItem,
  fontColor,
}: {
  navItem: NavItem
  fontColor: string
}) => {
  return (
    <Accordion allowToggle as={Box}>
      <AccordionItem
        sx={{
          border: 'none',
          borderBottom: '1px solid #EEEEEE',
        }}
      >
        <AccordionButton as={Box} paddingX={0} _hover={{ bg: 'transparent' }}>
          <Box flex='1' textAlign='left' fontWeight={500}>
            {navItem.label}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          {navItem.items?.map((item) => (
            <Box key={item.label} paddingY='2'>
              <Link
                p={2}
                href={item.href ?? '#'}
                fontSize={{ lg: 'sm', xl: 'md' }}
                fontWeight={500}
                color={fontColor}
                isExternal={item.isExternal}
              >
                {item.label}
              </Link>
            </Box>
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
