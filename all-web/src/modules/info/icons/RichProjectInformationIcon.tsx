import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const RichProjectInformationIcon: React.FC<
  ComponentProps<typeof Box>
> = ({ restProps }) => {
  return (
    <Box {...restProps}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 74 66'
        width='100%'
        height='100%'
      >
        <g filter='url(#filter0_d_2349_3964)'>
          <path
            d='M49.7206 51.6147H24.2806C23.1606 51.6147 22.1473 50.8947 21.774 49.8547L10.6806 18.7881C9.80064 16.3081 12.6273 14.2014 14.734 15.7214L25.4006 23.3481C26.814 24.3614 28.8406 23.7481 29.454 22.1214L34.494 8.68141C35.3473 6.36141 38.6273 6.36141 39.4806 8.68141L44.5206 22.1214C45.134 23.7747 47.134 24.3614 48.574 23.3481L59.2406 15.7214C61.374 14.2014 64.174 16.3347 63.294 18.7881L52.2006 49.8547C51.854 50.8947 50.8406 51.6147 49.7206 51.6147Z'
            fill='#FC6653'
          />
        </g>
        <path
          opacity='0.4'
          d='M50.3346 59.668H23.668C22.5746 59.668 21.668 58.7613 21.668 57.668C21.668 56.5746 22.5746 55.668 23.668 55.668H50.3346C51.428 55.668 52.3346 56.5746 52.3346 57.668C52.3346 58.7613 51.428 59.668 50.3346 59.668Z'
          fill='#FFA094'
        />
        <path
          opacity='0.4'
          d='M43.6654 40.332H30.332C29.2387 40.332 28.332 39.4254 28.332 38.332C28.332 37.2387 29.2387 36.332 30.332 36.332H43.6654C44.7587 36.332 45.6654 37.2387 45.6654 38.332C45.6654 39.4254 44.7587 40.332 43.6654 40.332Z'
          fill='#FFA094'
        />
        <defs>
          <filter
            id='filter0_d_2349_3964'
            x='0.515625'
            y='0.941406'
            width='72.9453'
            height='64.6719'
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
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
              values='0 0 0 0 0.988235 0 0 0 0 0.4 0 0 0 0 0.32549 0 0 0 0.5 0'
            />
            <feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow_2349_3964'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_2349_3964'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
