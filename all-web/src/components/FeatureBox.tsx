import { Box, Button, Container, Heading, Text } from "@chakra-ui/react"
import { ComponentProps } from "react"

export const FeatureBox: React.FC<ComponentProps<typeof Box>> = (props) => {

  const width = props.boxWidth == 'large' ? '18rem' : '12rem'

  return (
    <Box
      borderRadius='8px'
      padding='3px'
      minHeight='6rem'
      width={width}
      p='1.5rem'
      bg='rgba(255,255,255,0.15)'
      {...props}
      >
        <Text
          color='white'
          fontWeight='700'
          fontFamily='Montserrat'
          mb='.25rem'
        >
          {props.heading}
        </Text>
        <Text
          color='white'
          fontWeight='300'
          fontSize='0.9rem'
        >
          {props.text}
        </Text>
      </Box>
  )
}