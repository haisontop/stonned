import { useColorModeValue } from '@chakra-ui/system'
import { HStack, Stack, Text, Image } from '@chakra-ui/react'
import LabelTitle from './LabelTitle'

interface WalletProjectCardProps {
  imageURL: string
  title: string
  subtitle: string
  mintedCount: number
  mintPrice: number
  mintCurrency: string
}

const WalletProjectCard: React.FC<WalletProjectCardProps> = ({
  imageURL,
  title,
  subtitle,
  mintedCount,
  mintPrice,
  mintCurrency,
}) => {
  const cardBg = useColorModeValue('#fff', '#101011')

  return (
    <Stack
      width={'15.625rem'}
      minWidth={'15.625rem'}
      spacing={2}
      alignItems='flex-start'
      borderRadius={'10px'}
      boxShadow='0px 2px 10px rgba(0, 0, 0, 0.15)'
      p={2}
      my={1}
      mx={2}
      bg={cardBg}
    >
      <Image
        src={imageURL}
        height='166px'
        objectFit={'cover'}
        borderRadius='5px'
        width='100%'
      />
      <Stack spacing={0}>
        <Text fontSize='1rem' fontWeight={600}>
          {title}
        </Text>
        <Text fontSize='.75rem' fontWeight={400}>
          {subtitle}
        </Text>
      </Stack>
      <HStack justifyContent={'space-between'} width='100%'>
        <LabelTitle
          label='Minted Count'
          title='2'
          textAlign={'left'}
        ></LabelTitle>
        <LabelTitle
          label='Mint Price (avg)'
          title='0.69 SOL'
          textAlign={'right'}
        ></LabelTitle>
      </HStack>
    </Stack>
  )
}

export default WalletProjectCard
