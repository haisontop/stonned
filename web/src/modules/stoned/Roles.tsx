import {
  Box,
  Flex,
  SimpleGrid,
  Image,
  Stack,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { OriginStoryModal } from './OriginStoryModal';

interface Props {
  activeRole: string;
  role: string;
  title?: string;
  description?: string;
  earnings?: string;
}

const ScrollItem: React.FC<Props> = (props) => {
  const isActive = () => props.activeRole == props.role;
  return (
    <Box my={{ base: '75px', md: '100px' }}>
      {props.role && props.role == 'chimpion' && (
        <Box display='inline-block'>
          <Box display='flex' background='#EBEBEB' borderRadius='5px' padding='.25rem .75rem' alignContent='center'>
            <Text display='inline' fontSize='.675rem' color='#333' fontWeight='600'>Not a role but still loved ❤️</Text>
          </Box>
        </Box>
      )}
      <Text
        fontSize='3xl'
        fontWeight='bold'
        transition='all .2s ease-in-out'
        color={`${isActive() ? 'black' : 'grey'}`}
        fontFamily='Montserrat'
      >
        {props.title}
      </Text>
      <Text color='grey' fontSize='.875rem' opacity={`${isActive() ? '1' : '0'}`} transition='all .15s ease-in-out'>
        {props.description}
      </Text>
      <Box display='inline-block' opacity={`${isActive() ? '1' : '0'}`} mt='.5rem'>
          <Box display='flex' background='#E2EFBC' borderRadius='5px' padding='.25rem .75rem' alignContent='center'>
            <Text display='inline' fontSize='.75rem' color='#333' fontWeight='600'>
              {props.earnings}
            </Text>
          </Box>
      </Box>
    </Box>
  )
}

const RoleItem: React.FC<{ role: string, activeRole: string }> = (props) => {
  return (
    <Box display={`${props.activeRole == props.role ? 'block' : 'none'}`}>
      <Image
        src={`/images/roles/role_${props.role}.png`}
        w='100%'
        borderRadius='.6rem'
        filter='drop-shadow(0px 2px 20px rgba(0, 0, 0, 0.15))'
      />
      <Text fontSize='.875rem' color='grey' fontWeight='600' padding='1rem'>{props.children}</Text>
    </Box>
  )
}


export default function Roles() {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [activeRole, setActiveRole] = useState('artist');
  const [displayMobilePic, setdisplayMobilePic] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null)

  const roles = ['artist', 'business', 'farmer', 'scientist', 'chimpion']

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
  });

  const startHeight = 200;
  const showMobileStart = -250;
  //const showMobileEnd = height;


  const handleScroll = () => {
    if (scrollRef && scrollRef.current) {
      const { top, bottom } = scrollRef.current.getBoundingClientRect();
      const current = (top - startHeight) * -1;
      const triggerHeight = 180;

      const boxHeight = scrollRef.current.scrollHeight;
      const screenHeight = window.innerHeight;
      const showMobileEnd = boxHeight - screenHeight - showMobileStart + 70;

      if (current > showMobileStart && current < showMobileEnd && !displayMobilePic) setdisplayMobilePic(true)
      if ((current > showMobileEnd || current < showMobileStart) && displayMobilePic) setdisplayMobilePic(false)

      if (current > 0) {
        const index = Math.floor(current / triggerHeight)
        if (index < 5 && index > -1 && activeRole != roles[index]) {
          setActiveRole(roles[index])
        }
      }
    }
  }

  return (
    <Flex
      bg={'white'}
      p={{ base: 4, md: 5 }}
      w='full'
    >
      <OriginStoryModal onClose={onClose} isOpen={isOpen} children={undefined}></OriginStoryModal>

      <Box maxW='1600px' mx='auto' mb='3rem'>
        <Stack mt='3rem'>
          <Heading fontSize='4xl' fontWeight={700} textAlign='center' pb='30px' fontFamily={'Montserrat, sans-serif'}>
            <Text as={'span'} color={'#181430'} fontWeight={700} fontSize='4xl'>
              FOUR
              {' '}<Text as={'span'} color={'white'} fontWeight={700} fontSize='4xl'
                textShadow='-1px -1px 0 #181430, 1px -1px 0 #181430, -1px 1px 0 #181430, 1px 1px 0 #181430'>
                STONED
              </Text> {' '}
              ROLES
            </Text>
          </Heading>
          <Text color='#888' textAlign='center' fontWeight={600} fontFamily={'Montserrat, sans-serif'}>
            Each Ape has a <Text as={'span'} color='#000' fontWeight={600}>role</Text> in the stoned metaverse. What will your role be?
          </Text>
          <Text textAlign='center' pb='3rem'>
            <Text as={'span'} textDecoration='underline' fontWeight={600} fontSize='1rem' color='#888' textAlign='center'
              transition='all .15s ease-in-out'
              _hover={{
                color: '#000',
                cursor: 'pointer'
              }}
              onClick={onOpen}
            >
              Learn more about our Origin Story
            </Text>
          </Text>
          
        </Stack>

        <SimpleGrid position='relative' columns={{ base: 1, md: 2 }} spacing={10} ref={scrollRef}>
          <Box
            h={{ base: 'unset', md: 'unset' }}
            pt={{ base: '0', md: '20%' }}
            pb={{ base: '80%', md: '40%' }}
            mt={{ base: '-50px', md: '0' }}
            paddingLeft='2rem'
            paddingRight='6rem'
            maxWidth='35rem'
          >
            <ScrollItem role='artist' activeRole={activeRole}
              title='Artist 🎨'
              description='Rumor has it that the first drawing our artist genius created back in times, was from his two girls: Maria and Juana.'
              earnings='Earns 30 $PUFF + 42 $ALL per Day'
            ></ScrollItem>
            <ScrollItem role='business' activeRole={activeRole}
              title='Business Ape 📈'
              description='The ape who sold weed before fire was even discovered, telling you it will be higher in price tomorrow.'
              earnings='Earns 30 $PUFF + 42 $ALL per Day'
            ></ScrollItem>
            <ScrollItem role='farmer' activeRole={activeRole}
              title='Farmer 🌱'
              description='The best thing: He makes his own fertilizer.'
              earnings='Earns 30 $PUFF + 42 $ALL per Day'
            ></ScrollItem>
            <ScrollItem role='scientist' activeRole={activeRole}
              title='Scientist 🧬'
              description='Have you ever heard about psychedelic bananas? No? Ahm we neither...'
              earnings='Earns 30 $PUFF + 42 $ALL per Day'
            ></ScrollItem>
            <ScrollItem role='chimpion' activeRole={activeRole}
              title='Chimpion 🙉'
              description='PUFFin and chillin with his friends in the Stoned Ape Crew, dreaming of one day getting a role by being sent on retreat.'
              earnings='Earns 15 $PUFF + 42 $ALL per Day'
            ></ScrollItem>
          </Box>

          <Box
            h={{ base: '350px', md: '600px' }}
            w={{ base: '250px', md: 'unset' }}
            position={{ base: 'fixed', md: 'sticky' }}
            top={{ base: 'unset', md: '0' }}
            bottom={{ base: '0', md: 'unset' }}
            right={{ base: '0', md: 'unset' }}
            alignItems='center'
            display='flex'
            opacity={{ base: `${displayMobilePic ? '1' : '0'}`, md: '1' }}
            transition='all .15s ease-in-out'
            paddingTop='2rem'
          >
            <Box
              h={{ base: '250px', md: '600px' }}
              w={{ base: '250px', md: '500px' }}
              position={{ base: 'absolute', md: 'unset' }}
              bottom={{ base: '20px', md: 'unset' }}
              right={{ base: '20px', md: 'unset' }}
            >
              <RoleItem
                activeRole={activeRole}
                role='artist'
              ></RoleItem>
              <RoleItem
                activeRole={activeRole}
                role='business'
              ></RoleItem>
              <RoleItem
                activeRole={activeRole}
                role='farmer'
              ></RoleItem>
              <RoleItem
                activeRole={activeRole}
                role='scientist'
              ></RoleItem>
              <RoleItem
                activeRole={activeRole}
                role='chimpion'
              ></RoleItem>
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  )
}

