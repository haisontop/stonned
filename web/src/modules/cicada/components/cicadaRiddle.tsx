import {
  Box,
  Text,
  ChakraProvider,
  Input,
  Button,
  Flex,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react'
import { useAsyncFn } from 'react-use'
import themeFlat from '../../../themeFlat'
import { trpc } from '../../../utils/trpc'

const CicadaRiddle = () => {
  const [text, setText] = useState('')
  const checkTextMutation = trpc.useMutation('cicada.checkText')
  const router = useRouter()

  const [checkTextRes, checkText] = useAsyncFn(async () => {
    const res = await checkTextMutation.mutateAsync({ text })
    if (res.redirect) {
      await router.push(res.redirect)
    }
  }, [text])

  return (
    <ChakraProvider resetCSS theme={themeFlat}>
      <Flex
        bg='#000'
        w='100vw'
        h='100vh'
        alignItems='center'
        justifyContent='center'
      >
        <Box color='white'>
          <Text fontSize='12px'>Never have I ever told anyone. People do</Text>
          <Text fontSize='12px'>
            underestimate my power. Without any choices
          </Text>
          <Text fontSize='12px'>
            the real ones must understand that there is big
          </Text>
          <Text fontSize='12px'>
            power in the goal we want to reach. The ancestral vision
          </Text>
          <Text fontSize='12px'>
            of going all the way up to reach infinite strenght has
          </Text>
          <Text fontSize='12px'>
            four major steps to be taken. How many will make it?
          </Text>
          <Text fontSize='12px'>Twenty? Ten? Less or more?</Text>
          <Input
            bg='white'
            mt='1rem'
            fontSize='12px'
            color='black'
            height='1.5rem'
            value={text}
            type='text'
            onChange={(e) => {
              setText(e.target.value)
            }}
          ></Input>
          <Button
            color='black'
            rounded='5px'
            fontSize='12px'
            mt='.5rem'
            h='2rem'
            mx='auto'
            isLoading={checkTextRes.loading}
            onClick={async (e) => {
              checkText()
            }}
          >
            Check
          </Button>
        </Box>
      </Flex>
    </ChakraProvider>
  )
}

export default CicadaRiddle
