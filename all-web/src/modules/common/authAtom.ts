import { atom } from 'recoil'

export const solanaAuthAtom = atom({
  key: 'solanaAuth',
  default: {
    signature: '',
    wallet: '',
  },
})
