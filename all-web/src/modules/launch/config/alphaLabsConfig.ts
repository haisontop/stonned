import { pub } from '../../../utils/solUtils'

const configPerEnv = {
  dev: {
    mints: require('../assets/alphaLabsMints-devnet.json') as string[],
    creator: pub('2XFSU8pYjYx5mmJ5GJDFdMmVgL67MnXBv39avPibxn9r'),
  },
  production: {
    mints: require('../assets/alphaLabsMints-mainnet-beta.json') as string[],
    creator: pub('2XFSU8pYjYx5mmJ5GJDFdMmVgL67MnXBv39avPibxn9r'),
  },
}

export const ENV =
  (process.env.NEXT_PUBLIC_ENV as 'production' | undefined) ?? 'dev'
const config = configPerEnv[ENV]

export default config
