import { useInterval } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { trpc } from '../../utils/trpc'
import { merchConfig } from './merchConfig'

export enum MerchDropStatus {
  UNSET = 'unset',
  WAITING = 'waiting',
  COUNTDOWN = 'countdown',
  TOKEN_PURCHASE = 'token_purchase',
  SOLD_OUT = 'sold_out',
}

const initialValues: {
  status: MerchDropStatus
  setStatus: React.Dispatch<React.SetStateAction<MerchDropStatus>>
} = {
  status: MerchDropStatus.UNSET,
  setStatus: () => {
    return
  },
}

export const MerchDropContext = React.createContext(initialValues)

const MerchDropContextProvider: React.FC<{
  children: React.ReactNode
}> = (props: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<MerchDropStatus>(
    MerchDropStatus.TOKEN_PURCHASE
  )

  /* const productsRes = trpc.useQuery(['merch.getBoxes'])
  useEffect(() => {
    if (!productsRes.data) return

    if (!productsRes.data.find((p) => p.amount > 0))
      setStatus(MerchDropStatus.SOLD_OUT)
  }, [productsRes.data]) */

  const getStatus = useCallback(() => status, [status])

  useInterval(() => {
    if (getStatus() !== MerchDropStatus.WAITING) return

    if (new Date().getTime() > merchConfig.saleStart.getTime())
      setStatus(MerchDropStatus.TOKEN_PURCHASE)
  }, 1000)

  return (
    <MerchDropContext.Provider
      value={{
        status,
        setStatus,
      }}
    >
      {props.children}
    </MerchDropContext.Provider>
  )
}

export default MerchDropContextProvider
