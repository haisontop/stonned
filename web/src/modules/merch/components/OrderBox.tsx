import {
  Container,
  Flex,
  GridItem,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import React, { useContext } from 'react'
import { GradientText } from '../../../components/GradientText'
import { LabelText } from '../../../components/Texts/LabelText'
import { MerchDropContext, MerchDropStatus } from '../MerchDropContextProvider'

interface OrderProps {
  image: string
  name: string
  description: JSX.Element | string
}

export default function OrderBox(props: OrderProps) {
  return (
    <GridItem
      px={[2]}
      py={[3]}
      border={'1px solid #CBCBCB'}
      borderRadius='20px'
      width={['300px']}
      mx='auto'
    >
      <Stack spacing={4}>
        <Image
          /* fallback={
            <Flex
              height={'250px'}
              alignItems={'center'}
              justifyContent='center'
            >
              <Spinner alignSelf={'center'} />
            </Flex>
          } */
          src={props.image}
          width='250px'
          height='250px'
          maxWidth='90rem'
          zIndex='1'
          mx='auto'
          borderRadius='20px'
          m='1rem'
        />
        <Text
          fontSize={[24]}
          lineHeight={['36px']}
          fontWeight={600}
          textAlign='center'
        >
          {props.name}
        </Text>
       {/*  <Text textAlign={'center'} fontSize={'sm'} color='#A0A0A0'>
          {props.description}
        </Text> */}
      </Stack>
    </GridItem>
  )
}
