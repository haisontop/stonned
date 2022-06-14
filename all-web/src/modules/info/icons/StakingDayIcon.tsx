import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const StakingDayIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        height='100%'
        viewBox='0 0 71 72'
      >
        <path
          opacity='0.4'
          d='M61.7747 50.7727C61.3747 51.1727 60.868 51.3594 60.3614 51.3594C59.8547 51.3594 59.348 51.1727 58.948 50.7727L45.748 37.5728L47.1614 36.1594L48.5747 34.7461L61.7747 47.9461C62.548 48.7194 62.548 49.9994 61.7747 50.7727Z'
          fill='#A465FF'
        />
        <path
          opacity='0.4'
          d='M24.2543 24.747L39.721 40.2137C40.761 41.2537 40.761 42.9337 39.721 43.9737L37.3209 46.4003C35.1609 48.5336 31.7476 48.5336 29.6143 46.4003L18.0409 34.827C15.9343 32.7203 15.9343 29.2803 18.0409 27.147L20.4676 24.7203C21.5076 23.707 23.2143 23.707 24.2543 24.747Z'
          fill='#A465FF'
        />
        <g filter='url(#filter0_d_579_1328)'>
          <path
            d='M56.5724 27.1732L46.4124 37.3065C45.3457 38.3732 43.639 38.3732 42.5724 37.3065L27.1857 21.9198C26.1191 20.8532 26.1191 19.1465 27.1857 18.0798L37.3457 7.91984C39.4524 5.81318 42.8924 5.81318 45.0257 7.91984L56.5991 19.4932C58.6791 21.5998 58.679 25.0132 56.5724 27.1732Z'
            fill='#A465FF'
          />
        </g>
        <g filter='url(#filter1_d_579_1328)'>
          <path
            d='M28.334 58H12.334C11.2407 58 10.334 57.0933 10.334 56C10.334 54.9067 11.2407 54 12.334 54H28.334C29.4273 54 30.334 54.9067 30.334 56C30.334 57.0933 29.4273 58 28.334 58Z'
            fill='#A465FF'
          />
        </g>
        <defs>
          <filter
            id='filter0_d_579_1328'
            x='16.3857'
            y='0.339844'
            width='51.7695'
            height='51.7666'
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
              result='effect1_dropShadow_579_1328'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_579_1328'
              result='shape'
            />
          </filter>
          <filter
            id='filter1_d_579_1328'
            x='0.333984'
            y='48'
            width='40'
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
              result='effect1_dropShadow_579_1328'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_579_1328'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
