import { Box, Button, Divider, HStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GrCheckmark } from 'react-icons/gr'
import { MotionBox } from '../../../components/Utilities'
import { AiOutlineCheck } from 'react-icons/ai'

const Solution = () => {
  const variants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  }

  return (
    <MotionBox
      display='flex'
      flexDir={'row'}
      alignItems='center'
      width='100%'
      gap='3rem'
      variants={variants}
      initial={false}
    >
      <Box
        width='4rem'
        minWidth='4rem'
        height='4rem'
        bg='#fff'
        boxShadow={'0px 15px 50px rgba(0, 0, 0, 0.1)'}
        display='flex'
        alignItems={'center'}
        justifyContent='center'
        borderRadius={'2rem'}
      >
        <AiOutlineCheck color='red' />
      </Box>
      <Divider color='#FC6653' bg='#FC6653' height={'1px'} />
    </MotionBox>
  )
}

const WhiteListShape = () => {
  const [isOpen, setIsOpen] = useState(false)

  const ulVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  }

  const handleEndAnimation = () => {
    setTimeout(
      () => {
        setIsOpen(!isOpen)
      },
      isOpen ? 4000 : 1000
    )
  }

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true)
    }, 1000)
  }, [])

  return (
    <Box
      position='relative'
      boxShadow=' 0px 15px 50px rgba(0, 0, 0, 0.1)'
      pl='2.5rem'
      pr={['3rem', '3rem', '6.5rem']}
      py='3.5rem'
    >
      <MotionBox
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        onAnimationComplete={handleEndAnimation}
      >
        <MotionBox
          variants={ulVariants}
          display='flex'
          flexDir={'column'}
          gap={4}
        >
          <Solution />
          <Solution />
          <Solution />
        </MotionBox>
      </MotionBox>
    </Box>
  )
}

export default WhiteListShape
