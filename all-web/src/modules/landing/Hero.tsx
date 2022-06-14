import { Box, Heading } from '@chakra-ui/react'

export const Hero = () => {
  return (
    <Box>
      <Heading fontSize={['2xl', '4xl', '5xl']} fontWeight='700'>
        This is ALL Blue.
      </Heading>
      <Heading
        mt={['1rem', '2.5rem']}
        fontSize={['2xl', '4xl', '5xl']}
        fontWeight='700'
        color={'#888888'}
        maxWidth='48rem' 
        css={{
          '& > span': {
            color: 'black', 
          }, 
        }}
      >
        An <span>incubator</span> for NFT projects. <br /> We combine everything
        you need for creating <span>successful NFTs</span> on Solana.
      </Heading>
    </Box>
  )
}
