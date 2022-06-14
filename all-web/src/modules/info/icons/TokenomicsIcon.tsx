import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const TokenomicsIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        height='100%'
        viewBox='0 0 69 68'
      >
        <g filter='url(#filter0_d_579_1279)'>
          <path
            d='M36.9997 6.90698V36.2936L12.0663 53.7336C9.79967 51.0403 9.66634 46.9603 12.1997 42.4003L20.5197 27.4403L28.3597 13.3336C30.733 9.06698 33.853 6.90698 36.9997 6.90698Z'
            fill='#A465FF'
          />
        </g>
        <path
          opacity='0.6'
          d='M61.9331 53.7335C60.1997 55.8401 57.1864 57.0935 53.1597 57.0935H20.8397C16.8131 57.0935 13.7997 55.8401 12.0664 53.7335L36.9997 36.2935L61.9331 53.7335Z'
          fill='#A465FF'
        />
        <path
          opacity='0.4'
          d='M61.9333 53.7336L37 36.2936V6.90698C40.1467 6.90698 43.2667 9.06698 45.64 13.3336L53.48 27.4403L61.8 42.4003C64.3333 46.9603 64.2 51.0403 61.9333 53.7336Z'
          fill='#A465FF'
        />
        <defs>
          <filter
            id='filter0_d_579_1279'
            x='0.333008'
            y='0.906982'
            width='46.667'
            height='66.8267'
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
              values='0 0 0 0 0.643137 0 0 0 0 0.396078 0 0 0 0 1 0 0 0 0.5 0'
            />
            <feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow_579_1279'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_579_1279'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
