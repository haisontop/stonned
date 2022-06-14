/**
 * This file contains the root router of your tRPC-backend
 */
import superjson from 'superjson'
import { createRouter } from '../createRouter'
import { postRouter } from './example'
import { mintNukedRouter } from './nuked/mintNuked'
import { breedingRouter } from './breeding'
import { rentingRouter } from './renting'
import { stakingStatsRouter } from './stats/stakingStats'
import { nftRouter } from './nfts'
import { merchRouter } from '../../modules/merch/merchRouter'
import { lotteryRouter } from '../../modules/raffle/lotteryRouter'
import { cicadaRouter } from '../../modules/cicada/cicadaRouter'
import { eventRouter } from '../../modules/events/eventRouter'
import { awakeningRouter } from '../../modules/awakening/awakeningRouter'
import { roadmapRouter } from '../../modules/roadmap/roadmapRouter'

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  /**
   * Optionally do custom error (type safe!) formatting
   * @link https://trpc.io/docs/error-formatting
   */
  // .formatError(({ shape, error }) => { })
  .merge('post.', postRouter)
  .merge('breeding.', breedingRouter)
  .merge('rent.', rentingRouter)
  .merge('nuked.', mintNukedRouter)
  .merge('stakingStats.', stakingStatsRouter)
  .merge('nfts.', nftRouter)
  .merge('merch.', merchRouter)
  .merge('raffle.', lotteryRouter)
  .merge('cicada.', cicadaRouter)
  .merge('events.', eventRouter)
  .merge('awakening.', awakeningRouter)
  .merge('roadmap.', roadmapRouter)

export type AppRouter = typeof appRouter
