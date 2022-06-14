import { Flex, Stack } from '@chakra-ui/layout'
import { ChakraProps, Heading, Progress, Spinner } from '@chakra-ui/react'
import { livingSacApesCount } from '../../config/config'
import React, { ComponentProps } from 'react'

export function StakingStats(props: {
  stats?: {
    amount: number | undefined
    size: number | undefined
    percentage: number | undefined
    livingApesCount: number
  }
  loading: boolean
  color: ChakraProps['color']
  progressColorScheme: ComponentProps<typeof Progress>['colorScheme']
  name: string
}) {
  return (
    <Stack p='2' spacing='2' alignItems='center'>
      <Flex justifyContent='space-between' width={['90%', '70%']}>
        <Heading p='1' color={props.color} fontSize='2xl' fontWeight='500'>
          {props.stats?.percentage
            ? `${props.stats.percentage.toFixed(2)}% ${props.name} staked`
            : ``}
        </Heading>
        <Heading
          as='div'
          p='1'
          color={props.color}
          fontSize='2xl'
          fontWeight='500'
        >
          {props.stats?.amount ? (
            `${props.stats.amount} / ${props.stats?.livingApesCount}`
          ) : (
            <Spinner thickness='4px' />
          )}
        </Heading>
      </Flex>

      {/* {stats.loading && (
            <Stack direction='row'>
              <Text>Loading Stats</Text>
              <Spinner />
            </Stack>
          )} */}
      <Progress
        isIndeterminate={props.loading}
        colorScheme={props.progressColorScheme}
        size='lg'
        value={props.stats?.percentage}
        width={['90%', '70%']}
        borderRadius='15px'
      />
    </Stack>
  )
}
