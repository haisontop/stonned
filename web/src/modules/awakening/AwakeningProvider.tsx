import React, { useState } from 'react'
import { NftMetadata } from '../../utils/nftmetaData.type'
import { PublicKey } from '@solana/web3.js'

export enum AwakenStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  AWAKEN = 'AWAKEN',
}

type AwakeningState = {
  status: AwakenStatus,
  apeToAwaken?: NftMetadata,
  awakeningPubkey?: PublicKey
}

const initialValues: {
  status: AwakeningState
  setStatus: React.Dispatch<React.SetStateAction<AwakeningState>>
} = {
  status: {
    status: AwakenStatus.NEW,
    apeToAwaken: undefined,
    awakeningPubkey: undefined
  },
  setStatus: () => {
    return
  },
}

export const AwakeningContext = React.createContext(initialValues)

const AwakeninContextProvider: React.FC<{
  children: React.ReactNode
}> = (props: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<AwakeningState>({
    status: AwakenStatus.NEW,
    apeToAwaken: undefined,
    awakeningPubkey: undefined
  })

  return (
    <AwakeningContext.Provider
      value={{
        status,
        setStatus,
      }}
    >
      {props.children}
    </AwakeningContext.Provider>
  )
}

export default AwakeninContextProvider
