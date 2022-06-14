import { pub } from '../../utils/solUtils'

const configPerEnv = {
  common: {
    countdownEnd: new Date('2022-04-20T23:20:00+00:00'),
  },
  dev: {
    creator: pub('8YiJpp4Jnyd6EVQ9Wt15YRgjoR2DKxkg87b5WuLBeP9L'),
  },
  production: {
    creator: pub('5xLvUHFDndtMnobvdAHZRYTFdxKtvswkg8EWi444niyp'),
  },
}

export const ENV =
  (process.env.NEXT_PUBLIC_ENV as 'production' | undefined) ?? 'dev'
const cicadaConfig = { ...configPerEnv.common, ...configPerEnv[ENV] }

export const signingMessage = 'auth'

export default cicadaConfig
