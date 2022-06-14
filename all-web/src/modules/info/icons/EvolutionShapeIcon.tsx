import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const EvolutionShapeIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 714 519'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M21.0014 318L168 254.5L307.001 296L408.001 208L502.001 256L600.001 244L700.001 146L801.001 214L891.001 231L991.001 125L1089 163L1181 103L1284 116L1473 11V519.001H14L21.0014 318Z'
          fill='url(#paint0_linear_372_16390)'
        />
        <g filter='url(#filter0_d_372_16390)'>
          <path
            d='M21 318L169.5 253L307 296L408 208L502 256L600 244L700 146L801 214L891 231L991 125L1089 163L1181 103L1284 116L1473 11'
            stroke='#EEF2F4'
            stroke-width='2'
          />
        </g>
        <path
          d='M162 252.5C162 248.91 164.91 246 168.5 246C172.09 246 175 248.91 175 252.5C175 256.09 172.09 259 168.5 259C164.91 259 162 256.09 162 252.5Z'
          fill='white'
          stroke='#DC1670'
          stroke-width='2'
        />
        <path
          d='M14 317.5C14 313.91 16.9101 311 20.5 311C24.0899 311 27 313.91 27 317.5C27 321.09 24.0899 324 20.5 324C16.9101 324 14 321.09 14 317.5Z'
          fill='white'
          stroke='#DC1670'
          stroke-width='2'
        />
        <path
          d='M301 295.5C301 291.91 303.91 289 307.5 289C311.09 289 314 291.91 314 295.5C314 299.09 311.09 302 307.5 302C303.91 302 301 299.09 301 295.5Z'
          fill='white'
          stroke='#DC1670'
          stroke-width='2'
        />
        <path
          d='M402 208.5C402 204.91 404.91 202 408.5 202C412.09 202 415 204.91 415 208.5C415 212.09 412.09 215 408.5 215C404.91 215 402 212.09 402 208.5Z'
          fill='white'
          stroke='#DC1670'
          stroke-width='2'
        />
        <path
          d='M495 255.5C495 251.91 497.91 249 501.5 249C505.09 249 508 251.91 508 255.5C508 259.09 505.09 262 501.5 262C497.91 262 495 259.09 495 255.5Z'
          fill='white'
          stroke='#DC1670'
          stroke-width='2'
        />
        <path
          d='M592 243.5C592 239.91 594.91 237 598.5 237C602.09 237 605 239.91 605 243.5C605 247.09 602.09 250 598.5 250C594.91 250 592 247.09 592 243.5Z'
          fill='white'
          stroke='#DC1670'
          stroke-width='2'
        />
        <path
          d='M694 147.5C694 143.91 696.91 141 700.5 141C704.09 141 707 143.91 707 147.5C707 151.09 704.09 154 700.5 154C696.91 154 694 151.09 694 147.5Z'
          fill='white'
          stroke='#DC1670'
          stroke-width='2'
        />
        <defs>
          <filter
            id='filter0_d_372_16390'
            x='0.598999'
            y='0.125732'
            width='1492.89'
            height='348.79'
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
            <feOffset dy='10' />
            <feGaussianBlur stdDeviation='10' />
            <feColorMatrix
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0'
            />
            <feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow_372_16390'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_372_16390'
              result='shape'
            />
          </filter>
          <linearGradient
            id='paint0_linear_372_16390'
            x1='253.748'
            y1='177.953'
            x2='253.748'
            y2='519'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#F2F2F2' stop-opacity='0.5' />
            <stop offset='1' stop-color='white' stop-opacity='0.01' />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  )
}
