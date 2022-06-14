import {
  Stack,
  Heading,
  Spinner,
  SimpleGrid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import React from 'react'
import { RescueApe } from '../../../pages/rescue'
import useWalletNfts from '../../../utils/useWalletNFTs'
import { TApeUsed, useAllApeUsed, useRentableAccounts } from '../breeding.hooks'
import { NukedNft } from './NukedNft'
import { RentableNft } from './RentableNft'

interface SelectApeModalProps {
  walletNftsRes: ReturnType<typeof useWalletNfts>
  rentableAccountsRes: ReturnType<typeof useRentableAccounts>
  onSelect: (ape: RescueApe) => void
  apesUsedAllRes: ReturnType<typeof useAllApeUsed>
  disableRole?: string
  showRental?: boolean
  modal: ReturnType<typeof useDisclosure>
  title?: string
}

const SelectApeModal: React.FC<SelectApeModalProps> = ({
  walletNftsRes,
  onSelect,
  disableRole,
  showRental,
  rentableAccountsRes,
  apesUsedAllRes,
  modal,
  title,
}) => {
  const rentableAccounts = rentableAccountsRes.value

  const hasApesForMission = walletNftsRes.nfts.filter((ape) => {
    if (!disableRole) return true

    return (
      ape.attributes.find((r) => r.trait_type === 'Role')?.value !== disableRole
    )
  })

  return (
    <Modal size={'3xl'} isOpen={modal.isOpen} onClose={modal.onClose}>
      <ModalOverlay />
      <ModalContent>
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalCloseButton />
        <ModalBody>
          <Tabs variant='soft-rounded' colorScheme='gray'>
            <TabList>
              <Tab>Your Apes</Tab>
              {showRental && <Tab>Recruit an Ape</Tab>}
            </TabList>
            <TabPanels padding={0} paddingY={3}>
              <TabPanel padding={0} paddingY={3}>
                <Stack alignItems='center'>
                  {(walletNftsRes.loading || apesUsedAllRes?.loading) && (
                    <Stack direction='row'>
                      <Spinner />
                    </Stack>
                  )}

                  {(walletNftsRes.nfts as any).length > 0 && (
                    <SimpleGrid columns={[1, 2, 3]} spacing={2}>
                      {walletNftsRes.nfts
                        .filter((ape) => {
                          if (!disableRole) return true

                          return (
                            ape.attributes.find((r) => r.trait_type === 'Role')
                              ?.value !== disableRole
                          )
                        })
                        .map((nft, i: number) => {
                          return (
                            <NukedNft
                              key={i}
                              nft={nft}
                              showAvailableOnTheSide={true}
                              apesUsedAll={apesUsedAllRes?.apesUsed}
                              height={{ base: '200px', xl: '250px' }}
                              buttonText='Select for Rescue'
                              onSelect={() => {
                                onSelect(nft)
                                modal.onClose()
                              }}
                            />
                          )
                        })}
                    </SimpleGrid>
                  )}
                </Stack>
              </TabPanel>
              {showRental && (
                <TabPanel padding={0} paddingY={3}>
                  <Stack alignItems='center'>
                    <Heading color='white'>Rentable Apes</Heading>
                    {(rentableAccountsRes.loading ||
                      apesUsedAllRes.loading) && (
                      <Stack direction='row'>
                        <Spinner color='white' />
                      </Stack>
                    )}

                    {rentableAccounts && rentableAccounts.length > 0 && (
                      <SimpleGrid columns={[1, 2, 3]} spacing={2}>
                        {rentableAccounts
                          .filter((r) => {
                            if (!disableRole) return true
                            const ape = r.nft
                            return (
                              ape.attributes.find(
                                (r) => r.trait_type === 'Role'
                              )?.value !== disableRole
                            )
                          })
                          .map((rentableAccount, i: number) => {
                            return (
                              <RentableNft
                                key={i}
                                apesUsedAll={apesUsedAllRes?.apesUsed}
                                rentAccount={rentableAccount}
                                refetchEvolutionAccounts={() => {
                                  walletNftsRes.refetch()
                                }}
                                onSelect={() => {
                                  onSelect(rentableAccount)
                                  modal.onClose()
                                }}
                              />
                            )
                          })}
                      </SimpleGrid>
                    )}
                  </Stack>
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SelectApeModal
