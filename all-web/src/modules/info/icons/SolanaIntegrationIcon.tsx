import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const SolanaIntegrationIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 64 64'
        width='100%'
        height='100%'
      >
        <path
          opacity='0.4'
          d='M32 59C46.9117 59 59 46.9117 59 32C59 17.0883 46.9117 5 32 5C17.0883 5 5 17.0883 5 32C5 46.9117 17.0883 59 32 59Z'
          fill='#A465FF'
        />
        <g filter='url(#filter0_d_579_1366)'>
          <path
            d='M24.7368 37.1958C24.8757 37.0721 25.0665 37 25.2688 37H43.6229C43.9583 37 44.1261 37.3608 43.889 37.5721L40.2633 40.8042C40.1244 40.9279 39.9336 41 39.7313 41H21.3771C21.0417 41 20.874 40.6392 21.111 40.4279L24.7368 37.1958Z'
            fill='#A465FF'
          />
        </g>
        <g filter='url(#filter1_d_579_1366)'>
          <path
            d='M24.7368 23.1958C24.8814 23.0721 25.0723 23 25.2688 23H43.6229C43.9583 23 44.1261 23.3608 43.889 23.5721L40.2633 26.8042C40.1244 26.9279 39.9336 27 39.7313 27H21.3771C21.0417 27 20.874 26.6392 21.111 26.4279L24.7368 23.1958Z'
            fill='#A465FF'
          />
        </g>
        <g filter='url(#filter2_d_579_1366)'>
          <path
            d='M40.2633 30.1958C40.1244 30.0721 39.9336 30 39.7313 30H21.3771C21.0417 30 20.874 30.3608 21.111 30.5721L24.7367 33.8042C24.8756 33.9279 25.0664 34 25.2687 34H43.6229C43.9583 34 44.1261 33.6392 43.889 33.4279L40.2633 30.1958Z'
            fill='#A465FF'
          />
        </g>
        <defs>
          <filter
            id='filter0_d_579_1366'
            x='11'
            y='31'
            width='43'
            height='24'
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
              result='effect1_dropShadow_579_1366'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_579_1366'
              result='shape'
            />
          </filter>
          <filter
            id='filter1_d_579_1366'
            x='11'
            y='17'
            width='43'
            height='24'
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
              result='effect1_dropShadow_579_1366'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_579_1366'
              result='shape'
            />
          </filter>
          <filter
            id='filter2_d_579_1366'
            x='11'
            y='24'
            width='43'
            height='24'
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
              result='effect1_dropShadow_579_1366'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_579_1366'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
