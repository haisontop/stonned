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
      res.setHeader('Cache-Control', 'public, max-age=15552000')
      res.json((await axios.get(req.query.uri as string)).data)
  }
}
