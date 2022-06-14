import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const LaunchPlanIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 69 76'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          opacity='0.4'
          d='M63.6667 17.0001V23.4535C63.6667 27.6668 61.0001 30.3335 56.7867 30.3335H47.6667V11.6935C47.6667 8.73347 50.0934 6.3068 53.0534 6.33347C55.9601 6.36014 58.6267 7.53347 60.5467 9.45347C62.4667 11.4001 63.6667 14.0668 63.6667 17.0001Z'
          fill='#1AADD2'
        />
        <g filter='url(#filter0_d_606_1421)'>
          <path
            d='M10.3333 19.6666V56.9999C10.3333 59.2133 12.8399 60.4666 14.5999 59.1333L19.1599 55.7199C20.2266 54.9199 21.7199 55.0266 22.6799 55.9866L27.1066 60.4399C28.1466 61.4799 29.8533 61.4799 30.8933 60.4399L35.3733 55.9599C36.3066 55.0266 37.7999 54.9199 38.8399 55.7199L43.3999 59.1333C45.1599 60.4399 47.6666 59.1866 47.6666 56.9999V11.6666C47.6666 8.73325 50.0666 6.33325 52.9999 6.33325H23.6666H20.9999C12.9999 6.33325 10.3333 11.1066 10.3333 16.9999V19.6666Z'
            fill='#1AADD2'
          />
        </g>
        <path
          opacity='0.4'
          d='M36.9995 33.6926H28.9995C27.9062 33.6926 26.9995 34.5993 26.9995 35.6926C26.9995 36.786 27.9062 37.6926 28.9995 37.6926H36.9995C38.0928 37.6926 38.9995 36.786 38.9995 35.6926C38.9995 34.5993 38.0928 33.6926 36.9995 33.6926Z'
          fill='white'
        />
        <path
          opacity='0.4'
          d='M28.9995 27.0261H36.9995C38.0928 27.0261 38.9995 26.1195 38.9995 25.0261C38.9995 23.9328 38.0928 23.0261 36.9995 23.0261H28.9995C27.9062 23.0261 26.9995 23.9328 26.9995 25.0261C26.9995 26.1195 27.9062 27.0261 28.9995 27.0261Z'
          fill='white'
        />
        <path
          opacity='0.4'
          d='M20.9189 22.3594C19.4255 22.3594 18.2522 23.5594 18.2522 25.026C18.2522 26.4927 19.4522 27.6927 20.9189 27.6927C22.3855 27.6927 23.5855 26.4927 23.5855 25.026C23.5855 23.5594 22.3855 22.3594 20.9189 22.3594Z'
          fill='white'
        />
        <path
          opacity='0.4'
          d='M20.9189 33.0261C19.4255 33.0261 18.2522 34.2261 18.2522 35.6928C18.2522 37.1595 19.4522 38.3595 20.9189 38.3595C22.3855 38.3595 23.5855 37.1595 23.5855 35.6928C23.5855 34.2261 22.3855 33.0261 20.9189 33.0261Z'
          fill='white'
        />
        <defs>
          <filter
            id='filter0_d_606_1421'
            x='0.333252'
            y='0.333252'
            width='62.6667'
            height='74.8867'
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
              result='effect1_dropShadow_606_1421'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_606_1421'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
