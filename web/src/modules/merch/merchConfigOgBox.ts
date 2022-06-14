import { PublicKey } from '@solana/web3.js'
import { ENV } from '../../config/config'
import { pub } from '../../utils/solUtils'

const configPerEnv = {
  dev: {
    wallet: new PublicKey('7TBvezty1TbDdaxcJ4a42NeS74tUUd9myc4BzPKcaH58'),
    boxCreator: new PublicKey('AmNm6LT458oK4XDhPp4UEYWoCY8ip5YgZQUGf5mRTkdo'),
    boxSaleStart: new Date(Date.parse('6 March 2022 21:00:00 GMT')),
  },
  production: {
    wallet: new PublicKey('7TBvezty1TbDdaxcJ4a42NeS74tUUd9myc4BzPKcaH58'),
    boxCreator: new PublicKey('DgdbdvVbMYHQyM7N7ZYp8fwysGzCVGdn8PJ12P5cvv49'),
    boxSaleStart: new Date(Date.parse('6 March 2022 21:00:00 GMT')),
  },
}

//old boxCreator 2rqTqd5kHBgQSgAZds3aBT8mPF7oPzq76iUBu5P3hiUL

export const boxCreatorOld = pub('2rqTqd5kHBgQSgAZds3aBT8mPF7oPzq76iUBu5P3hiUL')

export const merchBurnWalletOg = new PublicKey(
  'Fde8qhkD1HxjMUDtwJ5Zfs5zSA5hbLuiTPeCfamL3ynj'
)

export const merchConfigOgBox = configPerEnv[ENV]
