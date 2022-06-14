import { Box, BoxProps, HStack, Text, TextProps } from '@chakra-ui/react'
import React from 'react'

interface ChipTagProps {
  bg: BoxProps['bg']
  icon?: React.ReactNode
  color: TextProps['color']
  label: string
}

export default function ChipTag(props: ChipTagProps) {
  const { icon, bg, color, label } = props

  return (
    <Box bg={bg} py={1} px={4} color={color} borderRadius={'10px'}>
      <HStack>
        {icon}
        <Text fontSize={'12px'} fontWeight={600}>{label}</Text>
      </HStack>
    </Box>
  )
}
