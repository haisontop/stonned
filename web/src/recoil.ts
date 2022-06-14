import { atom } from 'recoil'

export const authSignatureAtom = atom<string | undefined>({
  key: 'authSignature', // unique ID (with respect to other atoms/selectors)
  default: undefined, // default value (aka initial value)
})

export const reseveredAtom = atom<number>({
  key: 'resevered', // unique ID (with respect to other atoms/selectors)
  default: 0, // default value (aka initial value)
})

export const isPublicSaleAtom = atom({
  key: 'publicSale', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
})
