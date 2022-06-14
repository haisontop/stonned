import { createTRPCClient } from '@trpc/client'
import config, { getBaseUrl } from '../config/config'
import { AppRouter } from '../server/routers/router'
import fetch from 'node-fetch'
import superjson from 'superjson'

const rpc = createTRPCClient<AppRouter>({
  url: getBaseUrl() + '/api/trpc',
  fetch: fetch as any,
  transformer: superjson,
  /* links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ] */
})

export default rpc
