import { Box, BoxProps, Divider, HStack } from '@chakra-ui/react'
import React from 'react'
import { motion } from 'framer-motion'
import { GrCheckmark } from 'react-icons/gr'
import { MotionBox } from '../../../components/Utilities'
import { AiOutlineCheck } from 'react-icons/ai'

const list = {
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.5,
    },
  },
}

const item = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const transition = { duration: 4, yoyo: Infinity, ease: 'easeInOut' }

const items = [1, 2, 3]

const VerticalBox = ({
  height,
  verified,
}: {
  height: BoxProps['height']
  verified?: boolean
}) => {
  return (
    <MotionBox
      position='relative'
      bg='#fff'
      boxShadow={'0px 15px 50px rgba(0, 0, 0, 0.1)'}
      borderRadius='6rem'
      width='3.5rem'
      height={height}
      // transition={{ times: [0, 0.1, 0.9, 1], repeat: Infinity, repeatDelay: 4 }}
      animate={{ scale: [0, 0.2, 0.4, 1] }}
    >
      {verified && (
        <Box
          position='absolute'
          left='0.3rem'
          bottom='-1rem'
          width='2.5rem'
          minWidth='2.5rem'
          height='2.5rem'
          bg='#fff'
          boxShadow={'0px 15px 50px rgba(0, 0, 0, 0.1)'}
          display='flex'
          alignItems={'center'}
          justifyContent='center'
          borderRadius={'2rem'}
        >
          <AiOutlineCheck color='#FC6653' />
        </Box>
      )}
    </MotionBox>
  )
}

const VerifiedMintsShape = () => {
  return (
    <Box position='relative' height={'507px'} padding='55px 33px'>
      <MotionBox
        className='list'
        initial='visible'
        animate={['visible']}
        variants={list}
        display='flex'
        gap={2}
        height='100%'
        alignItems={'flex-end'}
      >
        <VerticalBox height='60%' verified />
        <VerticalBox height='80%' verified />
        <VerticalBox height='40%' />
        <VerticalBox height='100%' verified />
        <VerticalBox height='30%' />
        <VerticalBox height='50%' verified />
      </MotionBox>
    </Box>
  )
}

export default VerifiedMintsShape
