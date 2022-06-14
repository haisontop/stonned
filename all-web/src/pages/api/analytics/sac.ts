import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { address, name },
    method,
    headers,
  } = req

  switch (method) {
    case 'GET':

      const puffHistory = await axios.get(
        'https://api.coingecko.com/api/v3/coins/puff/market_chart?vs_currency=usd&days=14'
      )

      
      

      res.json({
        puffPriceHistory: puffHistory.data.prices
      })
  }
}