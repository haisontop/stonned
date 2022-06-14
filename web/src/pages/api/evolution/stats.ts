import { web3 } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import type { NextApiRequest, NextApiResponse } from 'next'
import { connection } from '../../../config/config'
import prisma from '../../../lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { address, name },
    method,
    headers,
  } = req


  
}
