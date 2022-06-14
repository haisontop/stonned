import {
  Flex,
  Grid,
  GridItem,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { ProjectOverviewModel } from '../types/project'
import LaunchCard, { LaunchModel } from './LaunchCard'
import { useColorModeValue } from '@chakra-ui/system'
import { LaunchCardSkeleton } from './LaunchCardSkeleton'

interface LaunchListViewProps {
  launches: ProjectOverviewModel[]
  title: string
  hideTabs?: boolean
  category: 'current' | 'upcoming' | 'ended'
  isLoading?: boolean
}

export default function LaunchListView({
  launches,
  title,
  hideTabs = true,
  category,
  isLoading,
}: LaunchListViewProps) {
  const titleColor = useColorModeValue('#000', '#fff')
  const tabColor = useColorModeValue('#000', '#fff')

  /**
   * 0: Show all
   * 1: Verified
   * 2: Unverified
   * 3: Free Mints
   */
  const [tabIndex, setTabIndex] = React.useState(0)

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  const verifiedLaunches = React.useMemo(() => {
    return launches.filter((launch) => launch.isVerified)
  }, [tabIndex, launches])

  const unVerifiedLaunches = React.useMemo(() => {
    return launches.filter((launch) => launch.isVerified)
  }, [tabIndex, launches])

  const freeLaunches = React.useMemo(() => {
    return launches.filter((launch) => launch.publicMintPrice === 0)
  }, [tabIndex, launches])

  return (
    <Stack overflow='hidden'>
      <Text
        fontSize={['1.5rem', '2rem', '2rem']}
        color={titleColor}
        fontWeight={700}
        mb='1rem'
      >
        {title}
      </Text>
      <Tabs variant='unstyled' index={tabIndex} onChange={handleTabsChange}>
        {!hideTabs && (
          <TabList
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
            overflow='scroll'
          >
            <Tab
              _selected={{
                color: titleColor,
                borderBottom: `2px solid ${titleColor}`,
              }}
              color='#5C636E'
              mr={4}
              fontSize={['.875rem', '1rem']}
              fontWeight={500}
            >
              Show All
            </Tab>
            <Tab
              _selected={{
                color: titleColor,
                borderBottom: `2px solid ${titleColor}`,
              }}
              color='#5C636E'
              mr={4}
              fontSize={['.875rem', '1rem']}
              fontWeight={500}
            >
              Verified
            </Tab>
            <Tab
              _selected={{
                color: titleColor,
                borderBottom: `2px solid ${titleColor}`,
              }}
              color='#5C636E'
              mr={4}
              fontSize={['.875rem', '1rem']}
              fontWeight={500}
            >
              Unverified
            </Tab>
            <Tab
              _selected={{
                color: titleColor,
                borderBottom: `2px solid ${titleColor}`,
              }}
              color='#5C636E'
              mr={4}
              fontSize={['.875rem', '1rem']}
              fontWeight={500}
            >
              Free Mints
            </Tab>
          </TabList>
        )}

        <TabPanels
          mt={hideTabs ? 0 : 8}
          p='1rem .5rem'
        >
          <TabPanel p={0}>
            <Flex
              columnGap={['2.375rem']}
              rowGap={['3.375rem']}
              flexWrap='wrap'
            >
              {isLoading ? (
                <LaunchCardSkeleton />
              ) : (
                launches.map((launch, index) => (
                  <LaunchCard
                    launch={launch}
                    key={launch.id}
                    category={category}
                  />
                ))
              )}
            </Flex>
          </TabPanel>
          <TabPanel p={0}>
            <Flex>
              {verifiedLaunches.map((launch, index) => (
                <LaunchCard
                  launch={launch}
                  key={launch.id}
                  category={category}
                />
              ))}
            </Flex>
          </TabPanel>
          <TabPanel p={0}>
            <Flex>
              {unVerifiedLaunches.map((launch, index) => (
                <LaunchCard
                  launch={launch}
                  key={launch.id}
                  category={category}
                />
              ))}
            </Flex>
          </TabPanel>
          <TabPanel p={0}>
            <Flex>
              {freeLaunches.map((launch, index) => (
                <LaunchCard
                  launch={launch}
                  key={launch.id}
                  category={category}
                />
              ))}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  )
}
