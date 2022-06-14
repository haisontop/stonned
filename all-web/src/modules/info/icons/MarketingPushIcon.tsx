import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const MarketingPushIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 64 76'
        width='100%'
        height='100%'
      >
        <path
          opacity='0.4'
          d='M23.1187 40.332H10.6654C7.73203 40.332 5.33203 42.732 5.33203 45.6654V61.6654H23.1187V40.332Z'
          fill='#FFA094'
        />
        <g filter='url(#filter0_d_2349_4201)'>
          <path
            d='M35.5471 29.668H28.4271C25.4938 29.668 23.0938 32.068 23.0938 35.0013V61.668H40.8804V35.0013C40.8804 32.068 38.5071 29.668 35.5471 29.668Z'
            fill='#FC6653'
          />
        </g>
        <path
          opacity='0.4'
          d='M53.3322 48.332H40.8789V61.6654H58.6656V53.6654C58.6656 50.732 56.2656 48.332 53.3322 48.332Z'
          fill='#FFA094'
        />
        <g filter='url(#filter1_d_2349_4201)'>
          <path
            d='M40.0245 15.932C40.8512 15.1053 41.1712 14.1187 40.9045 13.2653C40.6379 12.412 39.8112 11.7987 38.6379 11.612L36.0779 11.1853C35.9712 11.1587 35.7312 10.9986 35.6779 10.892L34.2645 8.06531C33.1979 5.90531 30.7712 5.90531 29.7045 8.06531L28.2912 10.892C28.2379 10.9986 27.9979 11.1587 27.8912 11.1853L25.3312 11.612C24.1579 11.7987 23.3579 12.412 23.0645 13.2653C22.7979 14.1187 23.1179 15.1053 23.9445 15.932L25.9179 17.932C25.9979 18.012 26.1045 18.332 26.0779 18.4387L25.5179 20.892C25.0912 22.7053 25.7845 23.532 26.2379 23.8786C26.6912 24.1986 27.6779 24.6253 29.3045 23.6653L31.7045 22.252C31.8112 22.172 32.1579 22.172 32.2645 22.252L34.6645 23.6653C35.4112 24.1187 36.0245 24.252 36.5045 24.252C37.0645 24.252 37.4645 24.0386 37.7045 23.8786C38.1579 23.5586 38.8512 22.732 38.4245 20.892L37.8645 18.4387C37.8379 18.3054 37.9179 18.012 38.0245 17.932L40.0245 15.932Z'
            fill='#FC6653'
          />
        </g>
        <defs>
          <filter
            id='filter0_d_2349_4201'
            x='13.0938'
            y='23.668'
            width='37.7852'
            height='52'
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
              result='effect1_dropShadow_2349_4201'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_2349_4201'
              result='shape'
            />
          </filter>
          <filter
            id='filter1_d_2349_4201'
            x='12.9727'
            y='0.445312'
            width='38.0234'
            height='37.8086'
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
              result='effect1_dropShadow_2349_4201'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_2349_4201'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
