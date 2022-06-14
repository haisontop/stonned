export interface Auction {
  id: string
  name: string
  description?: string
  bid: number
  currency: string
  endDate: Date
  image: string
  status: 'live' | 'closed' // 'finished' ???
  minimumBid: number
}
