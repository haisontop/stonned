import { Button, Link, useBreakpointValue } from '@chakra-ui/react'
import React, { ComponentProps, FC, ReactChildren } from 'react'

export const CtaButton: React.FC<ComponentProps<typeof Button>> = (props) => {
  return (
    <Button
      rounded={'full'}
      fontWeight={'700'}
      px={6}
      as='a'
      transition={'ease-in-out all .2s'}
      {...props}
    >
      {props.children}
    </Button>
  )
}
