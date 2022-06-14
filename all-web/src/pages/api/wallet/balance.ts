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
      const { wallet } = req.query

      const walletBalance = await connection.getBalance(new PublicKey(wallet))

      res.json({
        balance: walletBalance,
      })
  }
}
