import { Image, Text, Box, Button } from '@chakra-ui/react'
import { NftMetadata } from '../../../utils/nftmetaData.type'

const Card: React.FC<{
  id: string
  title: string
  image: string
  btnTilte: string
  unClickTitle: string
  clicked: boolean
  onClick: (id: string) => void
  selected?: NftMetadata | null
}> = ({ title, image, btnTilte, onClick, id, clicked, unClickTitle, selected }) => (
  <Box
    w={{ md: '20.1rem', sm: '15rem', base: '9rem' }}
    h={{ md: '24rem', sm: '22rem', base: '13.3rem' }}
    p={{ md: '0.75rem', base: '0.4rem' }}
    display='flex'
    alignItems='center'
    alignContent='center'
    justifyContent={clicked ? 'space-between' : 'center'}
    flexDirection='column'
    rounded='md'
    cursor={'pointer'}
    onClick={() => onClick(id)}
    backgroundColor='rgba(255, 255, 255, 0.2)'
  >
    {selected ? (
      <>
        <Image src={selected.image} rounded='md' />
        <Text
          color='#fff'
          fontSize='.75rem'
          lineHeight='1.125rem'
          fontWeight={500}
        >
          {selected.name}
        </Text>
        <Button
          mt={4}
          color='#AAAAAA'
          w='100%'
          borderRadius='10px'
          variant='ghost'
          _hover={{
            boxShadow: '1px 1px 5px 1px #acd0d67a',
          }}
          fontSize={{ md: '0.75rem', sm: '0.75rem', base: '0.5rem' }}
          // onClick={() => onClick(id)}
        >
          {btnTilte}
        </Button>
      </>
    ) : (
      <Text color='#fff' textAlign='center' justifyContent='center'>
        {unClickTitle}
      </Text>
    )}
  </Box>
)

export default Card
