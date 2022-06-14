import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { FaEquals, FaPlus } from 'react-icons/fa'
import { ApplyNowButton } from '../../components/ApplyNowButton'
import { Logo } from '../../components/Logo'
import { MAIN_CONTAINER_MAX_WIDTH, MAIN_LAUNCH_CONTAINER_MAX_WIDTH } from '../../constants'
import { AllCoinColoredIcon } from '../landing/components/icons/AllCoinColoredIcon'
import { AllStrategyColoredIcon } from '../landing/components/icons/AllStrategyColoredIcon'
import { AllTechColoredIcon } from '../landing/components/icons/AllTechColoredIcon'
import { CategoryOverviewCard } from './CategoryOverviewCard'
import CategoryTitle from './CategoryTitle'
import { INFO_CATEGORIES } from './constants/categories'
import { AdditionalFeature, CategoryLabel, CategoryOverview } from './types'

const PlusBox = () => {
  return (
    <Box
      display='flex'
      alignItems={'center'}
      justifyContent='center'
      bg='#000'
      px={'0.5rem'}
      py={'0.6rem'}
      borderRadius='1rem'
    >
      <FaPlus color='#fff' />
    </Box>
  )
}

interface InfoBottomHeroProps {
  category: CategoryLabel
  color: string
}

