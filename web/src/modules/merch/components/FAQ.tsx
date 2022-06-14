import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Divider,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import React from 'react'

interface Faq {
  heading: string
  text: string
}

const faqs: Faq[] = [
  {
    heading: 'How can I get Moon Fuel Products?',
    text: 'The drop will go down on https://stonedapecrew.com/store at 3 PM UTC paid with 50% Sol & 50% $Puff.',
  },
  {
    heading: 'How long is the delivery time?',
    text: `The products will be packed & express-shipped from Germany, as the products are crafted in Switzerland. It should take 4-16 business days depending on your location.`,
  },
  {
    heading: 'Do I need to pay for international shipping?',
    text: `No, we offer free worldwide shipping to all legal destinations based on the data provided by the swiss lab. Europe / UK / US / Canada. Excluding most parts of South America, Asia & Australia..`,
  },
  {
    heading: 'How are customs working?',
    text: `We cleared the correct hs-codes for international shipping & provide all legal necessary information to the forwarder. As they are individual regulations regarding customs, it could be the case that you need to pay customs costs yourself.`,
  },
  {
    heading: 'What will happen with the $PUFF?',
    text: `All $PUFF will be 100% burned as way of giving back to the fucking best community out there`,
  },
  {
    heading: 'What will happen with the Sol?',
    text: 'We will use that for our IRL-Products growth & expansion in the next weeks.',
  },
]

export default function MerchFAQ() {
  return (
    <Container pos='relative' maxWidth='100ch' pt='4rem' pb='6rem' id='faq'>
      <Divider />
      <HStack
        display={['none', 'flex']}
        alignItems={'center'}
        spacing={4}
        marginY={16}
        justifyContent='center'
      >
        <Heading textAlign='center' fontWeight={700} fontSize='4xl'>
          FREQUENTLY ASKED
        </Heading>
        <Heading
          color='white'
          textAlign='center'
          fontWeight={700}
          fontSize='4xl'
          textShadow={
            '-1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000,-1px -1px 0 #000;'
          }
        >
          QUESTIONS
        </Heading>
      </HStack>
      <VStack
        display={['flex', 'none']}
        alignItems={'center'}
        spacing={4}
        marginY={16}
        justifyContent='center'
      >
        <Heading textAlign='center' fontWeight={700} fontSize='4xl'>
          FREQUENTLY ASKED
        </Heading>
        <Heading
          color='white'
          textAlign='center'
          fontWeight={700}
          fontSize='4xl'
          textShadow={
            '-1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000,-1px -1px 0 #000;'
          }
        >
          QUESTIONS
        </Heading>
      </VStack>

      <Accordion allowToggle>
        <Wrap spacing='0'>
          {faqs.map((f, i) => (
            <WrapItem
              key={i}
              width={{ base: '100%', md: '50%' }}
              padding='0 1rem'
            >
              <AccordionItem
                border='none'
                borderRadius='.5rem'
                margin='1rem 0'
                bg='#F5F5F5'
                width='100%'
              >
                <h4>
                  <AccordionButton>
                    <Box flex='1' textAlign='left' fontWeight='600'>
                      {f.heading}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h4>

                <AccordionPanel pb='2'>
                  <Text color='black' fontWeight='300'>
                    {f.text}
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            </WrapItem>
          ))}
        </Wrap>
      </Accordion>
    </Container>
  )
}
