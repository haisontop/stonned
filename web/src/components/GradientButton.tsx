import { Box, Button, Text, TypographyProps } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const GradientButton: React.FC<
  { fontSize?: TypographyProps['fontSize'] } & ComponentProps<typeof Button>
> = ({ fontSize, gradientDirection, theme, ...props }) => {
  let direction = gradientDirection == 'left' ? 'to-l' : 'to-r'
  let backgroundColor = props.backgroundColor ? props.backgroundColor : 'black'
  const buttonVariant = props.variant === 'solid' ? 'solid' : 'outlined'
  const gradient = theme === 'lottery' ? '#FF9E0A, #F65BB0' : 'purpleGradient, blueGradient'

  // '#EA9FF1, #E88BAB'
  // linear(to-l, #FF1C97, #FFBB52 60%)

  return (
    <Button
      rounded='full'
      bgGradient={`linear(${direction}, ${gradient})`}
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
        bg={buttonVariant === 'outlined' ? backgroundColor : 'transparent'}
        height='100%'
        width='100%'
        textAlign='center'
        lineHeight='2.25rem'
        padding='0 1rem'
        transition='ease-in-out all .2s'
        _groupHover={{
          bg: buttonVariant === 'outlined' ? 'transparent' : backgroundColor,
        }}
      >
        <Text
          bgGradient={`linear(${direction}, ${gradient})`}
          bgClip='text'
          as='span'
          fontWeight='700'
          fontSize={fontSize}
          transition='ease-in-out all .2s'
          padding={props.innerPadding ? props.innerPadding : ''}
          color={buttonVariant === 'outlined' ? "transparent" : "white"}
          _groupHover={{
            color: buttonVariant === 'outlined' ? 'white' : "transparent",
          }}
        >
          {props.children}
        </Text>
      </Box>
    </Button>
  )
}
