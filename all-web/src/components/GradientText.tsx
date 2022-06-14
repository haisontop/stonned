import { Box, Button, Text } from "@chakra-ui/react"
import { ComponentProps } from "react"

export const GradientText: React.FC<ComponentProps<typeof Text>> = (props) => {

  let direction = props.gradientDirection == 'left' ? 'to-l' : 'to-r'

  return (
    <Text
      bgGradient={`linear(${direction}, #8D188B, #39BBFA)`}
      backgroundClip='text'
      {...props}
    >
      {props.children}  
    </Text>
  )
}