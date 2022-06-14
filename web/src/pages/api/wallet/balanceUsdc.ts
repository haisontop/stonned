import { PublicKey } from '@solana/web3.js'
import axios from 'axios'
import { round } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'
import config, {
  connection,
  puffToken,
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

      const usdcTokenAccount = (await getTokenAccount(
        connection,
        new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
        new PublicKey(wallet)
      ))!!
      console.log(usdcTokenAccount)

      const usdcBalance = (await connection.getTokenAccountBalance(
        usdcTokenAccount.pubkey
      ))!!

      res.json({
        balance: usdcBalance.value.uiAmount as number,
      })
  }
}
