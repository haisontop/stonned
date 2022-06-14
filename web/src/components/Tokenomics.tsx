import React from 'react'
import { Box, chakra, Heading, Image, Stack } from '@chakra-ui/react'
import { MotionBox } from './Utilities'
import { motion, useTransform, useViewportScroll } from 'framer-motion'

export default function Tokenomics() {
  const { scrollYProgress } = useViewportScroll()
  const scale = useTransform(scrollYProgress, [0.1, 1.1], [0, 1.2])

  return (
    <></>
    // <Box px='10'>
      
    //   <Heading size='3xl'><chakra.span color="primary"> Token</chakra.span>omics</Heading>
    //   <Heading pt='4' size='xl'>
    //     <chakra.span color="primary">$</chakra.span>PUFF
    //   </Heading>
    // <Stack direction={["column", "row"]}>
    //   <chakra.span pt="10" w={["", "60%"]} textAlign="justify">
    //     $PUFF Token is the utility token of the StonedApeCrew NFT & will be used
    //     in the Cannabis Industry to pay for CBD, Weed & other Accessoires like
    //     Pens. The first-ever Token to get your Greens. $PUFF will also play a
    //     major role in the Stoned Metaverse. Massive parts of the supply will be
    //     burned by using it for the first-ever NFT Evolution Process, Breeding
    //     Nuked Apes NFTs & to pay for side collections. Those $PUFF will be
    //     burned completely and therefore decrease the circulating supply!
    //   </chakra.span>
    //   <MotionBox>
    //     <motion.div style={{ scale }}>
    //       <motion.div
    //         style={{
    //           scaleZ: scrollYProgress,
    //         }}
    //       >
    //         <Image src='/images/puff-logo-with-font.png' />
    //       </motion.div>
    //     </motion.div>
    //   </MotionBox>
    //   </Stack>
    // </Box>
  )
}
