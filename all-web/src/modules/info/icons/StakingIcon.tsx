import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const StakingIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 64 69'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          opacity='0.4'
          d='M51.8898 34.6325C52.7673 34.6325 53.4648 33.9125 53.4648 33.0125V31.0325C53.4648 22.19 50.7648 19.5125 41.9448 19.5125H27.7698V24.98C28.6473 24.98 29.3673 25.7 29.3673 26.5775V32.6075C29.3673 33.485 28.6473 34.205 27.7698 34.205V39.8525C28.6473 39.8525 29.3673 40.5725 29.3673 41.45V47.4799C29.3673 48.3575 28.6473 49.0775 27.7698 49.0775V54.5H41.9448C50.7648 54.5 53.4648 51.7999 53.4648 42.9799C53.4648 42.1024 52.7673 41.3825 51.8898 41.3825C49.9998 41.3825 48.4923 39.875 48.4923 38.0075C48.4923 36.14 49.9998 34.6325 51.8898 34.6325Z'
          fill='#E192B6'
        />
        <g filter='url(#filter0_d_616_1471)'>
          <path
            d='M22.0323 19.535C22.0548 19.535 22.0548 19.535 22.0323 19.535H22.0548H41.9223C42.0798 19.535 42.2373 19.535 42.3723 19.535C42.3498 19.49 42.3498 19.4675 42.3498 19.4225C42.2823 18.635 42.5973 17.87 43.1823 17.285C43.4748 16.9925 43.6548 16.5875 43.6548 16.16C43.6548 15.7325 43.4748 15.3275 43.1823 15.035L41.9448 13.775C39.7398 11.5475 37.3098 9.5 34.4748 9.5C31.6623 9.5 29.2098 11.5475 27.0048 13.775L21.2448 19.535C21.4923 19.535 21.7623 19.535 22.0323 19.535Z'
            fill='#C5266E'
          />
        </g>
        <g filter='url(#filter1_d_616_1471)'>
          <path
            d='M26.1728 26.5779V32.6079C26.1728 33.4854 26.8928 34.2054 27.7703 34.2054V39.8529C26.8928 39.8529 26.1728 40.5729 26.1728 41.4504V47.4804C26.1728 48.3579 26.8928 49.0779 27.7703 49.0779V54.5004H22.0553C13.2353 54.5004 10.5353 51.8004 10.5353 42.9804V42.0129C10.5353 41.1129 11.2328 40.4154 12.1103 40.4154C14.0003 40.4154 15.5078 38.8854 15.5078 37.0179C15.5078 35.1504 14.0003 33.6204 12.1103 33.6204C11.2328 33.6204 10.5353 32.9229 10.5353 32.0229V31.0554C10.5353 22.2129 13.2353 19.5354 22.0553 19.5354H27.7478V25.0029C26.8928 25.0029 26.1728 25.7229 26.1728 26.5779Z'
            fill='#DC1670'
          />
        </g>
        <defs>
          <filter
            id='filter0_d_616_1471'
            x='11.2448'
            y='3.5'
            width='42.41'
            height='30.0349'
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
              result='effect1_dropShadow_616_1471'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_616_1471'
              result='shape'
            />
          </filter>
          <filter
            id='filter1_d_616_1471'
            x='0.535339'
            y='13.5354'
            width='37.235'
            height='54.9651'
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
              result='effect1_dropShadow_616_1471'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_616_1471'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
