import {
  Container,
  ChakraProvider,
  Heading,
  Stack,
  Button,
  Input,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
  Box,
  Text,
  Icon,
  Link,
} from '@chakra-ui/react'
import Head from 'next/head'
import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../modules/nuked/Footer'
import themeFlat from '../themeFlat'
import { SearchIcon } from '@chakra-ui/icons'

const AllCoinLogo = (props: any) => (
  <Icon viewBox="0 0 3209 485" fill="none" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M1466.23 349.963V418.403H1141.41V71.2461H1220.75V349.963H1466.23Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M1846.59 349.963V418.403H1521.78V71.2461H1601.12V349.963H1846.59Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M1092.03 423.909H988.02L873.012 221.046L923.164 122.223L1092.03 423.909Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M808.785 65.7578L619.004 423.915H716.345L898.091 65.7578H808.785Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M535.184 106.352V106.887C535.184 116.161 533.936 125.257 531.676 133.936C530.666 137.681 529.417 141.308 528.05 144.934C526.326 142.259 524.483 139.584 522.461 137.027V136.968C510.809 122.106 494.995 110.573 476.803 102.667C458.551 94.8195 437.921 90.5987 416.281 90.5987L280.494 90.5392H280.375L167.061 90.4203C163.315 81.9787 160.818 73.3588 159.689 64.9766L159.629 64.0849L158.975 55.2271V55.1677L158.856 53.1465C158.856 52.3736 158.797 51.6008 158.797 50.828C158.797 45.2399 159.748 39.6518 161.591 34.3015C162.364 32.1019 163.256 29.9023 164.326 27.8216C168.071 20.4501 173.541 14.1486 180.14 9.45222C188.582 3.38853 198.867 0 209.747 0H274.668L428.469 0.0594479C437.208 0.118896 445.65 1.12951 453.379 3.03185H453.498C461.405 4.87473 468.955 7.60934 476.149 11.2357L476.208 11.2951C490.001 18.1911 502.426 28.2972 512.057 40.484L512.117 40.6029C515.089 44.2887 518.062 48.6284 520.797 53.3843C523.294 57.7239 525.493 62.1825 527.336 66.6411V66.7006C532.568 79.4225 535.125 92.6793 535.184 106.352Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M223.3 340.933C217.83 348.424 211.647 354.904 204.929 360.076L204.216 360.551H204.156L196.844 365.604L196.725 365.664L195.12 366.674C189.769 370.122 183.824 372.56 177.463 373.749C175.144 374.224 172.825 374.521 170.507 374.64H170.447C169.556 374.7 168.664 374.7 167.713 374.7C160.4 374.7 153.206 373.095 146.607 370.182C137.155 365.842 129.069 358.649 123.659 349.256L91.1391 293.018L14.3278 159.736C10.0473 152.127 6.71802 144.339 4.45886 136.73L4.39941 136.611C2.02135 128.883 0.653966 120.916 0.178354 112.891V112.832C0.0594515 110.751 0 108.611 0 106.53C0 93.1543 2.55641 79.6596 7.55034 67.235L7.60979 67.0567C9.33388 62.6575 11.593 57.9611 14.3278 53.1458C16.8842 48.8061 19.619 44.7042 22.5916 40.8996V40.8401C31.1526 29.8423 41.4377 20.8656 53.4469 14.0291L53.5063 13.9697C61.5323 9.33272 70.0338 5.82529 78.6543 3.50682H78.7138C82.3997 2.43676 86.2046 1.72339 90.069 1.12891C88.5827 3.92296 87.1559 6.89536 85.9074 9.9272H85.9668C80.6757 22.9463 78.1787 37.0355 78.1787 51.5407C78.1787 76.0333 85.2534 101.536 98.8084 125.078L166.643 242.666L166.696 242.785L223.3 340.933Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M481.855 216.391C481.855 225.19 479.596 233.988 475.018 242.013L442.498 298.257L365.508 431.355C361.109 438.905 356.055 445.682 350.586 451.448L350.467 451.508C344.938 457.453 338.755 462.684 332.037 467.024L331.978 467.083C319.136 475.584 304.154 481.351 288.756 483.55H288.637C283.941 484.323 278.709 484.68 273.24 484.68C268.186 484.68 263.252 484.323 258.496 483.669H258.436C244.643 481.826 231.683 477.368 219.733 470.353C211.707 465.716 204.395 460.128 198.033 453.826V453.767C195.299 451.092 192.742 448.179 190.305 445.147C193.456 444.969 196.725 444.731 199.936 444.315C218.663 441.64 236.558 433.733 252.491 421.903C268.424 410.073 282.395 394.26 293.275 375.539L361.228 258.005L361.287 257.886L361.347 257.767L418.004 159.797C427.219 160.807 435.899 162.948 443.746 166.158L444.519 166.574L452.545 170.444L452.664 170.497L454.388 171.33C459.977 174.243 465.089 178.226 469.37 183.16C470.856 184.884 472.283 186.792 473.591 188.689V188.748C478.109 195.709 480.785 203.551 481.617 211.635C481.795 213.241 481.855 214.786 481.855 216.391Z" fill="white"/>
    <path d="M2124.18 426.809C2097.32 426.809 2072.5 422.389 2049.72 413.549C2026.94 404.369 2007.22 391.619 1990.56 375.299C1973.9 358.979 1960.81 339.769 1951.29 317.669C1942.11 295.569 1937.52 271.429 1937.52 245.249C1937.52 219.069 1942.11 194.929 1951.29 172.829C1960.81 150.729 1973.9 131.519 1990.56 115.199C2007.56 98.8794 2027.45 86.2994 2050.23 77.4595C2073.01 68.2795 2097.83 63.6895 2124.69 63.6895C2150.53 63.6895 2174.84 68.1095 2197.62 76.9495C2220.4 85.4495 2239.61 98.3694 2255.25 115.709L2231.28 139.679C2216.66 124.719 2200.51 114.009 2182.83 107.549C2165.15 100.749 2146.11 97.3494 2125.71 97.3494C2104.29 97.3494 2084.4 101.089 2066.04 108.569C2047.68 115.709 2031.7 126.079 2018.1 139.679C2004.5 152.939 1993.79 168.579 1985.97 186.599C1978.49 204.279 1974.75 223.829 1974.75 245.249C1974.75 266.669 1978.49 286.389 1985.97 304.409C1993.79 322.089 2004.5 337.729 2018.1 351.329C2031.7 364.589 2047.68 374.959 2066.04 382.439C2084.4 389.579 2104.29 393.149 2125.71 393.149C2146.11 393.149 2165.15 389.749 2182.83 382.949C2200.51 376.149 2216.66 365.269 2231.28 350.309L2255.25 374.279C2239.61 391.619 2220.4 404.709 2197.62 413.549C2174.84 422.389 2150.36 426.809 2124.18 426.809Z" fill="white"/>
    <path d="M2484.29 426.809C2457.43 426.809 2432.44 422.389 2409.32 413.549C2386.54 404.369 2366.65 391.619 2349.65 375.299C2332.99 358.639 2319.9 339.429 2310.38 317.669C2301.2 295.569 2296.61 271.429 2296.61 245.249C2296.61 219.069 2301.2 195.099 2310.38 173.339C2319.9 151.239 2332.99 132.029 2349.65 115.709C2366.65 99.0494 2386.54 86.2994 2409.32 77.4595C2432.1 68.2795 2457.09 63.6895 2484.29 63.6895C2511.15 63.6895 2535.97 68.2795 2558.75 77.4595C2581.53 86.2994 2601.25 98.8794 2617.91 115.199C2634.91 131.519 2648 150.729 2657.18 172.829C2666.7 194.929 2671.46 219.069 2671.46 245.249C2671.46 271.429 2666.7 295.569 2657.18 317.669C2648 339.769 2634.91 358.979 2617.91 375.299C2601.25 391.619 2581.53 404.369 2558.75 413.549C2535.97 422.389 2511.15 426.809 2484.29 426.809ZM2484.29 393.149C2505.71 393.149 2525.43 389.579 2543.45 382.439C2561.81 374.959 2577.62 364.589 2590.88 351.329C2604.48 337.729 2615.02 322.089 2622.5 304.409C2629.98 286.389 2633.72 266.669 2633.72 245.249C2633.72 223.829 2629.98 204.279 2622.5 186.599C2615.02 168.579 2604.48 152.939 2590.88 139.679C2577.62 126.079 2561.81 115.709 2543.45 108.569C2525.43 101.089 2505.71 97.3494 2484.29 97.3494C2462.87 97.3494 2442.98 101.089 2424.62 108.569C2406.26 115.709 2390.28 126.079 2376.68 139.679C2363.42 152.939 2352.88 168.579 2345.06 186.599C2337.58 204.279 2333.84 223.829 2333.84 245.249C2333.84 266.329 2337.58 285.879 2345.06 303.899C2352.88 321.919 2363.42 337.729 2376.68 351.329C2390.28 364.589 2406.26 374.959 2424.62 382.439C2442.98 389.579 2462.87 393.149 2484.29 393.149Z" fill="white"/>
    <path d="M2756.05 423.749V66.7494H2793.79V423.749H2756.05Z" fill="white"/>
    <path d="M2909.95 423.749V66.7494H2941.06L3187.39 376.829H3171.07V66.7494H3208.3V423.749H3177.19L2931.37 113.669H2947.69V423.749H2909.95Z" fill="white"/>
  </Icon>

)


