import { Box, Button, Text } from "@chakra-ui/react"
import { ComponentProps } from "react"

export const GradientText: React.FC<ComponentProps<typeof Text>> = (props) => {

  let direction = props.gradientDirection == 'left' ? 'to-l' : 'to-r'
  let gradient = props.gradient == 'green' ? '#46A83E, #006838' : '#8D188B, #39BBFA'; 

  return (
    <Text
      bgGradient={`linear(${direction}, ${gradient})`}
      backgroundClip='text'
      {...props}
    >
      {props.children}  
    </Text>
  )
}