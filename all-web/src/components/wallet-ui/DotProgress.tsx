import { Box, Grid, keyframes, SimpleGrid } from '@chakra-ui/react'

const dotFlashing = keyframes`
  0% {
    background-color: #f3f4f6;
    transform: scale(0.7);
  }
  50%,
  100% {
    background-color: #C4C4C4;
    transform: scale(1);
  }
`

export const DotProgress = () => {
  return (
    <Grid templateColumns={'repeat(7, 1fr)'} gap='0.4rem'>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((v) => {
        return (
          <Box
            key={`dot-${v}`}
            width='8px'
            height='8px'
            borderRadius={'50%'}
            backgroundColor='#f3f4f6'
            animation={`${dotFlashing} 1s infinite alternate`}
            style={{ animationDelay: `${v * 100}ms` }}
          />
        )
      })}
    </Grid>
  )
}
