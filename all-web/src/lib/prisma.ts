import { PrismaClient } from '.prisma/client'

export default new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})
