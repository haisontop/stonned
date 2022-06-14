import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import { Fonts as FontsFlat } from '../themeFlat'
import '../styles/globals.css'
import {
  RecoilRoot,
  Snapshot,
  useRecoilTransactionObserver_UNSTABLE,
} from 'recoil'
import { debounce } from 'lodash'
import { persistState, restoreState } from '../utils/recoilUils'
import { authSignatureAtom } from '../recoil'
import { Toaster } from 'react-hot-toast'
import { Router, useRouter } from 'next/dist/client/router'
import * as snippet from '@segment/snippet'
import * as gtag from '../utils/gtag'
import Script from 'next/script'
import { GA_TRACKING_ID, getBaseUrl } from '../config/config'
import { AppRouter } from '../server/routers/router'
import { withTRPC } from '@trpc/next'
import superjson from 'superjson'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import Modal from '../modules/common/Modal'
import { PublicKey } from '@solana/web3.js'
import { stringifyPKsAndBNs } from '../utils/publicKeyUtils'
import StonedHead from '../modules/stoned/StonedHead'
import { ThemeProvider } from '../contexts/ThemeContext'

require('@solana/wallet-adapter-react-ui/styles.css')

/* const log = console.log
console.log = function () {
  var args = Array.from(arguments) // ES5
  const newArgs = args.map((a) => stringifyPKsAndBNs(a))
  log.apply(console, newArgs)
} */

const persistedAtoms = [authSignatureAtom]

function PersistenceObserver() {
  useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
    debounce((snapshot: Snapshot) => {
      persistState(snapshot, persistedAtoms)
    }, 250)(snapshot)
  })

  return null
}

Router.events.on('routeChangeComplete', (url) => {
  // @ts-ignore window.analytics undefined below
  if (window.analytics) window.analytics.page(url)
})

function renderSnippet() {
  const opts = {
    apiKey: 'P68ElJDqlAj3mq2JEk3BI4DlyJF7B5tp',
    // note: the page option only covers SSR tracking.
    // Page.js is used to track other events using `window.analytics.page()`
    page: true,
  }

  if (process.env.NODE_ENV === 'development') {
    return snippet.max(opts)
  }

  return snippet.min(opts)
}

/* const queryClient = new QueryClient() */

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <RecoilRoot initializeState={restoreState(persistedAtoms)}>
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id='gtag-init'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <PersistenceObserver />
      <ThemeProvider>
        <FontsFlat />
        <StonedHead />

        <Toaster />
        <Modal />
        <Component {...pageProps} />
      </ThemeProvider>
    </RecoilRoot>
  )
}

export default withTRPC<AppRouter>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
  /**
   * Set headers or status code when doing SSR
   */
  responseMeta({ clientErrors }: any) {
    if (clientErrors.length) {
      // propagate http first error from API calls
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      }
    }

    // for app caching with SSR see https://trpc.io/docs/caching

    return {}
  },
})(MyApp)
