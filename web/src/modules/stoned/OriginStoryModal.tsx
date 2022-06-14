import { Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import React, { ComponentProps } from 'react'

export const OriginStoryModal: React.FC<ComponentProps<typeof Modal>> = (props) => {
  return (
  <Modal
    isCentered
    onClose={props.onClose}
    isOpen={props.isOpen}
    size='xl'
  >
    <ModalOverlay />
    <ModalContent background='white' color='black' borderRadius='.5rem' maxHeight='80vh'>
      <ModalCloseButton />
      <ModalHeader></ModalHeader>
      <ModalBody overflow='scroll'>
        <Heading textAlign='center' fontSize='2xl' fontWeight={700} fontFamily={'Montserrat, sans-serif'} mb='1rem'>
          Origin Story 🌱
        </Heading>
        <Text fontSize='1rem' mb='1rem'>
          Day 431 after the impact and we're still searching for other survivors and civilizations. Exactly 4200 of us survived. At first, we wondered: why did only we survive, and where are all the other species?
          This question kicked off a great revolution in our small society and we started to evolve as a community. Some of us are risk-takers and start exploring all of the remaining plants of the newly arisen ecosystem. 
          Eating, smoking, cooking everything was done with various bushes and trees, but nothing really helped to overcome the anxiety of the impact.
        </Text>
        <Text fontSize='1rem' mb='1rem'>
          Our scientists are focusing their research on developing a proper solution for creating strong and conscious minds to expand the power of this positive community. 
          They analysed dead animals affected by the incident and found out that most of them haven't died because of the impact directly but rather because of their panic and immensely high heart rate, but still no medicine for helping our society. 
        </Text>
        <Text fontSize='1rem' mb='1rem'>
          Tired of not getting their wanted results a couple of the best scientists choose to go for a walk to get new ideas. Suddenly a well-known artist crosses the street and is running towards the scientists. “I found a holy plant, you have to research this one,’” screamed the artist. Stunned by an amazing smell all scientists started to notice the plant. At the end of the workday at 4:20, nobody was motivated to get back to the lab again, so they agreed on smoking some of this special plant. 
        </Text>
        <Text fontSize='1rem' mb='1rem'>
          After taking a few inhales, the effects slowly arise with getting more conscious and vanishing unneeded anxiety. Surprised by this BREAKTHROUGH they got back to their lab and consulted all farmers, for growing more of this. Building new personalized strains and researching the benefits will be the major things the scientists are aiming for. 
        </Text>
        <Text fontSize='1rem' mb='1rem'>
          The perfect weather conditions are helping our farmers for growing weed of the highest quality. More and more chimpions starting to benefit and evolve into more conscious minds. Harvest time is coming, so farmers experiencing delays with the distribution. Sounds like we need businessmen here, to make sure that everyone gets used to the value of this holy plant. 
        </Text>
        <Text fontSize='1rem' mb='1rem'>
          Soon a flourishing civilization evolves with the help of scientists, farmers, artists, and businessmen. The community turns out to be very lovely, helpful and with the innovation of weed, a fabulous journey is starting... 
        </Text>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </ModalContent>
  </Modal>
  )
}