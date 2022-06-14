import { createRouter } from '../../server/createRouter'
import { z } from 'zod'

export const roadmapRouter = createRouter()
  .query('getAllRoadmaps', {
    /* input: z.object({
    
  }), */
    async resolve({ ctx: { prisma, ...ctx }, input }) {
      const projects = await prisma.roadmap.findMany()

      return projects
    },
  })
  .query('getRoadmap', {
    input: z.object({
      roadmapId: z.string(),
    }),
    async resolve({ ctx: { prisma, ...ctx }, input }) {
      const project = await prisma.roadmap.findUnique({
        where: {
          id: input.roadmapId,
        },
      })

      return project
    },
  })
