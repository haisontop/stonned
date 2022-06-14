import { Box, Center, useColorModeValue, Heading, Text, Stack, Image, Flex } from '@chakra-ui/react'

const IMAGE =
  'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80'

export default function ProductSimple(props: { img: string; title: string | JSX.Element; text: string }) {
  return (
    <Center pt={12} alignItems='flex-start'>
      <Box
        role={'group'}
        p={6}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}
      >
        <Box
          height={{base: 300, md: 320}}
          width={{base: 300, md: 320}}
          mx='auto'
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: '105%',
            h: '100%',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${props.img})`,
            filter: 'blur(20px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(30px)',
            },
          }}
        >
          <Image rounded={'lg'} objectFit={'cover'} src={props.img} />
        </Box>
        <Stack pt={10} align={'center'}>
          {/* <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            Brand
          </Text> */}
          <Heading textAlign='center' fontSize={'2xl'} fontFamily={'heading'} fontWeight={500}>  
            {props.title}
          </Heading> {/* ==> Heading acts as entry*/}
          <Text fontSize='0.75rem'>{props.text}</Text> {/* ==> Text is the Description which show when expanded*/}
          {/*  <Stack direction={'row'} align={'center'}>
            <Text fontWeight={800} fontSize={'xl'}>
              $57
            </Text>
            <Text textDecoration={'line-through'} color={'gray.600'}>
              $199
            </Text>
          </Stack> */}
        </Stack>
      </Box>
    </Center>
  )
}
