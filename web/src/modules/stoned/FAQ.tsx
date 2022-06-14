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
  import {useState} from 'react'
  import { HiPlusCircle } from 'react-icons/hi'
  import { HiMinusCircle } from 'react-icons/hi'

  
  
  interface Faq {
    heading: string,
    text: string
  }
  

  const faqs: Faq[] = [
    {
      heading: 'How were the Stoned Apes created?',
      text:
        'Brainchild of celebrated artist @stoner0015, each Ape was procedurally generated from a collection of hand drawn items.',
    },
    {
      heading: 'When was the Genesis mint?',
      text:
        'The Stoned Apes mint was on November 28th and sold out in 2 minutes. This day will stay in our hearts forever.', // We know, the whole world is waiting for a Stoned Ape and we get this heading like 10B times a day. The mint will be very soon, mid November. But till then you need to be tough and patient, like you were when you were a child and waited for Christmas. Which is soon as well...
    },
    {
      heading: 'What can I do with my Ape?',
      text:
        'Puhhh, how many hours do you have..? There are so much fun things to do in the Stoned Ape metaverse, you can collect, exchange and stake your Apes. Or just print them and put them up somewhere in your room. Who needs Picasso? Or just HODL.',
    },
    {
      heading: 'What can I do with my $PUFF?',
      text: `Hm where should we begin with? On-chain evolution, rescue missions, awakening. Integrations into protocols in the Solana ecosystem, usage in our online store, our first merch drop. For details check docs.stonedapecrew.com`,
    },
    {
      heading: 'How many Stoned Apes are there?',
      text: 'With our mint, there will be 4200 (lol) Stoned Apes up to grab.',
    },
    {
      heading: `What's this staking thing about?`,
      text:
        ' Stake your Ape to earn $PUFF Dao tokens and role tokens. Apes with roles get 2x    $PUFF. With this tokens you will live in the stoned metaverse like the father of Bob Marley.',
    },
    {
      heading: 'How about the roles?',
      text:
        ' Stoned Ape is the first NFT with 4 roles: Scientists, Business guys, Farmers & Artists which produce 30 $PUFF/day when staked. We also have Normies called Chimpions, staked they will produce 15 $PUFF/day ',
    },
    {
      heading: 'How is the evolution working?',
      text:
        ' We invented a concept for an NFT evolution: Combine a Chimpion + $PUFF Tokens to send your Ape into retreat. After 3 days, he can adapt new a role.',
    },
    {
      heading: `What's next?`,
      text:
        'Many things are planned. Nuked Apes, GIF Collection, Apes Going Mulitplanetary, Ape Lottery and so on. To keep track of all those stuff, join our Discord ;)',
    },
    {
      heading: 'But Amsterdam though...',
      text:
        ' We promise: The most stoned launch party in Amsterdam. Yes, there will be waffles as well. PUFF PUFF!',
    },
  ]
  
  export default function xFaq() {
    const [isExpanded, setIsExpanded] = useState(true)
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
          color='black'
          mb='4rem'
          fontFamily={'Montserrat, sans-serif'}
        >
          <Text as={'span'} color={'#181430'} fontWeight={700} fontSize='4xl'>
          FREQUENTLY ASKED
              {' '}<Text as={'span'} color={'white'} fontWeight={700}  fontSize='4xl'
              textShadow='-1px -1px 0 #181430, 1px -1px 0 #181430, -1px 1px 0 #181430, 1px 1px 0 #181430'>
              QUESTIONS
            </Text>
            </Text>
        </Heading>
  
        <Accordion allowToggle>
      <Wrap spacing='0'>
        {faqs.map((f, i) => (
          <WrapItem key={i} width={{base:'100%', md:'50%'}} padding='0 1rem'>
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
      </Wrap>
    </Accordion>
    </Container>
    )}
  
  