import React, { useEffect, useState } from 'react'
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Stack,
  Text,
  Icon,
  Image,
  BoxProps,
} from '@chakra-ui/react'

interface DataBoxProps {
  title?: string
  amount?: string | number | JSX.Element
  amountSideText?: string | JSX.Element
  percentage?: number
  arrowType?: string
  icon?: string
  arrow?: 'increase' | 'decrease' | undefined | null
  extraContent?: JSX.Element
  backgroundColor?: BoxProps['color']
  subtitleColor?: string
}

export function DataBox({
  children,
  title,
  amount,
  amountSideText,
  percentage,
  icon,
  arrow,
  extraContent,
  color,
  backgroundColor,
  subtitleColor,
  ...props
}: BoxProps & DataBoxProps) {
  const [showExtraContent, setShowExtraContent] = useState(false)

  const percentageFixed = percentage ? `${Number(percentage).toFixed(1)}%` : ''
  return (
    <Box
      backgroundColor={backgroundColor ? backgroundColor : 'transparent'}
      borderRadius='10'
      border={backgroundColor ? 'none' : '2px solid #E3EDF4'}
      p='2'
      _hover={{
        boxShadow: '0 2px 12px -2px rgba(134, 118, 255, 0.4)',
        border: 'none',
      }}
      height='100%'
      onMouseEnter={(e) => {
        setShowExtraContent(true)
      }}
      onMouseLeave={(e) => {
        setShowExtraContent(false)
      }}
      {...props}
    >
      <Stat color={color ? color : '#43437B'}>
        <Box d='flex'>
          <Box>
            <StatLabel color={subtitleColor ? subtitleColor : '#AEAEC6'}>
              {title}
            </StatLabel>

            <Box d='flex'>
              <StatNumber width={'100%'}>
                {amount}{' '}
                <Text as='span' fontWeight='semibold' fontSize='lg'>
                  {amountSideText}
                </Text>
              </StatNumber>
              <Box d='flex' alignItems='end' pl='2'>
                <StatHelpText display='flex' justifyContent={'center'} alignItems='center'>
                  {(percentage ?? 0) < 0 ? (
                    <StatArrow type='decrease' />
                  ) : (percentage ?? 0) > 0 ? (
                    <StatArrow type='increase' />
                  ) : (
                    <></>
                  )}
                  {percentageFixed}
                </StatHelpText>
              </Box>
            </Box>
          </Box>
        </Box>
      </Stat>
      {children}
      {showExtraContent && extraContent}
    </Box>
  )
}

export interface PriceDataBoxProps {
  amountDecimals?: number
  amountPrefix?: string
}

export function PriceDataBox(
  props: PriceDataBoxProps & DataBoxProps & BoxProps
) {
  const { amount, amountDecimals, amountPrefix } = props
  const amountFixed = amount
    ? `${amountPrefix ?? ''}${Number(amount).toFixed(
        amountDecimals ? amountDecimals : 0
      )}`
    : ''

  return (
    <DataBox {...props} amount={amountFixed}>
      {props.children}
    </DataBox>
  )
}
