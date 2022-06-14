import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const NewProjectJoinShapeIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 594 224'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M12 96.5H604.5' stroke='#A465FF' stroke-linecap='round' />
        <g filter='url(#filter0_d_405_21119)'>
          <circle cx='112' cy='97' r='62' fill='white' />
        </g>
        <g filter='url(#filter1_d_405_21119)'>
          <circle cx='347' cy='97' r='62' fill='white' />
        </g>
        <g filter='url(#filter2_d_405_21119)'>
          <circle cx='582' cy='97' r='62' fill='white' />
        </g>
        <defs>
          <filter
            id='filter0_d_405_21119'
            x='0'
            y='0'
            width='224'
            height='224'
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
            <feOffset dy='15' />
            <feGaussianBlur stdDeviation='25' />
            <feColorMatrix
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'
            />
            <feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow_405_21119'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_405_21119'
              result='shape'
            />
          </filter>
          <filter
            id='filter1_d_405_21119'
            x='235'
            y='0'
            width='224'
            height='224'
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
            <feOffset dy='15' />
            <feGaussianBlur stdDeviation='25' />
            <feColorMatrix
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'
            />
            <feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow_405_21119'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_405_21119'
              result='shape'
            />
          </filter>
          <filter
            id='filter2_d_405_21119'
            x='470'
            y='0'
            width='224'
            height='224'
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
            <feOffset dy='15' />
            <feGaussianBlur stdDeviation='25' />
            <feColorMatrix
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'
            />
            <feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow_405_21119'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_405_21119'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
