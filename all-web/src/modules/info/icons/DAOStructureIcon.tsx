import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const DAOStructureIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 66 66'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g filter='url(#filter0_d_606_1269)'>
          <path
            d='M41.5732 6.66675C33.6532 6.66675 27.2266 13.0934 27.2266 21.0134C27.2266 28.9334 33.6532 35.3601 41.5732 35.3601C49.4932 35.3601 55.9199 28.9334 55.9199 21.0134C55.9199 13.0934 49.4932 6.66675 41.5732 6.66675Z'
            fill='#1AADD2'
          />
        </g>
        <path
          opacity='0.4'
          d='M16.9608 36.7461C12.0808 36.7461 8.08081 40.7194 8.08081 45.6261C8.08081 50.5328 12.0541 54.5061 16.9608 54.5061C21.8408 54.5061 25.8408 50.5328 25.8408 45.6261C25.8408 40.7194 21.8408 36.7461 16.9608 36.7461Z'
          fill='#1AADD2'
        />
        <path
          opacity='0.4'
          d='M44.3188 46.3203C40.1854 46.3203 36.8254 49.6803 36.8254 53.8136C36.8254 57.947 40.1854 61.307 44.3188 61.307C48.4521 61.307 51.8121 57.947 51.8121 53.8136C51.8121 49.6803 48.4521 46.3203 44.3188 46.3203Z'
          fill='#1AADD2'
        />
        <defs>
          <filter
            id='filter0_d_606_1269'
            x='17.2266'
            y='0.666748'
            width='48.6934'
            height='48.6934'
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
              values='0 0 0 0 0.101961 0 0 0 0 0.678431 0 0 0 0 0.823529 0 0 0 0.5 0'
            />
            <feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow_606_1269'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_606_1269'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
