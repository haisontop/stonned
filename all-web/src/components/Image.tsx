import { ComponentProps, useMemo } from 'react'
import { Box, Image as ChakraImage } from '@chakra-ui/react'

export const Image: React.FC<ComponentProps<typeof ChakraImage>> = ({
  ...props
}) => {
  const fallbackElement = useMemo(() => {
    return <Box background='#C4C4C4' {...props}></Box>
  }, [])

  return <ChakraImage fallback={fallbackElement} {...props} />
}
