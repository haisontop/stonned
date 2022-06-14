import { web3 } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import type { NextApiRequest, NextApiResponse } from 'next'
import { connection } from '../../../config/config'
import prisma from '../../../lib/prisma'
import { verifySignature } from '../../../utils/solUtils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { address, name },
    method,
    headers,
  } = req

  const signature = headers['signature']

  if (typeof address !== 'string') throw Error('address wrong')

  if (typeof signature !== 'string') throw Error('no signature')

  if (!verifySignature(address, JSON.parse(signature))) return res.status(403).json({ message: 'signature wrong' })

  let user = await prisma.whitelistUser.findUnique({
    where: {
      address: address,
    },
  })

  if (!user) return res.status(401).json({ message: 'you are not whitelisted' })

  switch (method) {
    case 'GET':
      // Get data from your database

      res.status(200).json({ reserved: user.reserved })
      break

    case 'PUT':
      console.log('req.body', req.body)

      const txs = req.body.txs as string[]

      let minted = 0

      if (txs) {
        await Promise.all(
          txs.map(async (tx) => {
            const res = await connection.confirmTransaction(tx, 'confirmed')
            console.log('confirmTransaction res', res)

            minted++
          }),
        )
      }

      if (minted < 1) throw new Error('wrong body')

      user = await prisma.whitelistUser.update({
        where: {
          address,
        },
        data: {
          reserved: user.reserved - minted,
        },
      })
      // Update or create data in your database
      res.status(200).json({ reserved: user.reserved })
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
