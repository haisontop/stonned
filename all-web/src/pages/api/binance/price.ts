import { PublicKey } from '@solana/web3.js'
import axios from 'axios'
import { round } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'
import config, {
  connection,
  allToken,
  TREASURY_ADDRESS,
} from '../../../config/config'
import { getTokenAccount } from '../../../utils/solUtils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { address, name },
    method,
    headers,
  } = req

  switch (method) {
    case 'GET':
      const { symbol, startTime } = req.query

      const priceRes = await axios.get(
        `https://api1.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&startTime=${startTime}&limit=1`
      )

      const price = Number(priceRes.data[0][1])

      res.json({
        price,
      })
  }
}
