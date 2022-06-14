import { Box, Icon } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export const UnverifedMintIcon: React.FC<ComponentProps<typeof Box>> = ({
  restProps,
}) => {
  return (
    <Box {...restProps}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 64 64'
        width='100%'
        height={'100%'}
      >
        <path
          opacity='0.4'
          d='M34.3063 42.3085C33.4263 41.4285 32.253 40.9219 30.9996 40.9219H17.453C15.8263 40.9219 14.333 41.7485 13.4796 43.1352C12.6263 44.4952 12.5463 46.1219 13.2396 47.5619C16.5196 54.2819 22.4396 59.5619 29.4796 62.0419C29.9596 62.2019 30.493 62.3085 30.9996 62.3085C31.933 62.3085 32.8663 62.0152 33.6663 61.4552C34.9196 60.5752 35.6663 59.1352 35.6663 57.6152L35.693 45.6152C35.6663 44.3619 35.1863 43.1885 34.3063 42.3085Z'
          fill='#FFA094'
        />
        <g filter='url(#filter0_d_2349_4193)'>
          <path
            d='M66.9478 28.5987C63.9611 15.4787 52.4678 6.33203 39.0011 6.33203C25.5344 6.33203 14.0411 15.4787 11.0544 28.5987C10.7344 29.9854 11.0544 31.3987 11.9611 32.5187C12.8678 33.6387 14.2011 34.2787 15.6411 34.2787H62.3878C63.8278 34.2787 65.1611 33.6387 66.0678 32.5187C66.9478 31.3987 67.2678 29.9587 66.9478 28.5987Z'
            fill='#FC6653'
          />
        </g>
        <path
          opacity='0.4'
          d='M64.492 43.2667C63.6387 41.88 62.1454 41.0267 60.492 41.0267L46.9987 41C45.7454 41 44.572 41.48 43.692 42.36C42.812 43.24 42.332 44.4133 42.332 45.6667L42.3587 57.6133C42.3587 59.1333 43.1054 60.5733 44.3587 61.4533C45.1587 62.0133 46.092 62.3067 47.0254 62.3067C47.532 62.3067 48.0387 62.2267 48.5187 62.04C55.5054 59.5867 61.4254 54.3333 64.7054 47.6933C65.3987 46.28 65.3187 44.6267 64.492 43.2667Z'
          fill='#FFA094'
        />
        <defs>
          <filter
            id='filter0_d_2349_4193'
            x='0.933594'
            y='0.332031'
            width='76.1367'
            height='47.9453'
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
              result='effect1_dropShadow_2349_4193'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_2349_4193'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </Box>
  )
}
