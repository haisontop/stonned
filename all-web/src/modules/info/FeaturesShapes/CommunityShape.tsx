import { Box, Stack } from '@chakra-ui/react'
import React from 'react'
import CommunityOrientationBottom from '../FeatureAnimations/CommunityOrientationBottom'
import CommunityOrientationTop from '../FeatureAnimations/CommunityOrientationTop'

const CommunityShape = () => {
  return (
    <Box position='relative' minH={['25rem', '40.75rem']} overflow="hidden">
      <Box
        position='absolute'
        width={['17.75rem', '25rem', '25rem', '31.875rem']}
        left={["1.5rem", 0]}
      >
        <Box
          position={'relative'}
          width='100%'
          height='20rem'
          overflow={'visible'}
        >
          <Box
            color='#fff'
            bg='#fff'
            width={['3.75rem', '3.75rem', '6.25rem', '7.5rem']}
            height={['3.75rem', '3.75rem', '6.25rem', '7.5rem']}
            position='absolute'
            boxShadow={'0px 15px 50px rgba(0, 0, 0, 0.1)'}
            borderRadius='50%'
            left={['0px', '0px', '0px', 0]}
            bottom={['30%', '30%', '22%', '22%']}
            zIndex={1}
          ></Box>
          <Box
            color='#fff'
            bg='#fff'
            width={['5rem', '5rem', '7.5rem', '10rem']}
            height={['5rem', '5rem', '7.5rem', '10rem']}
            position='absolute'
            boxShadow={'0px 15px 50px rgba(0, 0, 0, 0.1)'}
            borderRadius='50%'
            left={['40%', '50%', '50%', '50%']}
            bottom={['10%']}
            zIndex={1}
          ></Box>

          <Box
            color='#fff'
            bg='#fff'
            width={['2rem', '2.5rem', '3.125rem', '4rem']}
            height={['2rem', '2.5rem', '3.125rem', '4rem']}
            position='absolute'
            boxShadow={'0px 15px 50px rgba(0, 0, 0, 0.1)'}
            borderRadius='50%'
            top={['15%', '5%', '4%', '0%']}
            right={['0%']}
            zIndex={1}
          ></Box>
          <Box
            position='absolute'
            zIndex={0}
            width='100%'
            height='100%'
            top={0}
            pt='15px'
            pl={['2rem', '2.5rem', '3.125rem', '4rem']}
          >
            <CommunityOrientationTop />
          </Box>
        </Box>
      </Box>
      <Box
        position='absolute'
        width={['25rem', '25rem', '31.25rem', '37.5rem']}
        top={['10%', '10%', '10rem']}
        left={["0%", '20%', '0%', '-1rem']}
        pt={['2.5rem']}
        pb={['2.5rem']}
        pr={['2.5rem']}
        pl={['2.5rem', '2.5rem', '6.25rem']}
        overflow={['hidden']}
      >
        <Box
          position={'relative'}
          height={['20rem']}
          width={['calc(100% + 20px)']}
        >
          <Box
            color='#fff'
            bg='#fff'
            width='3.25rem'
            height='3.25rem'
            position='absolute'
            boxShadow={'0px 15px 50px rgba(0, 0, 0, 0.1)'}
            borderRadius='50%'
            top={['-4%', '-4%', '-8%']}
            right={['-10%', '-10%', '-10%', '0%']}
            zIndex={1}
          ></Box>
          <Box
            color='#fff'
            bg='#fff'
            width='5rem'
            height='5rem'
            position='absolute'
            boxShadow={'0px 15px 50px rgba(0, 0, 0, 0.1)'}
            borderRadius='50%'
            right={['5%', '5%', '-4%', '8%']}
            top={['22%', '18%', '35%']}
            zIndex={1}
          ></Box>
          <Box
            color='#fff'
            bg='#fff'
            width='4rem'
            height='4rem'
            position='absolute'
            boxShadow={'0px 15px 50px rgba(0, 0, 0, 0.1)'}
            borderRadius='50%'
            bottom={['10%', '10%', '4%', '2%']}
            right={['0%', '0%', '0%', '5%']}
            zIndex={1}
          ></Box>
          <Box
            color='#fff'
            bg='#fff'
            width={['7.5rem']}
            height={['7.5rem']}
            position='absolute'
            boxShadow={'0px 15px 50px rgba(0, 0, 0, 0.1)'}
            borderRadius='50%'
            left={['0', '0%', '7%', '15%']}
            bottom={['-10%', '-10%']}
            zIndex={1}
          ></Box>
          <Box
            position='absolute'
            zIndex={0}
            width='100%'
            height='100%'
            top={0}
            left={'3.75rem'}
          >
            <CommunityOrientationBottom />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CommunityShape
