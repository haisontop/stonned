import { ChakraProvider, useToast } from '@chakra-ui/react'

import theme, { Fonts } from '../theme'
import themeFlat, { Fonts as FontsFlat } from '../themeFlat'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { WalletBalanceProvider } from '../utils/useWalletBalance'
import '../styles/globals.css'
import axios, { AxiosError } from 'axios'
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
import { GA_TRACKING_ID } from '../config/config'
import { AppRouter } from '../server/routers/router'
import { withTRPC } from '@trpc/next'
import superjson from 'superjson'
import NextNProgress from 'nextjs-progressbar'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import Modal from '../modules/common/Modal'
import Cohere from 'cohere-js'
import { stringifyPKsAndBNs } from '../utils/publicKeyUtils'
import RecoilNexus, { getRecoil } from 'recoil-nexus'
import { solanaAuthAtom } from '../modules/common/authAtom'
import WalletConnectionProvider from '../components/WalletConnectionProvider'
Cohere.init('zqb7qZhwwhX8sXaikgiBd-nf')

require('../components/wallet-ui/styles.css')

/* const log = console.log
console.log = function () {
  var args = Array.from(arguments) // ES5
  const newArgs = args.map((a) => stringifyPKsAndBNs(a))
  log.apply(console, newArgs)
} */

const persistedAtoms = [authSignatureAtom, solanaAuthAtom]

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

// function getTheme() {
//   // TODO
//   return 'themeFlat'
// }

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
      <RecoilNexus />
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
      <ChakraProvider resetCSS theme={themeFlat}>
        <WalletConnectionProvider>
          <Fonts />
          <FontsFlat />
          <Head>
            <Script dangerouslySetInnerHTML={{ __html: renderSnippet() }} />
            <link rel='shortcut icon' href='/favicon.png' />
            {/*  <link rel='apple-touch-icon' sizes='180x180' href='/favicons/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicons/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicons/favicon-16x16.png' /> */}
            {/*  <link rel='manifest' href='/favicons/site.webmanifest' /> */}
            <title>ALL Blue | Launch</title>
            <meta property='og:title' content='ALL Blue | Launch' key='title' />
            <meta
              name='viewport'
              content='width=device-width, initial-scale=1.0'
            />
            <meta
              name='description'
              content='Solana NFT Launchpad for secure, smooth and social mints. Powered by ALL Blue.'
            />
            <meta
              property='og:description'
              content='Solana NFT Launchpad for secure, smooth and social mints. Powered by ALL Blue.'
            />
            <meta property='image' content='/image/meta-image.jpeg' />
            <meta property='twitter:card' content='summary_large_image' />
            <meta property='twitter:title' content=' ALL Blue | Launch' />
            <meta
              property='twitter:description'
              content='Solana NFT Launchpad for secure, smooth and social mints. Powered by ALL Blue.'
            />
            <meta property='twitter:image' content='/image/meta-image.jpeg' />
          </Head>
          <NextNProgress
            color='linear-gradient(91.55deg, #ECBF4D 8.69%, #ED5647 101.31%), #393E46'
            startPosition={0.3}
            stopDelayMs={200}
            height={2}
            showOnShallow={true}
          />
          <Toaster />
          <Modal />
          <Component {...pageProps} />
        </WalletConnectionProvider>
      </ChakraProvider>
    </RecoilRoot>
  )
}

function getBaseUrl() {
  if (process.browser) {
    return ''
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
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
      headers: async () => {
        const solanaAuth = getRecoil(solanaAuthAtom)

        return {
          signature: solanaAuth.signature,
          wallet: solanaAuth.wallet,
        }
      },
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
  ssr: false,

  /**
   * Set headers or status code when doing SSR
   */
  // responseMeta({ clientErrors }: any) {
  //   if (clientErrors.length) {
  //     // propagate http first error from API calls
  //     return {
  //       status: clientErrors[0].data?.httpStatus ?? 500,
  //     }
  //   }

  //   // for app caching with SSR see https://trpc.io/docs/caching

  //   return {}
  // },
})(MyApp)
