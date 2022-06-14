import {
  Box,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react'
import { MainLayout } from '../../../layouts/MainLayout'

interface ComingSoonProps {
  title: string
  date?: Date
  location?: string
}

export default function ComingSoon({ title, date, location }: ComingSoonProps) {
  return (
    <MainLayout
      navbar={{
        colorTheme: 'dark',
        bgTransparent: true,
      }}
    >
      <Flex
        h='100vh'
        w='100vw'
        bg='#000'
        alignItems='center'
        justifyContent='center'
      >
        <Box textAlign='center' color='#fff'>
          <Image
            src='/images/sac_logo_with_text.png'
            width='200px'
            m='1rem auto'
          ></Image>
          <Text>{title}</Text>
          {date && <Text>{date.toLocaleDateString()}</Text>}
          {location && <Text>{location}</Text>}
          <Text mt='1rem'>Coming soon...</Text>
        </Box>
      </Flex>
    </MainLayout>
  )
}
