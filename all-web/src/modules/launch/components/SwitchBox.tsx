import { Box, HStack, Text, BoxProps } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/system'
import { motion } from 'framer-motion'
import { FC } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'

const spring = {
  type: 'linear',
  stiffness: '100',
}

const MotionBox = motion<BoxProps>(Box)

interface Props {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const SwitchBox: FC<Props> = ({ label, checked, onChange }) => {
  const circleBg = useColorModeValue('#fff', '#000')
  const checkMarkColor = useColorModeValue('#000', '#fff')

  const toggleChecked = () => {
    onChange(!checked)
  }

  return (
    <HStack justifyContent={'space-between'} width='100%'>
      <Text fontSize={'1rem'} fontWeight={500}>
        {label}
      </Text>
      <Box
        width='2.875rem'
        height='1.6875em'
        background='#888888'
        display={'flex'}
        justifyContent={checked ? 'flex-end' : 'flex-start'}
        borderRadius={'1rem'}
        cursor={'pointer'}
        onClick={toggleChecked}
        position='relative'
        alignItems={'center'}
        px='0.1rem'
      >
        <MotionBox
          width={'1.5rem'}
          height='1.5rem'
          background={circleBg}
          borderRadius={'1rem'}
          layout
          transition={spring}
          display='flex'
          alignItems={'center'}
          justifyContent='center'
        >
          <AiOutlineCheck color={checked ? checkMarkColor : circleBg} />
        </MotionBox>
      </Box>
    </HStack>
  )
}
