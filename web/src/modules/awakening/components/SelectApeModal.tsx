import {
  Image,
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
  Box,
  HStack,
  Button,
  Badge,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { sacCollection } from '../../../config/collectonsConfig'
import { NftMetadata } from '../../../utils/nftmetaData.type'
import { getCollectionByMetadata } from '../../../utils/solUtils'
import useWalletNfts from '../../../utils/useWalletNFTs'

interface SelectApeModalProps {
  walletNftsRes: any
  onSelect: (ape: NftMetadata) => void
  disableRole?: string
  showRental?: boolean
  modal: ReturnType<typeof useDisclosure>
  title?: string
}

const SelectApeModal: React.FC<SelectApeModalProps> = ({
  walletNftsRes,
  onSelect,
  disableRole,
  modal,
  title,
}) => {
  return (
    <Modal size={'3xl'} isOpen={modal.isOpen} onClose={modal.onClose}>
      <ModalOverlay />
      <ModalContent
        style={{
          background: '#2c2c2c',
          color: '#fff',
        }}
      >
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalCloseButton />
        <ModalBody>
          <Stack alignItems='center'>
            {walletNftsRes.isLoading && (
              <Stack direction='row'>
                <Spinner />
              </Stack>
            )}

            {((walletNftsRes.data?.nukedApes as any) || []).length > 0 && (
              <SimpleGrid columns={[1, 2, 3]} spacing={2}>
                {walletNftsRes.data?.nukedApes
                  .filter((nukedApe: any) => {
                    const nft = nukedApe?.nft
                    return !nft.attributes?.find(
                      (a: any) =>
                        a.trait_type === 'Type' && a.value === 'Awakened'
                    )
                  })
                  .map((nukedApe: any, i: number) => {
                    const nft = nukedApe?.nft
                    const nftInfo = (() => {
                      const collection = getCollectionByMetadata(nft)
                      if (!collection) return { type: 'Error' }
                      if (collection.symbol === 'NAC') {
                        const rarityRankAttribute = nft?.attributes?.find(
                          (a: any) => a.trait_type === 'Rarity Rank'
                        )
                        return {
                          symbol: collection.symbol,
                          type: rarityRankAttribute?.value as string,
                        }
                      } else {
                        const roleAttribute = nft?.attributes?.find(
                          (a: any) => a.trait_type === 'Role'
                        )
                        return {
                          symbol: collection.symbol,
                          type: roleAttribute?.value as string,
                        }
                      }
                    })()

                    return (
                      <Box
                        key={nft.name}
                        borderRadius='lg'
                        overflow='hidden'
                        bgColor='#1a1a1a'
                        color='#fff'
                        boxShadow={'2xl'}
                        transition='ease-in-out all .25s'
                      >
                        <Image
                          height={'300px'}
                          maxWidth={'300px'}
                          transition='ease-in-out all .25s'
                          _hover={{}}
                          src={nft.image}
                          alt={nft.description || nft.name}
                        />
                        <Stack p='2.5'>
                          <Heading lineHeight='tight' size='sm' isTruncated>
                            {nft.name}
                          </Heading>
                          <HStack justifyContent='left'>
                            <Badge
                              borderRadius='12px'
                              colorScheme='teal'
                              lineHeight='tight'
                              paddingX={2}
                              paddingY='2px'
                              size='md'
                              isTruncated
                            >
                              {nftInfo.symbol}
                            </Badge>
                            <Badge
                              borderRadius='12px'
                              colorScheme='green'
                              lineHeight='tight'
                              paddingX={2}
                              paddingY='2px'
                              size='md'
                              isTruncated
                            >
                              {nftInfo.type}
                            </Badge>
                          </HStack>
                          <Button
                            size='sm'
                            fontSize='0.75rem'
                            colorScheme='black'
                            mt={2}
                            onClick={async (e) => {
                              if (onSelect) {
                                await onSelect(nft)
                              }
                            }}
                          >
                            Select
                          </Button>
                        </Stack>
                      </Box>
                    )
                  })}
              </SimpleGrid>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SelectApeModal
