import {
  Box,
  Image,
  Text,
  Tag,
  Button,
  HStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { addDays } from 'date-fns'
import React, { FC, useMemo, useState } from 'react'
import Countdown from 'react-countdown'
import { TApeUsed } from '../breeding/breeding.hooks'

interface CardProps {
  name: string
  tag: string
  imgUrl: string
  fontColor: string
  bgColor: string
  pubKey: string
  allApesUsed: TApeUsed[]
}

const tagBg: { [tag: string]: string } = {
  Artist: '#FFE483',
  Chimpion: '#DBDBDB',
  Scientist: '#AADBF6',
  Businessman: '#E9CEFF',
  Farmer: '#E2EFBC',
}

const tagFontColor: { [tag: string]: string } = {
  Artist: '#4A3A00',
  Chimpion: '#2D2D2D',
  Scientist: '#002B43',
  Businessman: '#18002B',
  Farmer: '#071500',
}

const ApeCard: FC<CardProps> = (props: CardProps) => {
  const [nextRescueStart, setNextRescueStartDate] = useState<Date>()
  const [isActive, setActive] = useState(true)
  const [apeUsed, setApeUsed] = useState<TApeUsed>()

  useMemo(() => {
    if (props.allApesUsed) {
      const apeUsed = props.allApesUsed.find((apeUsed) => {
        return apeUsed.account.mint.toBase58() === props.pubKey
      })

      if (!apeUsed) return

      setApeUsed(apeUsed)

      const lastUseStartDate = new Date(
        apeUsed?.account.lastUseStart.toNumber() * 1000
      )

      if (addDays(lastUseStartDate, 10).getTime() - new Date().getTime() > 0) {
        setActive(false)
        setNextRescueStartDate(addDays(lastUseStartDate, 10))
      }
    }
  }, [props.allApesUsed, props.name])

  return (
    <Box
      rounded='md'
      bg={props.bgColor}
      padding='.5rem'
      pb='1rem'
      margin='0 auto'
      maxWidth={['unset', '20rem']}
      transition='all .2s ease-in-out'
      _hover={{
        shadow: '2xl',
      }}
    >
      <Box minWidth='300px' minHeight='300px' bg='gray.200'>
        <Image src={props.imgUrl} rounded='md' />
      </Box>
      <Text color={props.fontColor} fontWeight='600' margin='.75rem 0'>
        {props.name}
      </Text>
      <Box>
        <Tag
          rounded='full'
          bg={tagBg[props.tag]}
          color={tagFontColor[props.tag]}
          padding='0 .75rem'
        >
          {props.tag}
        </Tag>
      </Box>
      <Box mt='.5rem'>
        <Tag rounded='full' padding='0 .75rem'>
          Rescue missions: {apeUsed?.account.counter ?? 0}
        </Tag>
      </Box>

      {!isActive && (
        <Box mt='1rem'>
          <Text
            textAlign='left'
            fontSize='sm'
            color='black'
            paddingLeft='.5rem'
          >
            Cooldown ending on {nextRescueStart?.toLocaleDateString()}{' at '}{nextRescueStart?.toLocaleTimeString()}{' '}
          </Text>
        </Box>
      )}

    {<Button
        w='100%'
        border='none'
        mt='1.25rem'
        onClick={() =>
          window.open(
            `https://magiceden.io/item-details/${props.pubKey}`,
            '_blank'
          )
        }
      >
        Bid on MagicEden
      </Button>}
    </Box>
  )
}

export default ApeCard
