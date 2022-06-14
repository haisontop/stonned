import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const SPLTokenIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 67 71'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          opacity='0.4'
          d='M27.1422 46.4523C37.8064 46.4523 46.4514 37.8073 46.4514 27.1432C46.4514 16.479 37.8064 7.83398 27.1422 7.83398C16.478 7.83398 7.83304 16.479 7.83304 27.1432C7.83304 37.8073 16.478 46.4523 27.1422 46.4523Z'
          fill='#E192B6'
        />
        <g filter='url(#filter0_d_616_1454)'>
          <path
            d='M56.0944 41.641C56.0944 49.616 49.6177 56.0926 41.6427 56.0926C36.7127 56.0926 32.3869 53.6276 29.7769 49.8818C40.3135 48.6976 48.6994 40.3118 49.8835 29.7751C53.6294 32.3851 56.0944 36.711 56.0944 41.641Z'
            fill='#DC1670'
          />
        </g>
        <g filter='url(#filter1_d_616_1454)'>
          <path
            d='M30.6705 26.4662L24.8705 24.4362C24.2905 24.2429 24.1697 24.1945 24.1697 23.3487C24.1697 22.7204 24.6047 22.2129 25.1605 22.2129H28.7855C29.5589 22.2129 30.1872 22.9137 30.1872 23.7837C30.1872 24.7745 31.0089 25.5962 31.9997 25.5962C32.9905 25.5962 33.8122 24.7745 33.8122 23.7837C33.8122 21.0464 31.7257 18.8015 29.0998 18.619C29.0324 18.6143 28.9789 18.5588 28.9789 18.4912C28.9789 17.5004 28.1572 16.6787 27.1664 16.6787C26.1755 16.6787 25.3539 17.4762 25.3539 18.4912C25.3539 18.5579 25.2998 18.612 25.233 18.612H25.1364C22.5989 18.612 20.5205 20.7387 20.5205 23.3729C20.5205 25.6687 21.5355 27.1429 23.638 27.8679L29.4622 29.8979C30.0422 30.0912 30.163 30.1395 30.163 30.9854C30.163 31.6137 29.728 32.1212 29.1722 32.1212H25.5472C24.7739 32.1212 24.1455 31.4204 24.1455 30.5504C24.1455 29.5595 23.3239 28.7379 22.333 28.7379C21.3422 28.7379 20.5205 29.5595 20.5205 30.5504C20.5205 33.2793 22.5943 35.5189 25.2088 35.7134C25.2897 35.7194 25.3539 35.7859 25.3539 35.867C25.3539 36.8579 26.1755 37.6795 27.1664 37.6795C28.1572 37.6795 28.9789 36.8579 28.9789 35.867C28.9789 35.8003 29.033 35.7462 29.0997 35.7462H29.1964C31.7339 35.7462 33.8122 33.6195 33.8122 30.9854C33.8122 28.6895 32.773 27.2154 30.6705 26.4662Z'
            fill='#DC1670'
          />
        </g>
        <defs>
          <filter
            id='filter0_d_616_1454'
            x='19.7769'
            y='23.7751'
            width='46.3175'
            height='46.3174'
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
              values='0 0 0 0 0.862745 0 0 0 0 0.0862745 0 0 0 0 0.439216 0 0 0 0.5 0'
            />
            <feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow_616_1454'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_616_1454'
              result='shape'
            />
          </filter>
          <filter
            id='filter1_d_616_1454'
            x='10.5205'
            y='10.6787'
            width='33.2917'
            height='41.0007'
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
              values='0 0 0 0 0.862745 0 0 0 0 0.0862745 0 0 0 0 0.439216 0 0 0 0.5 0'
            />
            <feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow_616_1454'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_616_1454'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
