import { useMemo, useRef } from 'react'
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'

interface NavSubItemProps {
  label?: string | React.ReactElement
  color?: string
}

export const NavSubItem: React.FC<NavSubItemProps> = ({
  label,
  color,
  children,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const menuListRef = useRef<HTMLDivElement>(null)

  const offset: [number, number] = useMemo(() => {
    if (!menuListRef.current?.clientWidth || !menuBtnRef.current?.clientWidth)
      return [8, 8]
    return [
      ((menuListRef.current.clientWidth - menuBtnRef.current.clientWidth) / 2) *
        -1,
      8,
    ]
  }, [isOpen])

  return (
    <Box pos={'relative'} onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Box w='100%' height={'.5rem'} pos={'absolute'} top={'100%'} />
      <Menu isOpen={isOpen} offset={offset}>
        <MenuButton
          color={color}
          ref={menuBtnRef}
          position={'relative'}
          fontSize={'sm'}
          fontWeight={500}
          css={
            isOpen && {
              ':after': {
                content: "''",
                width: '1.6rem',
                height: '2px',
                position: 'absolute',
                bottom: '-4px',
                left: 'calc(50% - 0.8rem)',
                backgroundColor: color || 'black',
                zIndex: -1,
              },
            }
          }
        >
          {label}
        </MenuButton>
        <MenuList ref={menuListRef}>{children}</MenuList>
      </Menu>
    </Box>
  )
}
