import { HStack, Progress, Stack, Text } from '@chakra-ui/react'
import React from 'react'

interface GradientProgressProps {
  label: string
  value: number
  subLabel: string
  height?: string | number
}

export default function GradientProgress(props: GradientProgressProps) {
  const { label, value, subLabel, height } = props

  return (
    <Stack marginY={[4, 2, 1]} spacing={0}>
      <HStack justifyContent={'space-between'}>
        <Text fontSize={['0.75rem']} lineHeight={['1.125rem']} fontWeight={500}>
          {label}
        </Text>
        <Text fontSize={['0.75rem']} lineHeight={['1.125rem']} fontWeight={600}>
          {value.toFixed(1)}%
          <span style={{ color: '#888888' }}>
            {` `}({subLabel})
          </span>
        </Text>
      </HStack>
      <Progress
        isIndeterminate={false}
        colorScheme='telegram'
        size={'lg'}
        height={height}
        value={value}
        borderRadius='15px'
        sx={{
          '& > div': {
            backgroundImage:
              'linear-gradient(91.55deg, #ECBF4D 8.69%, #ED5647 101.31%)',
          },
        }}
      />
    </Stack>
  )
}
