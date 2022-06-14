import {
  Box,
  BoxProps,
  ButtonProps,
  HStack,
  Image,
  Stack,
  Text,
  TextProps,
} from '@chakra-ui/react'
import React from 'react'
import { GradientButton } from '../../../components/GradientButton'

interface LotteryHalfRadiusTokenItemmProps {
  onDragStart?: (e: any) => void
  width?: BoxProps['width']
  height?: BoxProps['height']
  tokenImageURL?: string
  tokenName: string
  valueLabel: string
  tokenNameStyle?: TextProps
  valueLabelStyle?: TextProps
  highlighted?: boolean
  onClaim?: ButtonProps['onClick']
  loading?: boolean
  alreadyClaimed?: boolean
}

export default function LotteryHalfRadiusTokenItem(
  props: LotteryHalfRadiusTokenItemmProps
) {
  const {
    onDragStart,
    width,
    height,
    tokenImageURL,
    tokenName,
    valueLabel,
    tokenNameStyle,
    valueLabelStyle,
    highlighted,
    onClaim,
    loading,
    alreadyClaimed,
  } = props

  return (
    <Stack
      spacing={0}
      alignItems='center'
      borderRadius='5px'
    >
      <Box
        width={width ? width : [100, 150, 200]}
        minWidth={[100, 150, 150, 200]}
        height={height ? height : [120, 170, 220]}
        overflow='hidden'
        borderRadius='5px'
        bgColor='rgba(0, 0, 0, 0.1)'
        padding={2}
        paddingBottom={0}
        boxShadow={highlighted ? 'lg' : undefined}
      >
        <Image
          src={tokenImageURL}
          width='100%'
          height='100%'
          borderTopLeftRadius={'5px'}
          borderTopRightRadius={'5px'}
          objectFit='cover'
        />
      </Box>
      <Box
        bgColor='rgba(20, 0, 25, 0.2)'
        padding={2}
        paddingTop={0}
        width={width ? width : [150, 200, 320]}
        boxShadow={highlighted ? 'lg' : undefined}
      >
        <Stack
          spacing={[2, 4]}
          width='100%'
          bgColor='rgba(255,255,255,0.05)'
          py={4}
          alignItems='center'
        >
          <Text
            fontSize='1rem'
            mb={0}
            color='#fff'
            fontWeight={500}
            textAlign={'center'}
            {...tokenNameStyle}
          >
            {tokenName}
          </Text>

          {alreadyClaimed && (
            <Text
              fontSize='1rem'
              mb={0}
              color='red'
              textAlign={'center'}
              {...tokenNameStyle}
            >
              Already claimed
            </Text>
          )}

          {onClaim && (
            <GradientButton
              disabled={loading || alreadyClaimed}
              onClick={onClaim}              
              variant='solid'
              theme='lottery'
              gradientDirection='left'
              boxShadow='inset -6px 6px 10px rgba(255, 255, 255, 0.2), inset 6px -6px 10px rgba(0, 0, 0, 0.2);'
            >
              Claim Prize
            </GradientButton>
          )}

          {/*  <Text
            fontSize={[14, 18, 20]}
            color='#A0A0A0'
            textAlign={'center'}
            {...valueLabelStyle}
          >
            {valueLabel}
          </Text> */}
        </Stack>
      </Box>
    </Stack>
  )
}
