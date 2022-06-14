import { Box, Button, Text } from "@chakra-ui/react"
import { ComponentProps } from "react"

export const GradientButton: React.FC<ComponentProps<typeof Button>> = (props) => {

  let direction = props.gradientDirection == 'left' ? 'to-l' : 'to-r'
  let backgroundColor = props.backgroundColor ? props.backgroundColor : 'black'

  return (
    <Button
        rounded='full'
        padding='3px'
        height='2.5rem'
        _hover={{}}
        transition='ease-in-out all .2s'
        role='group'
        border='none'
        {...props}
      >
        <Box
          rounded='full'
          bg={backgroundColor}
          height='100%'
          width='100%'
          textAlign='center'
          lineHeight='2.25rem'
          padding='0 1rem'
          transition='ease-in-out all .2s'
          _groupHover={{
            bg: 'transparent'
          }}
        >
          <Text
            as='span'
            fontWeight='700'
            transition='ease-in-out all .2s'
            _groupHover={{
              color: 'white'
            }}
            color={props.color ? props.color : undefined}
          >
            {props.children}  
          </Text>
        </Box>
      </Button>
  )
}