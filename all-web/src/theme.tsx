import { ButtonProps, extendTheme, ThemeConfig } from '@chakra-ui/react'
import {
  createBreakpoints,
  getColor,
  lighten,
  mode,
} from '@chakra-ui/theme-tools'
import { Global } from '@emotion/react'
import React from 'react'
import type { GlobalStyleProps, Styles } from '@chakra-ui/theme-tools'

const fonts = { mono: `'Menlo', monospace` }

export const Fonts = () => (
  <Global
    styles={`
    html {
      font-size:16px;
    }
    @font-face {
      font-family: 'Skrapbook';
      src: url('./fonts/Skrapbook.woff') format('woff');
    }
    @font-face {
      font-family: 'Brendan';
      src: url('./fonts/Brendan.woff') format('woff');
    }
      `}
  />
)

/*
[
  0 > px, > 480 px, > 748 px, > 992 px]

*/

const breakpoints = createBreakpoints({
  sm: '30em',
  md: '62em',
  lg: '80em',
  xl: '80em',
})

type GradientProps = {
  fromcolor: string
  tocolor: string
  bgcolor: string
}

// setup light/dark mode global defaults
const styles: Styles = {
  global: (props) => ({
    body: {
      bg: mode('white', '#1F2023')(props)
    }
  })
};

const primaryColorBefore = '#43CC9E'
const altGreen = '#3bb659'
const anotherGreen = '#48D587'

const config: ThemeConfig  = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    black: '#131737',
    primary: anotherGreen,
    secondary: '#8676FF',
    purpleGradient: '#8D188B',
    blueGradient: '#39BBFA',
    textGrey: '#A1A1A6',
    textGreyDark: '#686868',
    green: {
      main: anotherGreen,
      '50': '#EBFAF5',
      '100': '#C7F0E2',
      '200': '#A3E6CF',
      '300': '#7FDCBD',
      '400': '#5BD2AA',
      '500': '#36C998',
      '600': '#2CA079',
      '700': '#21785B',
      '800': '#16503D',
      '900': '#0B281E',
    },
    blue: {
      '50': '#ebf8ff',
      '100': '#33a8e1',
      '200': '#39bbfa',
      '300': '#2e96c8',
      '400': '#227096',
      '500': '#1d5e7d',
      '600': '#174b64',
      '700': '#11384b',
      '800': '#0b2532',
      '900': '#061319',
    },
    purple: {
      '50': '#e8d1e8',
      '100': '#a446a2',
      '200': '#8d188b',
      '300': '#71136f',
      '400': '#550e53',
      '500': '#470c46',
      '600': '#380a38',
      '700': '#2a072a',
      '800': '#1c051c',
      '900': '#0e020e',
    },
  },
  fonts: {
    body: 'Poppins,barlow,sans-serif',
    heading: 'Skrapbook',
    mono: 'Skrapbook',
  },
  breakpoints,
  components: {
    Heading: {
      baseStyle: {
        fontWeight: '600',
      },
    },
    Text: {
      baseStyle: {
        fontWeight: '400',
      },
    },
    Link: {
      baseStyle: {
        transition: 'ease-in-out all .2s',
        _hover: {
          color: 'textGrey',
          textDecoration: 'none',
        },
      },
    },
    Button: {
      baseStyle: {
        '>.chakra-button__icon': {
          fontSize: '24px',
        },
      },
      variants: {
        gradient: (props: ButtonProps & GradientProps & { theme: any }) => {
          const { theme, bgcolor, fromcolor, tocolor } = props
          console.log({ theme, fromcolor, tocolor })

          const bgColor = getColor(theme, mode(bgcolor, bgcolor)(props))

          return {
            border: '3px solid',
            borderColor: 'transparent',
            borderRadius: 'full',
            background: `linear-gradient(${bgColor}, ${bgColor}) padding-box, 
            linear-gradient(135deg, ${fromcolor}, ${tocolor}) border-box`,
            '> *': {
              background: `linear-gradient(135deg, ${fromcolor}, ${tocolor})`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
            },
            _hover: {
              background: `linear-gradient(${bgColor}, ${bgColor}) padding-box, 
              linear-gradient(315deg, ${fromcolor}, ${tocolor}) border-box`,
              '> *': {
                background: `linear-gradient(315deg, ${fromcolor}, ${tocolor})`,
                backgroundClip: 'text',
              },
            },
          }
        },
      },
    },
  },
  styles
})

export default theme
