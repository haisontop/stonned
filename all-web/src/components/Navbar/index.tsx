import { Box, useDisclosure, useOutsideClick } from '@chakra-ui/react'
import { FC, useMemo, useRef } from 'react'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'

interface NavbarProps {
  colorTheme: string
  bgColor?: string
}

const Navbar: FC<NavbarProps> = ({ colorTheme, bgColor }) => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const rootRef = useRef<HTMLDivElement>(null)
  useOutsideClick({
    ref: rootRef,
    handler: () => onClose(),
  })

  const fontColor = useMemo(
    () => (colorTheme === 'dark' ? 'white' : 'black'),
    [colorTheme]
  )

  bgColor = useMemo(() => {
    if (bgColor) return bgColor
    return colorTheme === 'dark' ? '#1F2023' : 'white'
  }, [colorTheme, isOpen])

  const boxShadow = useMemo(() => {
    return colorTheme === 'dark'
      ? '0px 2px 10px rgb(135 135 135 / 15%)'
      : '0px 4px 10px rgba(0, 0, 0, 0.15)'
  }, [colorTheme, isOpen])

  return (
    <Box pos={'absolute'} height='100%' width='100%' pointerEvents={'none'}>
      <Box
        pointerEvents={'auto'}
        pos={'sticky'}
        top={'-1px'}
        w='100%'
        zIndex='200'
        boxShadow={boxShadow}
        bg={{
          base: bgColor,
        }}
        ref={rootRef}
      >
        <Box display={{ base: 'none', md: 'flex' }}>
          <DesktopNav fontColor={fontColor} />
        </Box>

        <Box display={{ base: 'flex', md: 'none' }}>
          <MobileNav
            fontColor={fontColor}
            bgColor={bgColor}
            isOpen={isOpen}
            onToggle={onToggle}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default Navbar
