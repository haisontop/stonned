import { Box, BoxProps, Text } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/system'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs'

const spring = {
  type: 'linear',
  stiffness: '100',
}

const MotionBox = motion<BoxProps>(Box)

export default function ThemeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box
      width='4rem'
      height='2rem'
      background='#393E46'
      display={'flex'}
      justifyContent={colorMode === 'light' ? 'flex-start' : 'flex-end'}
      borderRadius={'1rem'}
      cursor={'pointer'}
      onClick={toggleColorMode}
      position='relative'
    >
      <MotionBox
        width={'1.8rem'}
        height='1.8rem'
        background={colorMode === 'light' ? '#fff' : '#101011'}
        borderRadius={'1rem'}
        layout
        my='.1rem'
        mx='.1rem'
        transition={spring}
      />
      <Box
        width='100%'
        position='absolute'
        display={'flex'}
        justifyContent='space-around'
        top='0.5rem'
      >
        <BsFillSunFill color={colorMode === 'light' ? '#000000' : '#848484'} />

        <BsFillMoonStarsFill
          color={colorMode === 'light' ? '#848484' : '#fff'}
        />
      </Box>
    </Box>
  )
}
