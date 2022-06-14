import { PublicKey } from '@solana/web3.js'
import axios from 'axios'
import { round } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import { z } from 'zod'
import config, {
  puffBurnerWallet,
  connection,
  puffToken,
  TREASURY_ADDRESS,
} from '../../../config/config'
import prisma from '../../../lib/prisma'
import { getTokenAccount } from '../../../utils/solUtils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { address, name },
    method,
    headers,
  } = req

  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

  switch (method) {
    case 'GET':
      const mint = z.string().parse(req.query.mint)

      const metadata = await prisma.tokenMetadata.findUnique({
        where: { mint },
      })

      if (!metadata) return res.status(404)

      res.json(JSON.parse(metadata.data))

      break
    default:
      res.status(404)
  }
}
