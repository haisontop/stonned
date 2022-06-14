import React from 'react'

/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Box, Stack, useToast } from '@chakra-ui/react'
import axios, { AxiosError } from 'axios'
import Header from '../components/Header'
import Hero from '../components/Hero'

const Airdrop = dynamic(() => import('../components/Airdrop'), {
  ssr: false,
})

export default function Home() {
  const toast = useToast()
  useEffect(() => {
    axios.interceptors.response.use(
      (response) => response,
      (err: AxiosError) => {
        console.log('err', JSON.stringify(err, null, 3))
        if (err.response) {
          console.log('err.response.data', err.response.data)

          toast({
            title: err.response.data.error,
            status: 'error',
            isClosable: true,
          })
        }

        throw err
      },
    )
  }, [])

  return (
    <Box>
      <Stack spacing='4rem'>
        <Stack maxW='1440px' marginLeft='auto' marginRight='auto' spacing={{ base: '2rem', md: '3rem' }}>
          <Airdrop />
        </Stack>
        <Hero />
      </Stack>
    </Box>
  )
}
