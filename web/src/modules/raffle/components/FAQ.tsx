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
    heading: 'When can I buy tickets?',
    text: 'Tickets can be bought from the opening until the raffle drawing. This is indicated through the countdown at the top of the page. When it hits 0 the raffle is completed.',
  },
  {
    heading: 'How many prizes can I win?',
    text: `One ticket can win one prize = one NFT. If you buy multiple tickets you have the chance to win multiple prizes. So for every ticket you purchase you increase your chances of winning.`,
  },
  {
    heading: 'How do I know if I won?',
    text: `After the raffle is done, visit this page, connect your wallet and you will see if you have won a prize.`,
  },
  {
    heading: 'How can I claim my prize/NFT?',
    text: `You can claim your prize after the raffle is completed on this page. There will be a section on the top showing your wins with a button to claim them.`,
  },
  {
    heading: 'How many tickets are there?',
    text: `The number of tickets in unlimited.`,
  },
  {
    heading: 'How many tickets can I buy?',
    text: `You can buy as many as you like. The more you buy the higher the chance for a win!`,
  },
  {
    heading: 'Can I pay in $PUFF or $ALL',
    text: `Yes you can! We accept $PUFF, $ALL or SOL. Whatever you like best :)`,
  },
  {
    heading: 'What will happen with the $PUFF and $ALL?',
    text: `All $PUFF and $ALL will be 100% burned as way of giving back to the fucking best community out there`,
  },
]

export default function LotteryFAQ() {
  return (
    <Container pos='relative' maxWidth='100ch' pt='4rem' pb='6rem' id='faq'>
      <Divider />
      <Heading my='2rem' textAlign='center' fontWeight={700} fontSize='4xl' color='white'>
        FREQUENTLY ASKED QUESTIONS
      </Heading>

      <Accordion allowToggle>
        <Wrap spacing='0'>
          {faqs.map((f, i) => (
            <WrapItem
              key={i}
              width={{ base: '100%', md: '50%' }}
              padding='0 1rem'
            >
              <AccordionItem
                borderRadius='.5rem'
                margin='1rem 0'
                bg='transparent'
                width='100%'
                border='1px solid rgba(255, 255, 255, 0.4)'
              >
                <h4>
                  <AccordionButton background={'transparent'}>
                    <Box
                      flex='1'
                      textAlign='left'
                      fontWeight='600'
                      color='white'
                    >
                      {f.heading}
                    </Box>
                    <AccordionIcon color='white' />
                  </AccordionButton>
                </h4>

                <AccordionPanel pb='2'>
                  <Text color='white' fontWeight='300'>
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
