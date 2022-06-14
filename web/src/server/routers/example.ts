/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { createRouter } from '../createRouter'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const postRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      id: z.string().uuid().optional(),
      title: z.string().min(1).max(32),
      text: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
    /*   const post = await ctx.prisma.post.create({
        data: input,
      })
      return post */
    },
  })
  // read
  .query('all', {
    async resolve({ ctx }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return []
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      /* const { id } = input;
       const post = await ctx.prisma.post.findUnique({
         where: { id },
         select: {
           id: true,
           title: true,
           text: true,
           createdAt: true,
           updatedAt: true,
         },
       });
       if (!post) {
         throw new TRPCError({
           code: 'NOT_FOUND',
           message: `No post with id '${id}'`,
         });
       }
       return post; */
    },
  })
// update
