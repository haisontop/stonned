import {
  Box,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Modal as ChakraModal,
} from '@chakra-ui/react'
import React, { ReactSVG } from 'react'
import { atom, useRecoilState } from 'recoil'

interface ModalProps {}

export const modalAtom = atom<{
  isOpen: boolean
  content: JSX.Element | null
  title?: string
}>({
  key: 'modal',
  default: {
    isOpen: false,
    content: null,
  },
})

export const useModal = () => {
  const [modal, setModal] = useRecoilState(modalAtom)

  return {
    open: (content: JSX.Element, args?: { title?: string }) => {
      setModal((m) => ({ isOpen: true, content, title: args?.title }))
    },
    close: () => {
      setModal((m) => ({ isOpen: false, content: null }))
    },
    isOpen: modal.isOpen,
    title: modal.title,
    content: modal.content,
  }
}

const Modal: React.FC<ModalProps> = () => {
  const modal = useModal()

  return (
    <ChakraModal size={'3xl'} isOpen={modal.isOpen} onClose={modal.close}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          {modal.title && <ModalHeader>{modal.title}</ModalHeader>}
          <ModalCloseButton />
          {modal.content}
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  )
}

export default Modal