export const InfoBottomHero = (props: InfoBottomHeroProps) => {
  const { category, color } = props

  return (
    <Box>
      <Stack bg={[null, null, '#000']} position={'relative'}>
        <Container
          width='100%'
          marginX='auto'
          position={'relative'}
          px={0}
          maxW={'unset'}
        >
          <Container maxWidth={MAIN_LAUNCH_CONTAINER_MAX_WIDTH} px={0}>
            <Stack
              spacing={8}
              alignItems='flex-start'
              width='100%'
              position='relative'
              pt={[0, 0, '10rem']}
              mt={['4rem', '4rem', 0]}
            >
              <Stack
                top={[null, null, '-20rem']}
                position={[null, null, 'absolute']}
                width='100%'
                spacing={8}
                px={['1rem']}
              >
                <Text
                  fontSize={['2rem', '2rem', '3rem']}
                  fontWeight={700}
                  color='#2B2B2B'
                  fontFamily="heading"
                  sx={{
                    '& > span': {
                      color: color,
                    },
                  }}
                  px={[0, '0.5rem', 0]}
                >
                  We do more than just <span>{category}</span>
                </Text>
                <Grid
                  templateColumns={[
                    'repeat(1, 1fr)',
                    'repeat(1, 1fr)',
                    'repeat(3, 1fr)',
                  ]}
                  gap={'1rem'}
                >
                  {INFO_CATEGORIES.filter(
                    (categoryItem) => categoryItem.categoryLabel !== category
                  ).map((categoryItem) => (
                    <CategoryOverviewCard
                      category={categoryItem}
                      key={categoryItem.categoryLabel}
                      color={color}
                    />
                  ))}
                </Grid>
              </Stack>

              <Stack
                pt='5rem'
                width='100%'
                bg='#000'
                px={['1rem', '0.5rem', 0]}
              >
                <Grid
                  templateColumns={[
                    'repeat(2, 1fr)',
                    'repeat(2, 1fr)',
                    'repeat(4, 1fr)',
                  ]}
                  gap='0.5rem'
                  width='100%'
                  pb='0.5rem'
                >
                  <GridItem colSpan={[2, 2, 4]}>
                    <Text fontSize={'3rem'} fontWeight={700} color='#fff' fontFamily="heading" mb="2rem">
                      Or...maybe you<br/> want to have it all?
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Box
                      bg='#0E0E0E'
                      borderRadius={'1rem'}
                      display='flex'
                      py='3rem'
                      position='relative'
                      justifyContent={'center'}
                      alignItems='center'
                    >
                      <Box
                        position='absolute'
                        top='50%'
                        right={'-1.2rem'}
                        zIndex={1}
                        transform='translateY(-50%)'
                      >
                        <PlusBox />
                      </Box>
                      <Box
                        position='absolute'
                        left='50%'
                        bottom={'-1.75rem'}
                        zIndex={1}
                        transform='translateX(-50%)'
                        alignItems={'center'}
                        justifyContent='center'
                        bg='#000'
                        px={'0.5rem'}
                        py={'0.6rem'}
                        borderRadius='1rem'
                        display={['flex', 'flex', 'none']}
                      >
                        <PlusBox />
                      </Box>
                      <CategoryTitle label='LAUNCH' />
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box
                      bg='#0E0E0E'
                      borderRadius={'1rem'}
                      display='flex'
                      py='3rem'
                      position='relative'
                      justifyContent={'center'}
                      alignItems='center'
                    >
                      <Box
                        position='absolute'
                        top='50%'
                        right={'-1.2rem'}
                        zIndex={1}
                        transform='translateY(-50%)'
                        display={['none', 'none', 'flex']}
                      >
                        <PlusBox />
                      </Box>
                      <Box
                        position='absolute'
                        left='50%'
                        bottom={'-1.75rem'}
                        zIndex={1}
                        transform='translateX(-50%)'
                        alignItems={'center'}
                        justifyContent='center'
                        bg='#000'
                        px={'0.5rem'}
                        py={'0.6rem'}
                        borderRadius='1rem'
                        display={['flex', 'flex', 'none']}
                      >
                        <PlusBox />
                      </Box>
                      <CategoryTitle label='COIN' iconColor={'#820FB8'} />
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box
                      bg='#0E0E0E'
                      borderRadius={'1rem'}
                      display='flex'
                      py='3rem'
                      position='relative'
                      justifyContent={'center'}
                      alignItems='center'
                    >
                      <Box
                        position='absolute'
                        top='50%'
                        right={'-1.2rem'}
                        zIndex={1}
                        transform='translateY(-50%)'
                      >
                        <PlusBox />
                      </Box>
                      <CategoryTitle label='TECH' iconColor={'#DC1670'} />
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box
                      bg='#0E0E0E'
                      borderRadius={'1rem'}
                      display='flex'
                      py='3rem'
                      position='relative'
                      justifyContent={'center'}
                      alignItems='center'
                    >
                      <CategoryTitle label='STRATEGY' iconColor={'#1399D9'} />
                    </Box>
                  </GridItem>
                </Grid>
              </Stack>
            </Stack>
          </Container>
        </Container>
      </Stack>
      <Stack bg='#000' width='100%' pb='10rem'>
        <Box
          bg='#0E0E0E'
          display={'flex'}
          alignItems='center'
          justifyContent={'center'}
          pt='1rem'
          pb='4rem'
          position={'relative'}
          width='100%'
        >
          <Box
            position='absolute'
            left='50%'
            top={'-1.2rem'}
            zIndex={1}
            transform='translateX(-50%)'
            display='flex'
            alignItems={'center'}
            justifyContent='center'
            bg='#000'
            px={'0.5rem'}
            py={'0.6rem'}
            borderRadius='1rem'
          >
            <FaEquals color='#fff' />
          </Box>
          <Box
            position='absolute'
            left='50%'
            bottom={'-2.5rem'}
            zIndex={1}
            transform='translateX(-50%)'
            display='flex'
            alignItems={'center'}
            justifyContent='center'
            bg='#000'
            px={'0.5rem'}
            py={'0.6rem'}
            borderRadius='1rem'
          >
            <Link
              href='https://airtable.com/shrOYiab2lhb4ATzk'
              target='_blank'
              width={['100%', '100%', 'fit-content']}
            >
              <ApplyNowButton
                border='unset'
                sx={{ px: '4rem', py: '1.125rem' }}
                height='unset'
                fontSize='1rem'
                lineHeight={'1.5rem'}
                width={['100%', '100%', 'fit-content']}
                bg='#fff'
                color='#282936;'
                fontFamily="heading"
              />
            </Link>
          </Box>
          <Stack alignItems={'center'}>
            <Box
              bg='linear-gradient(149.18deg, #5D8DED 7.64%, #595FD7 92.56%)'
              px={'0.5rem'}
              width='fit-content'
              borderRadius={'0.25rem'}
            >
              <Text color='white' fontFamily="heading">FULL</Text>
            </Box>
            <Logo
              width={'450px'}
              maxWidth={['16rem', '70rem']}
              fillColor='#fff'
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
