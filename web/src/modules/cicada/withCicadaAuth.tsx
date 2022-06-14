import { InferGetServerSidePropsType } from 'next'
import { getCicadaAuthServerSideProps } from './cicadaService'
import CicadaAuth from './components/CicadaAuth'

export default function withCicadaAuth(Component: React.FC<any>) {
  return (
    props: InferGetServerSidePropsType<
      ReturnType<typeof getCicadaAuthServerSideProps>
    >
  ) => {
    console.log('props.state', props.state)

    if (!props.state) return null

    if (props.state === 'needs-auth') return <CicadaAuth />

    if (props.state === 'not-allowed') return <CicadaAuth notAllowed />

    return <Component />
  }
}
