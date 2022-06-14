import * as trpcNext from '@trpc/server/adapters/next'
import { appRouter } from '../../../server/routers/router'
import { createContext } from '../../../server/context'

export default trpcNext.createNextApiHandler({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext,
  /**
   * @link https://trpc.io/docs/error-handling
   */
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong in trpc', error)
    }
  },
  /**
   * Enable query batching
   */
  batching: {
    enabled: true,
  },
  /**
   * @link https://trpc.io/docs/caching#api-response-caching
   */
  // responseMeta() {
  //   // ...
  // },

  responseMeta({ ctx, paths, type, errors }) {
    // assuming you have all your public routes with the keyword `public` in them
    const allPublic = paths && paths.every((path) => path.includes('public'))
    // checking that no procedures errored
    const allOk = errors.length === 0
    // checking we're doing a query request
    const isQuery = type === 'query'

    if (!isQuery || !ctx?.res || !allOk) return {}

    if (paths && paths.every((path) => path.includes('stakingStats.all')))
      return {
        headers: {
          'cache-control': `public, max-age=600`,
        },
      }

    return {}
  },
})
