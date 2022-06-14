import { Metadata } from '@metaplex/js'
import { z } from 'zod'
import { connection, nuked } from '../../config/config'
import { createRouter } from '../createRouter'

export const nftRouter = createRouter().query('get', {
  input: z.object({
    creatorId: z.string(),
  }),
  async resolve({ ctx, input }) {
    const nfts = await Metadata.findMany(connection, {
      creators: [nuked.creator],
    })

    return nfts
  },
})
