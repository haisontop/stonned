import { Heading, Stack, Text } from '@chakra-ui/react'
import React from 'react'

interface DropTitleProps {
  label: string
}

export default function DropTitle(props: DropTitleProps) {
  const { label } = props

  return (
    <Stack textAlign='center' alignItems='center' spacing={0}>
      <Text
        mt={['20px', 0]}
        fontSize={[30]}
        lineHeight={['40px', '60px']}
        fontWeight={600}
        fontFamily='Montserrat'
      >
        {label}
      </Text>
      {/*  <Heading
        mt={0}
        color='white'
        textAlign='center'
        fontSize={[40]}
        fontWeight={700}
        textShadow={
          '-1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000,-1px -1px 0 #000;'
        }
      >
        DROP
      </Heading> */}
    </Stack>
  )
}
