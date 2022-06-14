import { createTRPCClient } from '@trpc/client'
import config, { getBaseUrl } from '../config/config'
import { AppRouter } from '../server/routers/router'
import fetch from 'node-fetch'
import superjson from 'superjson'
import { solanaAuthAtom } from '../modules/common/authAtom'
import { GetRecoilValue } from 'recoil'
import { getRecoil } from 'recoil-nexus'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'

const rpc = createTRPCClient<AppRouter>({
  url: getBaseUrl() + '/api/trpc',
  fetch: fetch as any,
  transformer: superjson,
  headers: () => {
    const solanaAuth = getRecoil(solanaAuthAtom)

    return {
      signature: solanaAuth.signature,
      wallet: solanaAuth.wallet,
    }
  },

  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],

  /* links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ] */
})

export default rpc
