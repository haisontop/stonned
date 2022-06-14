import { Box, useDisclosure, useOutsideClick } from '@chakra-ui/react'
import { FC, useMemo, useRef } from 'react'
import { useScroll } from '../../utils/useScroll'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'

export interface NavbarProps {
  colorTheme: string
  bgColor?: string,
  showWallet?: boolean
  bgTransparent?: boolean
}

const Navbar: FC<NavbarProps> = ({ colorTheme, bgColor, showWallet, bgTransparent }) => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const { scrollPos } = useScroll()
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
    if (bgTransparent && !isOpen && scrollPos.y <= 0) {
      return 'transparent'
    }
    if (bgColor) return bgColor
    return colorTheme === 'dark' ? '#1F2023' : 'white'
  }, [scrollPos, colorTheme, isOpen])

  const boxShadow = useMemo(() => {
    if (bgTransparent && !isOpen && scrollPos.y <= 0) {
      return 'none'
    }
    return colorTheme === 'dark'
      ? '0px 2px 10px rgb(135 135 135 / 15%)'
      : '0px 2px 10px rgba(35, 35, 35, 0.15)'
  }, [scrollPos, colorTheme, isOpen])

  return (
    <Box pos={'absolute'} height='100%' width='100%' pointerEvents={'none'}>
      <Box
        pointerEvents={'auto'}
        pos={'sticky'}
        top={0}
        w='100%'
        zIndex='200'
        boxShadow={boxShadow}
        bg={{
          base: bgColor,
        }}
        ref={rootRef}
      >
        <Box display={{ base: 'none', lg: 'flex' }}>
          <DesktopNav fontColor={fontColor} showWallet={showWallet} />
        </Box>

        <Box display={{ base: 'flex', lg: 'none' }}>
          <MobileNav
            fontColor={fontColor}
            bgColor={bgColor}
            showWallet={showWallet}
            isOpen={isOpen}
            onToggle={onToggle}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default Navbar
