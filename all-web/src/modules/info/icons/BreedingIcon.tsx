import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const BreedingIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 64 64'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M56.6667 15.3866V23.9999C56.6667 30.1066 54.72 32.0533 48.6133 32.0533H48.3467V27.6799C48.3467 19.3599 44.64 15.6532 36.32 15.6532H31.9467V15.3866C31.9467 9.27993 33.8933 7.33325 40 7.33325H48.6133C54.72 7.33325 56.6667 9.27993 56.6667 15.3866Z'
          fill='#E192B6'
        />
        <g filter='url(#filter0_d_616_1413)'>
          <path
            d='M44.3467 27.68V36.32C44.3467 42.4 42.4 44.3467 36.32 44.3467H27.68C21.6 44.3467 19.6533 42.4 19.6533 36.32V27.68C19.6533 21.6 21.6 19.6533 27.68 19.6533H36.32C42.4 19.6533 44.3467 21.6 44.3467 27.68Z'
            fill='#DC1670'
          />
        </g>
        <path
          d='M32.0533 48.3468V48.6134C32.0533 54.7201 30.1066 56.6668 24 56.6668H15.3866C9.27998 56.6668 7.33331 54.7201 7.33331 48.6134V40.0001C7.33331 33.8935 9.27998 31.9468 15.3866 31.9468H15.6533V36.3201C15.6533 44.6401 19.36 48.3468 27.68 48.3468H32.0533Z'
          fill='#E192B6'
        />
        <defs>
          <filter
            id='filter0_d_616_1413'
            x='9.65332'
            y='13.6533'
            width='44.6934'
            height='44.6934'
            filterUnits='userSpaceOnUse'
            color-interpolation-filters='sRGB'
          >
            <feFlood flood-opacity='0' result='BackgroundImageFix' />
            <feColorMatrix
              in='SourceAlpha'
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
              result='hardAlpha'
            />
            <feOffset dy='4' />
            <feGaussianBlur stdDeviation='5' />
            <feComposite in2='hardAlpha' operator='out' />
            <feColorMatrix
              type='matrix'
              values='0 0 0 0 0.862745 0 0 0 0 0.0862745 0 0 0 0 0.439216 0 0 0 0.5 0'
            />
            <feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow_616_1413'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_616_1413'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
