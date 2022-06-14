import { Box, Center, useColorModeValue, Heading, Text, Stack, Image, Flex } from '@chakra-ui/react'

export default function ProductSimple(props: { img: string; title: string | JSX.Element; text: string }) {
  return (
    <Center alignItems='flex-start'
      maxWidth={{base: '300px', md: 'unset'}}
      m='0 auto'
    >
      <Flex
        p={'20px'}
        w={'full'}
        bg={'#FAFAFA'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}
        display='flex'
        flexDirection={{base: 'column', md: 'row'}}
      >
        <Image 
          display='block' 
          w='240px' 
          h='240px' 
          m='0 auto'
          rounded={'lg'} 
          objectFit={'cover'} 
          src={props.img}
        />
       
        <Stack pt={'15px'} align={'center'} 
        maxWidth={{base: 'auto'}}
        pl='20px'>
          <Heading textAlign='center' fontSize={'2xl'} fontFamily={'Montserrat, sans-serif'} fontWeight={700}>  
            {props.title}
          </Heading> 
          <Text fontSize='0.75rem'>{props.text}</Text>
        </Stack>
      </Flex>
    </Center>
  )
}
