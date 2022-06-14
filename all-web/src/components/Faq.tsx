import { useColorModeValue } from '@chakra-ui/color-mode'
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Image,
  Heading,
  Stack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

const faqs = [
  {
    question: 'How were the Stoned Apes created?',
    answer:
      'Brainchild of celebrated artist @stoner0015, each Ape was procedurally generated from a collection of hand drawn items.',
  },
  {
    question: 'When was the Genesis mint?',
    answer:
      'The Stoned Apes mint was on November 28th and sold out in 2 minutes. This day will stay in our hearts forever.', // We know, the whole world is waiting for a Stoned Ape and we get this question like 10B times a day. The mint will be very soon, mid November. But till then you need to be tough and patient, like you were when you were a child and waited for Christmas. Which is soon as well...
  },
  {
    question: 'What can I do with my Ape?',
    answer:
      'Puhhh, how many hours do you have..? There are so much fun things to do in the Stoned Ape metaverse, you can collect, exchange and stake your Apes. Or just print them and put them up somewhere in your room. Who needs Picasso? Or just HODL.',
  },
  {
    question: 'What can I do with my $PUFF?',
    answer: `HODL, Buy weed, Generate a passive income, Upgrade your chimpion,... But if that's to boring for you, switch to our $PUFF site and get some inspiration over there. `,
  },
  {
    question: 'How many Stoned Apes are there?',
    answer: 'With our mint, there will be 4200 (lol) Stoned Apes up to grab.',
  },
  {
    question: `What's this staking thing about?`,
    answer:
      ' Stake your Ape to earn $PUFF Dao tokens and role tokens. Apes with roles get 2x    $PUFF. With this tokens you will live in the stoned metaverse like the father of Bob Marley.',
  },
  {
    question: 'How about the roles?',
    answer:
      ' Stoned Ape is the first NFT with 4 roles: Scientists, Business guys, Farmers & Artists which produce 30 $PUFF/day when staked. We also have Normies called Chimpions, staked they will produce 15 $PUFF/day ',
  },
  {
    question: 'How is the evolution working?',
    answer:
      ' We invented a concept for an NFT evolution: Combine a Chimpion + $PUFF Tokens to send your Ape into retreat. After 3 days, he can adapt new a role.',
  },
  {
    question: `What's next?`,
    answer:
      'Many things are planned. Nuked Apes, GIF Collection, Apes Going Mulitplanetary, Ape Lottery and so on. To keep track of all those stuff, join our Discord ;)',
  },
  {
    question: 'But Amsterdam though...',
    answer:
      ' We promise: The most stoned launch party in Amsterdam. Yes, there will be waffles as well. PUFF PUFF!',
  },
]

export default function Faq() {
  return (
    <Box
      id='faq'
      bg={{ base: useColorModeValue('primary', 'gray.600'), md: useColorModeValue('#F9FAFB', 'gray.600') }}
      p={{ base: 6, md: 20 }}
      w='full'
    >
      <Box
        /*shadow={{ md: 'lg' }}*/
        transition={'ease-in-out all .2s'}
        _hover={{
          boxShadow: {
            base: 'none',
            md: '12px 12px 48px rgba(32, 189, 129, 0.4), inset 18px 18px 30px #27b887, inset -18px -18px 30px #27b887',
          },
          transform: 'translate(0px, -8px)',
        }}
        boxShadow={{base: 'none', md: 'inset 18px 18px 30px #27b887, inset -18px -18px 30px #27b887'}}
        bg={{ md: useColorModeValue('primary', 'gray.800') }}
        color='#fff'
        px={{ md: 20 }}
        py={{ md: 10 }}
        pb={{ base: 4, md: 14 }}
        mx='auto'
        borderRadius={'16px'}
      >
        <Box justifyContent='center' alignItems='center'>
          <Stack spacing='1.5rem'>
            <Heading fontSize='5xl' fontWeight={500} textAlign='center'>
              FAQ
            </Heading>

            <Accordion
              allowToggle
            >
              {faqs.map((f, i) => (
                <AccordionItem borderRadius={'16px'}>
                  <h2>
                    <AccordionButton bgColor='primary' _hover={{}}>
                      <Box flex='1' textAlign='left' fontWeight={'semibold'}>
                        {f.question}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text fontSize='sm'>{f.answer}</Text>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>

            {/* <Stack spacing='1rem'>
              {faqs.map((f, i) => (
                <Box key={i}>
                  <Heading
                    fontWeight='400'
                    fontSize='2xl'
                    as='h5'
                  >
                    {f.question}
                  </Heading>
                    <Box>
                      <Text>{f.answer}</Text>
                    </Box>
                </Box>
              ))}
            </Stack> */}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
