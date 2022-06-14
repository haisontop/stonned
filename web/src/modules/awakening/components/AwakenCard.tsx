import { Image, Text, Box, Button } from '@chakra-ui/react'
import { isAfter } from 'date-fns'
import { useRouter } from 'next/router'
import Countdown from 'react-countdown'

interface Props {
  id: string
  ape: string
  magic: string
  image: string
  timeAwake?: number
  onAwaken?: () => void
  endDate: Date
  buttonLoading?: boolean
}

const AwakenCard: React.FC<Props> = ({
  ape,
  magic,
  image,
  id,
  timeAwake,
  onAwaken,
  endDate,
  buttonLoading,
}) => {
  const isWake = /* true */ isAfter(new Date(), endDate)
  const fontWeight = isWake ? 700 : 500
  return (
    <Box
      w={{ md: '20.1rem', sm: '15rem', base: '9rem' }}
      h={{ md: '29rem', sm: '23rem', base: '13.3rem' }}
      p={{ md: '0.75rem', base: '0.4rem' }}
      display='flex'
      alignItems='center'
      alignContent='center'
      justifyContent='space-between'
      flexDirection='column'
      rounded='md'
      backgroundColor='rgba(255, 255, 255, 0.2)'
    >
      <Image src={image} rounded='md' />
      <Text
        color='#fff'
        fontSize='.75rem'
        lineHeight='1.125rem'
        fontWeight={fontWeight}
      >
        {ape}
      </Text>
      <Text
        textAlign='center'
        color='#fff'
        fontSize={{ md: '0.75rem', sm: '0.75rem', base: '0.4rem' }}
        lineHeight='1.125rem'
        fontWeight={fontWeight}
      >
        Your Ape is{' '}
        {isWake
          ? 'has completed the path to awakening.'
          : 'on the path to awakening 👁️'}
        {/* with {magic} */}
      </Text>
      {isWake ? (
        <Button
          color='#000'
          backgroundColor='#fff'
          w='100%'
          borderRadius='10px'
          variant='ghost'
          _hover={{
            boxShadow: '1px 1px 5px 1px #acd0d67a',
          }}
          fontSize='0.75rem'
          onClick={() => {
            if (onAwaken) onAwaken()
          }}
          isLoading={buttonLoading}
        >
          Awaken
        </Button>
      ) : (
        <Box
          color='#fff'
          fontSize={{ md: '.75rem', sm: '.7rem', base: '0.45rem' }}
          fontWeight={fontWeight}
          textAlign='center'
        >
          Check back in
          <Text fontSize={{ md: '1rem', sm: '1rem', base: '0.7rem' }}>
            <Countdown
              date={endDate}
              autoStart={true}
              renderer={(props) => (
                <div>
                  {props.days}d {props.hours}h {props.minutes}m {props.seconds}s
                </div>
              )}
            ></Countdown>
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default AwakenCard
