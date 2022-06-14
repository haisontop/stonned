import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const IndustryContactsIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 68 74'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g filter='url(#filter0_d_606_1340)'>
          <path
            d='M11.2267 46.3867L15.8667 37.1067C17.1467 34.52 17.1467 31.5067 15.8667 28.92L11.2267 19.6133C7.25339 11.6667 15.8134 3.26668 23.6801 7.42668L27.7867 9.61334C28.3734 9.90668 28.8267 10.3867 29.0667 10.9733L44.2401 44.7067C44.8534 46.0933 44.2934 47.72 42.9601 48.4133L23.6534 58.5733C15.8134 62.7333 7.25339 54.3333 11.2267 46.3867Z'
            fill='#1AADD2'
          />
        </g>
        <path
          opacity='0.4'
          d='M47.4933 42.6L37.5466 20.52C36.4266 18.04 39.0933 15.5333 41.4933 16.8133L56.88 24.92C63.4133 28.36 63.4133 37.6933 56.88 41.1333L51.44 43.9866C49.9733 44.7333 48.1866 44.12 47.4933 42.6Z'
          fill='#1AADD2'
        />
        <defs>
          <filter
            id='filter0_d_606_1340'
            x='0.221191'
            y='0.324951'
            width='54.2671'
            height='73.3501'
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
              result='effect1_dropShadow_606_1340'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_606_1340'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
