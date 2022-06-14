import asyncBatch from 'async-batch'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { currentDrops } from './merchConfig'
import { getCbdProduct } from './merchUtils'

export function useProduct() {
  const router = useRouter()

  const productHref = router.query.productHref as string

  return useQuery(['cbdProduct', productHref], async () => {
    return getCbdProduct(productHref)
  })
}

export function useProducts() {
  const router = useRouter()

  const productHref = router.query.productHref as string

  const currentDropsHrefs = useMemo(
    () => currentDrops.map((c) => c.href),
    [currentDrops]
  )

  return useQuery(['cbdProducts', currentDropsHrefs], async () => {
    return asyncBatch(
      currentDropsHrefs,
      async (drop) => {
        return getCbdProduct(drop)
      },
      2
    )
  })
}
