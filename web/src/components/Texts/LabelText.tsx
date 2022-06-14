import { Text, TextProps } from '@chakra-ui/react'
import React, { ComponentProps } from 'react'

interface LabelText {
  size?: 'small' | 'md'
  color?: TextProps['color']
  fontWeight?: TextProps['fontWeight']
  textAlign?: TextProps['textAlign']
}

export const LabelText: React.FC<LabelText & ComponentProps<typeof Text>> = ({
  children,
  size = 'small',
  color = '#A0A0A0',
  fontWeight = 600,
  textAlign = 'center',
  ...other
}) => {
  const fontSize = React.useMemo(() => {
    if (size === 'small') {
      return ['18px']
    }
  }, [size])

  return (
    <Text
      fontSize={fontSize}
      color={color}
      fontWeight={fontWeight}
      lineHeight='150%'
      textAlign={textAlign}
    >
      {children}
    </Text>
  )
}
