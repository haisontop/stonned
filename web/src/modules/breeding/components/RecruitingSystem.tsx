import {
  Stack,
  Heading,
  Spinner,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Container,
  Box,
} from '@chakra-ui/react'
import { web3 } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import React from 'react'
import toast, { useToaster } from 'react-hot-toast'
import { useAsyncFn } from 'react-use'
import { connection } from '../../../config/config'
import { NftMetadata } from '../../../utils/nftmetaData.type'
import { trpc } from '../../../utils/trpc'
import useWalletNfts from '../../../utils/useWalletNFTs'
import { useRentAccounts, useBreedingAccountsOfRenters, useAllApeUsed } from '../breeding.hooks';
import { NukedNft } from './NukedNft'

interface RecruitingProps {
  walletNftsRes: ReturnType<typeof useWalletNfts>
  rentAccountsRes: ReturnType<typeof useRentAccounts>
  apesUsedAllRes: ReturnType<typeof useAllApeUsed>
  breedingAccountsOfRentersRes: ReturnType<typeof useBreedingAccountsOfRenters>
  disableRole?: string
  showRental?: boolean
  title?: string
}

const RecruitingSystem: React.FC<RecruitingProps> = ({
  walletNftsRes,
  rentAccountsRes,
  breedingAccountsOfRentersRes,
  apesUsedAllRes,
  title,
}) => {
  const rentAccounts = rentAccountsRes.value

  const unrentMutation = trpc.useMutation('rent.unrent', {})
  const wallet = useWallet()

  const rentMutation = trpc.useMutation('rent.rent', {})

  const [rentOutRes, rentOut] = useAsyncFn(
    async (nft: NftMetadata) => {
      if (!wallet.signTransaction) return null

      const res = await rentMutation.mutateAsync({
        user: wallet.publicKey!.toBase58(),
        nft: nft.pubkey.toBase58(),
      })
      const transaction = web3.Transaction.from(Buffer.from((res as any).trans))

      await wallet.signTransaction(transaction)

      const serial = transaction.serialize({
        verifySignatures: false,
        requireAllSignatures: false,
      })
      try {
        const tx = await connection.sendRawTransaction(serial)

        await connection.confirmTransaction(tx, 'recent')

        toast.success('succesfully added ape to the recruiting pool')

        rentAccountsRes.retry()
      } catch (e: any) {
        toast.error(e.message)
        console.error('error on rent out ape', e)
      }
    },
    [wallet]
  )

  const [unRentRes, unRent] = useAsyncFn(
    async (
      rentAccount: NonNullable<ReturnType<typeof useRentAccounts>['value']>[0]
    ) => {
      if (!wallet.signTransaction) return null

      const nft = rentAccount.nft

      const res = await unrentMutation.mutateAsync({
        user: wallet.publicKey!.toBase58(),
        nft: nft.pubkey.toBase58(),
        rentingAccount: rentAccount.account.publicKey.toBase58(),
      })
      const transaction = web3.Transaction.from(Buffer.from((res as any).trans))

      await wallet.signTransaction(transaction)

      const serial = transaction.serialize({
        verifySignatures: false,
        requireAllSignatures: false,
      })
      try {
        const tx = await connection.sendRawTransaction(serial)

        await connection.confirmTransaction(tx, 'recent')

        walletNftsRes.refetch()

        toast.success('succesfully unrented ape')
      } catch (e: any) {
        toast.error(e.message)
        console.error('error on unreting ape', e)
      }
    },
    [wallet]
  )

  return (
      <Container width='100%' maxWidth='60rem' p={0}>
        <Box 
          borderRadius='8px'
          p='1.5rem'
          bg='rgba(255,255,255,0.15)'
          transition='all .3s ease-in-out'
        >
          <Tabs variant='soft-rounded' colorScheme='gray'>
            <TabList justifyContent='center'>
              <Tab color='#A1A1A6' transition='all .3s ease-in-out'>Your apes</Tab>
              <Tab color='#A1A1A6' transition='all .3s ease-in-out'>Your apes in the recruiting pool</Tab>
              <Tab color='#A1A1A6' transition='all .3s ease-in-out'>Your recruited apes</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack alignItems='center'>
                  {/*  <Heading>Available for Renting Out</Heading> */}
                  {(walletNftsRes.loading || apesUsedAllRes.loading) && (
                    <Stack direction='row'>
                      <Spinner />
                    </Stack>
                  )}

                  {!walletNftsRes.loading && walletNftsRes.nfts.length == 0 && (
                    <Box color='white' textAlign='center' fontWeight='500' mt={['1rem', '2rem']}>
                      No Apes available.
                    </Box>
                  )}

                  {walletNftsRes.nfts.length > 0 && (
                    <SimpleGrid columns={[1, 2, 3]} spacing={2}>
                      {walletNftsRes.nfts.map((nft, i: number) => {
                        return (
                          <NukedNft
                            key={i}
                            apesUsedAll={apesUsedAllRes.apesUsed}
                            nft={nft}
                            buttonText='Rent out'
                            onSelect={async () => rentOut(nft)}
                          />
                        )
                      })}
                    </SimpleGrid>
                  )}
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack alignItems='center'>
                  {/* <Heading>Rented Nfts</Heading> */}
                  {rentAccountsRes.loading && (
                    <Stack direction='row'>
                      <Spinner />
                    </Stack>
                  )}

                  {!rentAccountsRes.loading && ( !rentAccounts || rentAccounts?.length == 0) && (
                    <Box color='white' textAlign='center' fontWeight='500' mt={['1rem', '2rem']}>
                      No Apes in recruiting pool.
                    </Box>
                  )}

                  {rentAccounts && (
                    <SimpleGrid columns={[1, 2, 3]} spacing={2}>
                      {rentAccounts.map((rentAccount, i: number) => {
                        return (
                          <NukedNft
                            key={i}
                            nft={rentAccount.nft}
                            buttonText='Remove ape'
                            onSelect={() => unRent(rentAccount)}
                          />
                        )
                      })}
                    </SimpleGrid>
                  )}
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack alignItems='center'>
                  {/* <Heading>Rented Nfts</Heading> */}
                  {breedingAccountsOfRentersRes.loading && (
                    <Stack direction='row'>
                      <Spinner />
                    </Stack>
                  )}

                  {!breedingAccountsOfRentersRes.loading && ( !breedingAccountsOfRentersRes.value || breedingAccountsOfRentersRes.value?.length == 0) && (
                    <Box color='white' textAlign='center' fontWeight='500' mt={['1rem', '2rem']}>
                      No Apes are recruited.
                    </Box>
                  )}

                  {breedingAccountsOfRentersRes.value && (
                    <SimpleGrid columns={[1, 2, 3]} spacing={2}>
                      {breedingAccountsOfRentersRes.value.map((breedingAccount, i: number) => {
                        return (
                          <NukedNft
                            key={i}
                            nft={breedingAccount.apes[1]}
                          />
                        )
                      })}
                    </SimpleGrid>
                  )}
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
          </Box>
        </Container>
  )
}

export default RecruitingSystem
