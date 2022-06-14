import { Spinner } from '@chakra-ui/react'
import { ComponentProps } from 'react'

export default (props: ComponentProps<typeof Spinner>) => (
  <Spinner
    size={'lg'}
    transform='translate(-50%, -50%)'
    position={'fixed'}
    left={'50%'}
    top={'40%'}
    {...props}
  />
)
