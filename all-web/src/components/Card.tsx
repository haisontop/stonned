import { Box } from '@chakra-ui/layout'
import React from 'react'

interface CardProps {
  children: JSX.Element | JSX.Element[]
}

const Card: React.FC<CardProps> = ({ children }) => {
  return <Box>{children}</Box>
}

export default Card
