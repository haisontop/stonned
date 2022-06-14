import _ from 'lodash'
import { MutableSnapshot, RecoilState, Snapshot } from 'recoil'
import { getSolAdressFromText, pub } from './solUtils'

export function persistState(snapshot: Snapshot, atoms: RecoilState<any>[]) {
  if (typeof localStorage !== 'undefined') {
    const persistedRecoilState: Record<string, any> = {}

    atoms.forEach((atom) => {
      persistedRecoilState[atom.key] = snapshot.getLoadable(atom).contents
    })

    localStorage.setItem('recoilState', JSON.stringify(persistedRecoilState))
  }
}

export function restoreState(atoms: RecoilState<any>[]) {
  return ({ set }: MutableSnapshot) => {
    if (typeof localStorage !== 'undefined') {
      const _recoilState = localStorage.getItem('recoilState')

      if (typeof _recoilState === 'string') {
        const recoilState = JSON.parse(_recoilState, function (key, val) {
          const solanaAddress = _.isString(val)
            ? getSolAdressFromText(val)
            : undefined
          if (solanaAddress) {
            try {
              return pub(solanaAddress)
            } catch (error) {}
          }

          return val
        })

        for (const atom of atoms) {
          if (typeof atom.key !== 'undefined') {
            set(atom, recoilState[atom.key])
          }
        }
      }
    }
  }
}
