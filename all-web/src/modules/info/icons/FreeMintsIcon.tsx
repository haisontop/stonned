import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const FreeMintsIcon: React.FC<ComponentProps<typeof Box>> = ({
  props,
}) => {
  return (
    <Icon
      xmlns='http://www.w3.org/2000/svg'
      width='69'
      height='73'
      viewBox='0 0 69 73'
      {...props}
    >
      <path
        opacity='0.4'
        d='M50.5994 5.33398H39.3994C30.1994 5.33398 26.466 8.98732 26.3594 18.0007H34.5994C45.7994 18.0007 50.9994 23.2007 50.9994 34.4007V42.6407C60.0127 42.534 63.666 38.8007 63.666 29.6007V18.4007C63.666 9.06732 59.9327 5.33398 50.5994 5.33398Z'
        fill='#FFA094'
      />
      <g filter='url(#filter0_d_2263_3212)'>
        <path
          d='M34.6026 21.334H23.4026C14.0693 21.334 10.3359 25.0673 10.3359 34.4007V45.6007C10.3359 54.934 14.0693 58.6673 23.4026 58.6673H34.6026C43.9359 58.6673 47.6693 54.934 47.6693 45.6007V34.4007C47.6693 25.0673 43.9359 21.334 34.6026 21.334ZM37.7759 36.4007L27.8826 46.294C27.5093 46.6673 27.0293 46.854 26.5226 46.854C26.0159 46.854 25.5359 46.6673 25.1626 46.294L20.2026 41.334C19.4559 40.5873 19.4559 39.3873 20.2026 38.6407C20.9493 37.894 22.1493 37.894 22.8959 38.6407L26.4959 42.2407L35.0559 33.6807C35.8026 32.934 37.0026 32.934 37.7493 33.6807C38.4959 34.4273 38.5226 35.654 37.7759 36.4007Z'
          fill='#FC6653'
        />
      </g>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M38.3992 33.5926C39.2003 34.3827 39.2003 35.6636 38.3992 36.4537L26.6923 48L19.6008 41.0058C18.7997 40.2157 18.7997 38.9347 19.6008 38.1446C20.4019 37.3545 21.7007 37.3545 22.5018 38.1446L26.6923 42.2777L35.4982 33.5926C36.2993 32.8025 37.5981 32.8025 38.3992 33.5926Z'
        fill='#FFA094'
      />
      <defs>
        <filter
          id='filter0_d_2263_3212'
          x='0.335938'
          y='15.334'
          width='57.3359'
          height='57.333'
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
            result='effect1_dropShadow_2263_3212'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_2263_3212'
            result='shape'
          />
        </filter>
      </defs>
    </Icon>
  )
}
