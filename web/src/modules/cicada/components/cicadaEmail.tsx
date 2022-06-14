import {
  Box,
  Image,
  ChakraProvider,
  Input,
  Button,
  Flex,
  Stack,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import Countdown from 'react-countdown'
import toast from 'react-hot-toast'
import themeFlat from '../../../themeFlat'
import { trpc } from '../../../utils/trpc'
import useCountdown from '../../common/hooks/useCountdown'
import cicadaConfig from '../cicadaConfig'

const CicadaEmail = () => {
  const countdown = useCountdown(cicadaConfig.countdownEnd)
  const [email, setEmail] = useState('')

  const sendMailMutation = trpc.useMutation('cicada.sendMail')

  return (
    <ChakraProvider resetCSS theme={themeFlat}>
      <Flex
        bg='#000'
        w='100vw'
        h='100vh'
        alignContent='center'
        alignItems='center'
        justifyContent='center'
      >
        {!countdown.completed ? (
          <Flex>
            <Text color={'white'} fontSize={'5xl'}>
              {countdown.hours.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                maximumFractionDigits: 0,
              })}
              :
            </Text>
            <Text color={'white'} fontSize={'5xl'}>
              {countdown.minutes.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                maximumFractionDigits: 0,
              })}
              :
            </Text>
            <Text color={'white'} fontSize={'5xl'}>
              {countdown.seconds.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                maximumFractionDigits: 0,
              })}
            </Text>
          </Flex>
        ) : (
          <Stack>
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              _placeholder={{
                color: '#000',
                _hover: {
                  color: 'rgb(26, 32, 44)',
                },
              }}
              _hover={{
                color: 'rgb(26, 32, 44)',
                border: '1px solid rgb(26, 32, 44)',
                borderRadius: '4px',
              }}
              border='none'
              borderColor='rgb(26, 32, 44)'
              /* color='#fff' */
            ></Input>
            <Button
              type='submit'
              bg='#000'
              color='#000'
              _hover={{
                color: 'rgb(26, 32, 44)',
              }}
              onClick={async (e) => {
                await sendMailMutation.mutateAsync({ email })
                toast.success('success')
              }}
              isLoading={sendMailMutation.isLoading}
            >
              Submit
            </Button>
          </Stack>
        )}
      </Flex>
    </ChakraProvider>
  )
}

export default CicadaEmail
