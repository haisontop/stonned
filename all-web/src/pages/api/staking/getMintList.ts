import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { address, name },
    method,
    headers,
    body,
  } = req

  switch (method) {
    case 'GET':
      const bannedList = await prisma.banlist.findMany()

      res.setHeader('Cache-Control', 'public, max-age=3600')

      res.json({ mintList: bannedList })
      break
    default:
      res.status(404)
      break
  }
}
