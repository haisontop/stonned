import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import React from 'react'

interface Faq {
  heading: string,
  text: string
}

const faqs: Faq[] = [
  {
    heading: 'How do Nuked Apes affect the SAC Genisis collection?',
    text: 'Our Nuked Apes add massive value to our Genesis collection. They should go up in price and become even more useful. To rescue an Ape, two Genesis apes of different roles are required. Genesis apes can be rented out for rescue missions to earn SOL.'
  },
  {
    heading: 'What can I do with my Nuked Ape?',
    text: `Nuked Apes are not your usual NFTs, as they give you access to the elaborated Stoned Ape Crew ("SAC") Ecosystem. This means access to exclusive SAC Alpha and WL spots, an entry ticket to the Amsterdam launch party (April or May) and other exclusive benefits. You can also stake your Nuked Ape, earn $PUFF and create a passive income!`
  },
  {
    heading: 'Who is eligible for an early access to the Dutch Auction Mint?',
    text: 'All SAC Genesis holders have early access to the Dutch Auction for a Nuked Ape. In addition to that a small portion of spots have been given out to holders of other projects.'
  },
  {
    heading: 'Do I need an SAC to get a Nuked Ape?',
    text: `You can go on a rescue mission with two Genesis Apes, which is the cheapest way to get a Nuked Ape. If you only own one Ape, you can rent a second one for a small fee. You can also take part in the Public Mint or buy a Nuked Ape on Magic Eden after the Public Mint is complete.`
  },
  {
    heading: 'How does this renting thing work?',
    text: `Ape holders can rent out their apes that they are not currently using for their own rescue mission to others. The holders can use it to earn Solana and the renters can get hold of a Nuked Ape for little money.`
  },
  {
    heading: 'Should I rescue, rent or mint?',
    text: `It's up to you. Since we want to reward SAC holders rescuing is the cheapest option. Renting is also a preferable option, as it is an advantageous way to get a Nuked Ape. We want everyone to be able to get one, and at the same time keep the starting price for the Dutch Auction as low as possible, to keep it fair for our holders.`
  },
  {
    heading: 'Can I re-use an SAC to rescue multiple Nuked Apes?',
    text: `Yes, you can. The rescue mission takes 3 days and after a cooldown phase of 7 days your apes are ready to go on a mission again. The $PUFF price increases for each ape you re-use by 30%. So, one re-used ape adds 30% $PUFF and two will add 60% $PUFF.`
  },
  {
    heading: 'I missed the mint, how can I get one?',
    text: `You can buy SAC and Nuked Apes on secondary markets, such as Magic Eden.`
  },
  {
    heading: 'What is a Legendary Nuked Ape and how can I get one?',
    text: `There are total of 14 hand drawn, animated Legendary Nuked Apes. Four of them will be included in the random distribution. 
    The other ten will be sold via Auctions on Magic Eden, with the first Legendary Auction starting on February 14th. Every 3-4 days the next auction will go live.`
  }
]

export default function Faq() {
  return (
  <Container 
    pos='relative' 
    maxWidth='100ch' 
    pt='4rem'
    pb='6rem'
    id='faq'
  >
    <Heading 
      textAlign='center'
      fontWeight={700}
      fontSize='4xl'
      mb='4rem'
    >
      FREQUENTLY ASKED QUESTIONS
    </Heading>

    <Accordion allowToggle>
      <Wrap spacing='0'>
        {faqs.map((f, i) => (
          <WrapItem width={{base:'100%', md:'50%'}} padding='0 1rem'>
            <AccordionItem
              border='none'
              borderRadius='.5rem'
              margin='1rem 0'
              bg='#F5F5F5'
              width='100%'
            >
              <h4>
                <AccordionButton  
                >
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

          <WrapItem width={{base:'100%', md:'50%'}} padding='0 1rem'>
            <AccordionItem
              border='none'
              borderRadius='.5rem'
              margin='1rem 0'
              bg='#F5F5F5'
              width='100%'
            >
              <h4>
                <AccordionButton  
                >
                  <Box flex='1' textAlign='left' fontWeight='600'>
                    How much $PUFF are the staking rewards for Nuked Apes?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h4>

              <AccordionPanel pb='2'>
                <Text color='black' fontWeight='300'>
                Nuked Apes can be staked to earn $PUFF. The amount is set by the rarity:<br/>
                - 14 Legendary Nuked Apes: 69 $PUFF per day<br/>
                - 50 Mystic Nuked Apes: 36 $PUFF per day<br/>
                - 100 Epic Nuked Apes: 16 $PUFF per day<br/>
                - 500 Rare Nuked Apes: 7 $PUFF per day<br/>
                - 3536 Common Nuked Apes: 3 $PUFF per day<br/><br/>
                This is approximately 10-15% of the staking rewards of the Genisis collection.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </WrapItem>
      </Wrap>
    </Accordion>
  </Container>
  )}

