import { Box, Flex, Heading } from '@chakra-ui/react'

interface Props {
  type: string
  text: string
}
export const AttributeCard: React.FC<Props> = ({ type, text }) => {
  return (
    <Flex
      bgColor={'#FAFAFA'}
      borderRadius='5px'
      padding='1rem 0.75rem'
      gap='0.25rem'
      flexDirection={'column'}
    >
      <Heading fontSize={'0.75rem'} fontWeight='500' color='#888888'>
        {type}
      </Heading>
      <Heading fontSize={'1rem'} fontWeight='600' color={'dark'}>
        {text}
      </Heading>
    </Flex>
  )
}
