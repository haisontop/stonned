import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  Spinner,
  Center,
  Heading,
} from '@chakra-ui/react'
import React, { useMemo, useCallback, useState } from 'react'
import { RiTwitterLine } from 'react-icons/ri'
import { trpc } from '../../../utils/trpc'
import useWalletNfts from '../../../utils/useWalletNFTs'
import { useUser } from '../../../modules/common/authHooks'
import toast from 'react-hot-toast'
import { NftMetadata } from '../../../utils/nftmetaData.type'

interface UserAvatarEditProps {}

export default function UserAvatarEdit(props: UserAvatarEditProps) {
  const { nfts, loading: loadingNfts } = useWalletNfts()
  const editMutation = trpc.useMutation('launch.editUser', {})
  const { data, refetch } = useUser()
  const [isOpenModal, setOpenModal] = useState(false)
  const [selectedNft, setSelectedNft] = useState<NftMetadata>()

  const handleUseNFT = useCallback(async () => {
    if (!selectedNft) return

    const imageUrl = selectedNft.image

    try {
      await editMutation.mutateAsync({
        profilePictureUrl: imageUrl,
      })
      toast.success('successfully updated')
      refetch()
      handleCloseModal()
    } catch (e) {
      toast.error('failed')
    }
  }, [selectedNft])

  const handleCloseModal = useCallback(() => {
    setOpenModal(false)
    setSelectedNft(undefined)
  }, [])

  const handleChoose = useCallback(() => {
    setOpenModal(true)
  }, [])

  return (
    <Stack>
      <Heading fontSize={'1.5rem'} fontWeight={600} mb={'1.15rem'}>
        Update Profile Picture
      </Heading>
      <HStack spacing={4}>
        <Avatar
          size='xl'
          sx={{ width: '5.625rem', height: '5.625rem' }}
          src={data?.profilePictureUrl ?? undefined}
        ></Avatar>
        <Stack>
          <Button
            rounded={'md'}
            height='2rem'
            colorScheme={'gray'}
            background='#393E46'
            variant='solid'
            color='#fff'
            border='unset'
            onClick={handleChoose}
          >
            Use NFT from Wallet
          </Button>
          {/* <Button
            rounded={'md'}
            height='2rem'
            bg='transparent'
            border='2px solid #393E46'
          >
            Upload Image
          </Button> */}
        </Stack>
      </HStack>

      <Modal
        isCentered
        onClose={handleCloseModal}
        isOpen={isOpenModal}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose an image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loadingNfts ? (
              <Center my={'2rem'}>
                <Spinner size={'lg'} />
              </Center>
            ) : nfts.length === 0 ? (
              <Center my={'2rem'}>
                <Text>No NFT images found</Text>
              </Center>
            ) : (
              <SimpleGrid columns={[2, 3]} spacing={10}>
                {nfts.map((nft) => {
                  if (!nft.image) return null
                  return (
                    <Box
                      key={nft.name}
                      cursor='pointer'
                      border={
                        selectedNft?.image === nft.image
                          ? `1px solid black`
                          : 'none'
                      }
                      padding={2}
                      borderRadius={'10px'}
                    >
                      <Avatar
                        size={'100%'}
                        src={nft.image}
                        onClick={() => setSelectedNft(nft)}
                      />
                    </Box>
                  )
                })}
              </SimpleGrid>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleCloseModal}
              mr={3}
              variant='outline'
              colorScheme={'gray'}
            >
              Cancel
            </Button>
            <Button
              colorScheme='blue'
              onClick={handleUseNFT}
              disabled={!selectedNft}
            >
              Choose
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}
