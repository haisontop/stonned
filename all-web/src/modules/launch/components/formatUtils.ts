import { Pricing } from '@prisma/client'

export function getDisplayForAllPricings(pricings: Pricing[]) {
  const priceDisplay = pricings.reduce(
    (prev, current) => {
      const prefix = prev ? `${prev} + ` : ''
      return prefix + getPricingDisplay(current)
    },
    ''
  )
  return priceDisplay
}

export function getPricingDisplay(pricing: Pricing) {
  if (pricing.currency === 'SOL' || !!pricing.amount) {
    return pricing.amount?.toFixed(2) + ' ' + pricing.currency
  } else {
    return pricing.amountInSol!.toFixed(2) + ' SOL in $' + pricing.currency
  }
}