const ApeGallery = () => {
  return (
    <ChakraProvider resetCSS theme={themeFlat}>
      <Head>
        <link rel='shortcut icon' href='/images/logo-coin.png' />
        <title>ALL Coin</title>
        <meta
          property='og:title'
          content='ALL Coin'
          key='title'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta
          name='description'
          content='ALL Coin is an ecosystem where multiple projects earn $ALL, create utilities and thus also brun $ALL. It is a universal token which gets better and more valuable with every new project that joins and builds with it.'
        />
        <meta
          property='og:description'
          content='ALL Coin is an ecosystem where multiple projects earn $ALL, create utilities and thus also brun $ALL. It is a universal token which gets better and more valuable with every new project that joins and builds with it.'
        />
        <meta
          property='twitter:title'
          content='ALL Coin'
        />
        <meta
          property='twitter:description'
          content='ALL Coin is an ecosystem where multiple projects earn $ALL, create utilities and thus also brun $ALL. It is a universal token which gets better and more valuable with every new project that joins and builds with it.'
        />
      </Head>


      <Container
        w='100vw'
        h='100vh'
        maxW='unset'
        m='0'
        pos='relative'
        bg='#282936'
      >
        <Box
          position='absolute'
          top='50%'
          left='50%'
          transform='translate(-50%, -50%)'
          width='250px'
        >
          <AllCoinLogo 
              height="auto" 
              width="100%"
              color='black'
            >
          </AllCoinLogo>
          <Stack textAlign='center' mt='2rem' color='#aaa'>
            <Link 
              isExternal
              href='https://trade.dexlab.space/#/market/HnYTh7fKcXN4Dz1pu7Mbybzraj8TtLvnQmw471hxX3f5' 
              _hover={{
                color: '#fff'
              }}>
              Trade on Dexlab
            </Link>
          </Stack>
        </Box>
      </Container>
    </ChakraProvider>
  )
}

export default ApeGallery