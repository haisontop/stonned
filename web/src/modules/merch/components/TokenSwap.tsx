import {
  Container,
  Flex,
  Grid,
  GridItem,
  Image,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import React from 'react'
import { useAsync } from 'react-use'
import { useRecoilState } from 'recoil'
import { GradientButton } from '../../../components/GradientButton'
import { LabelText } from '../../../components/Texts/LabelText'
import {
  getNftsFromOwnerByCreators,
  getNftsFromOwnerByMints,
} from '../../../utils/splUtils'
import { merchConfig, currentDrops } from '../merchConfig'
import { selectedProductTokensAtom } from '../merchUtils'

interface MerchTokenSwap {
  onClickCheckout: () => void
}

export default function MerchTokenSwap(props: MerchTokenSwap) {
  const { onClickCheckout } = props

  const [selectedProductTokens, setSelectedProductTokens] = useRecoilState(
    selectedProductTokensAtom
  )

  const wallet = useWallet()

  const producTokensRes = useAsync(async () => {
    if (!wallet.publicKey) return

    const productTokens = await getNftsFromOwnerByMints({
      mints: currentDrops.map((c) => c.nft),
      owner: wallet.publicKey,
    })
    return productTokens
  }, [wallet])

  return (
    <Container
      // h={['90vh', '100vh']}
      pt={['3rem', '6rem']}
      pos='relative'
      maxWidth='2xl'
      justifyContent='center'
      alignItems='center'
    >
      <Container maxW='6xl'>
        <Stack spacing={[16]} alignItems='center' mt={['28px', 0]}>
          <Text
            fontSize={[48]}
            lineHeight={['58px']}
            fontWeight={600}
            fontFamily='Montserrat'
          >
            YOUR TOKENS
          </Text>
          <Stack spacing={10}>
            <LabelText>
              Select the token you want to swap for the real product.
            </LabelText>
            {producTokensRes.loading ? (
              <Spinner alignSelf={'center'} />
            ) : (
              <Grid templateColumns='repeat(2, 1fr)' gap={12}>
                {producTokensRes.value &&
                  producTokensRes.value.map((token, i) => (
                    <GridItem
                      px={[2]}
                      py={[3]}
                      background='#F6FCFD'
                      border={
                        selectedProductTokens.find((t) =>
                          t.nft.pubkey.equals(token.nft.pubkey)
                        )
                          ? '5px solid #CBCBCB'
                          : '1px solid #CBCBCB'
                      }
                      borderRadius='20px'
                      key={i}
                      onClick={(e) =>
                        setSelectedProductTokens((old) => {
                          const newValue = [...old]

                          const found = newValue.findIndex((t) =>
                            t.nft.pubkey.equals(token.nft.pubkey)
                          )

                          if (found > -1) newValue.splice(found)
                          else newValue.push(token)

                          return newValue
                        })
                      }
                      _hover={{ cursor: 'pointer' }}
                    >
                      <Image
                        /* fallback={
                          <Flex
                            height={'300px'}
                            alignItems={'center'}
                            justifyContent='center'
                          >
                            <Spinner alignSelf={'center'} />
                          </Flex>
                        } */
                        src={token.nft.image}
                        width='314px'
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
                        {token.nft.name}
                      </Text>
                    </GridItem>
                  ))}
              </Grid>
            )}
          </Stack>

          <LabelText fontWeight={500} color='#000' px={4}>
            By ordering your product, the SAC Token will be burned and the
            product will be delivered to your given address. We expect delivery
            in 4-16 business days depending on your location.
          </LabelText>

          <GradientButton
            backgroundColor='#FAFAFA'
            onClick={() => onClickCheckout()}
            gradientDirection='left'
            variant='solid'
            isDisabled={selectedProductTokens.length === 0}
          >
            Checkout
          </GradientButton>
        </Stack>
      </Container>
    </Container>
  )
}

function useNavigate() {
  throw new Error('Function not implemented.')
}
