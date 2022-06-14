import { Box, BoxProps, HStack, Text, TextProps } from '@chakra-ui/react'
import React from 'react'
import { AllColorIcon } from '../landing/components/icons/AllColorIcon'

interface CategoryTitleProps {
  label: string
  iconColor?: BoxProps['bg']
  labelColor?: TextProps['color']
  iconWidth?: BoxProps['width']
}

const CategoryTitle = (props: CategoryTitleProps) => {
  const {
    label,
    iconColor = '#FC6653',
    labelColor = '#fff',
    iconWidth = ['3rem', '3rem', '6rem'],
  } = props

  return (
    <HStack spacing={0.5}>
      <Box color={iconColor} width={iconWidth}>
        <AllColorIcon />
      </Box>

      <Text color={labelColor} fontSize='1.5625rem' fontFamily='heading'>
        {label}
      </Text>
    </HStack>
  )
}

export default CategoryTitle
