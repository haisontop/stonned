import { ButtonProps, extendTheme } from '@chakra-ui/react'
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

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const Fonts = () => (
  <Global
    styles={`
    html {
      font-size: 16px
    }
      `}
  />
)

/*
[
  0 > px, > 480 px, > 748 px, > 992 px]
*/

const breakpoints = createBreakpoints({
  sm: "30em",
  md: "62em",
  lg: "80em",
  xl: "100em",
});

type GradientProps = {
  fromcolor: string
  tocolor: string
  bgcolor: string
}

// setup light/dark mode global defaults
const styles: Styles = {
  global: (props) => ({
    body: {
      bg: mode('white', '#1F2023')(props),
    },
  }),
}

const lightBgGradient = 'linear(to-b, #F5F5F7 0%, #F5F5F7 100%)'
const darkBgGradient = 'linear(to-b, #000000 0%, #30424D 250%)'
const darkBoxBg = '#333639'
const nukedGradient = 'linear(to-r, blueGradient, purpleGradient)'
const genisisGradient =
  'linear(to-r, #F0BBDC, #EA9FF1 33%, #EA9FF1 66%, #E08686 94%)'

const themeObject = {
  config,
  colors: {
    black: '#000',
    purpleGradient: '#8D188B',
    blueGradient: '#39BBFA',
    textGrey: '#A1A1A6',
    textGreyDark: '#686868',
    bgLight: '#F5F5F7',
    bgDark: '#393E46',
  },
  fonts: {
    body: 'Poppins,normal,sans-serif',
    heading: "'Montserrat', sans-serif",
    mono: "'Montserrat', sans-serif",
  },
  breakpoints,
  components: {
    Heading: {
      baseStyle: {
        fontWeight: '800',
        fontSize: '2xl',
      },
      sizes: {
        md: {
          fontSize: '4xl',
        },
        lg: {
          fontSize: '5xl',
        },
      },
    },
    Text: {
      baseStyle: {
        fontWeight: '400',
        fontSize: '1rem',
      },
    },
    Button: {
      baseStyle: {
        fontSize: "1rem",
        // border: "1px solid",
        // rounded: "full",
        transition: "ease-in-out all .2s",
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
    FormLabel: {
      baseStyle: {
        fontSize: '12px',
        fontWeight: '500',
        color: '#888888',
      },
    },
  },
  styles,
}

const themeFlat = extendTheme(themeObject)

export default themeFlat
