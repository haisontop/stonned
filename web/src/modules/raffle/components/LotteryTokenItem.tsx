import { Box, BoxProps, HStack, Stack, Text, TextProps } from '@chakra-ui/react'
import React from 'react'

interface LotteryTokenItemProps {
  onDragStart?: (e: any) => void
  width?: BoxProps['width']
  height?: BoxProps['height']
  tokenImageURL?: string
  tokenName: string
  valueLabel: string
  tokenNameStyle?: TextProps
  valueLabelStyle?: TextProps
}

export default function LotteryTokenItem(props: LotteryTokenItemProps) {
  const {
    onDragStart,
    width,
    height,
    tokenImageURL,
    tokenName,
    valueLabel,
    tokenNameStyle,
    valueLabelStyle,
  } = props

  return (
    <Stack
      width={width ? width : [150, 200, 238]}
      minWidth={width ? width : [150, 200, 238]}
      spacing={2}
      alignItems='center'
      mx='auto'
    >
      <Box
        width={width ? width : [150, 200, 238]}
        minWidth={width ? width : [150, 200, 238]}
        height={height ? height : [150, 200, 238]}
        bgColor='rgba(255, 255, 255, 0.1)'
        onDragStart={onDragStart}
        backgroundImage={tokenImageURL ? tokenImageURL : undefined}
        backgroundPosition='center'
        backgroundSize={'cover'}
        borderRadius={[10]}
      ></Box>
      <Stack spacing={4}>
        <Text
          fontSize='1rem'
          mb={0}
          color='#fff'
          textAlign={'center'}
          {...tokenNameStyle}
        >
          {tokenName}
        </Text>
        <Text
          fontSize={[14, 18, 20]}
          color='#A0A0A0'
          textAlign={'center'}
          {...valueLabelStyle}
        >
          {valueLabel}
        </Text>
      </Stack>
    </Stack>
  )
}
