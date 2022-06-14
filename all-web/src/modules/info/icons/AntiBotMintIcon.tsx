import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const AntiBotMintIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 66 73'
        width='100%'
        height={'100%'}
      >
        <path
          opacity='0.4'
          d='M48.8815 15.1187L17.5749 46.4253C16.4015 47.5987 14.4282 47.4386 13.4682 46.052C10.1615 41.2253 8.21484 35.5186 8.21484 29.652V17.9454C8.21484 15.7587 9.86819 13.2787 11.8949 12.452L26.7482 6.37203C30.1082 4.98536 33.8416 4.98536 37.2016 6.37203L47.9749 10.772C49.7615 11.492 50.2148 13.7854 48.8815 15.1187Z'
          fill='#FFA094'
        />
        <g filter='url(#filter0_d_2349_3987)'>
          <path
            d='M51.3854 18.7724C53.1187 17.3057 55.7587 18.559 55.7587 20.8257V29.6523C55.7587 42.6923 46.2921 54.9057 33.3588 58.479C32.4788 58.719 31.5188 58.719 30.6121 58.479C26.8254 57.4123 23.3054 55.6257 20.292 53.279C19.012 52.2924 18.8787 50.4257 19.9987 49.279C25.8121 43.3324 42.8254 25.999 51.3854 18.7724Z'
            fill='#FC6653'
          />
        </g>
        <defs>
          <filter
            id='filter0_d_2349_3987'
            x='9.23828'
            y='12.1406'
            width='56.5195'
            height='60.5195'
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
              result='effect1_dropShadow_2349_3987'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_2349_3987'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
