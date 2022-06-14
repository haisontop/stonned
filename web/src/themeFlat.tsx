import { ButtonProps, extendTheme } from '@chakra-ui/react'
import { createBreakpoints, getColor, lighten, mode } from '@chakra-ui/theme-tools'
import { Global } from '@emotion/react'
import React from 'react'


const fonts = { mono: `'Menlo', monospace` }

export const Fonts = () => (
  <Global
    styles={`
    html {
      font-size: 16px
    }

    @media only screen and (min-width: 600px) {
      html {
        font-size: 18px
      }
    }

    @media only screen and (min-width: 1800px) {
      html {
        font-size: 18px
      }
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
  tm: '1220px'
})


type GradientProps = {
  fromcolor: string,
  tocolor: string,
  bgcolor: string
}

const themeFlat = extendTheme({
  colors: {
    black: '#000',
    purpleGradient: '#8D188B',
    blueGradient: '#39BBFA',
    textGrey: '#A1A1A6',
    textGreyDark: '#686868',
  },
  fonts: { body: 'Poppins,normal,sans-serif', heading: 'Montserrat', mono: 'Montserrat' },
  breakpoints,
  components: {
    Heading: {
      baseStyle: {
        fontWeight: '800',
        fontSize: '2xl'
      },
      sizes: {
        md: {
          fontSize: '4xl'
        },
        lg: {
          fontSize: '5xl'
        }
      },
      variants: {
        'minimal': {
          fontWeight: '700',
          fontSize: '2rem'
        }
      }
    },
    Text: {
      baseStyle: {
        fontWeight: '400',
        fontSize: '1rem'
      },
      variants: {
        'minimal': {
          fontWeight: '600',
          fontSize: '0.875rem'
        }
      }
    },
    Button: {
      baseStyle: {
        fontSize: '1rem',
        border: '1px solid',
        rounded: '5px',
        transition: 'ease-in-out all .2s',
      },
      variants: {
        'outlined': {
          border: '2px solid',
          borderColor: '#393E46',
          fontSize: '.875rem',
          lineHeight: '1.75',
          height: 'unset',
          _hover: {
            color: '#fff',
            bg: '#393E46'
          },
        }
      },
    },
    Link: {
      baseStyle: {
        transition: 'ease-in-out all .2s',
        _hover: {
          color: 'textGrey',
          textDecoration: 'none',
        }
      }
    }
  },
})

export default themeFlat
