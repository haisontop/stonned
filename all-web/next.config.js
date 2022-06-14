const withTM = require("next-transpile-modules")([
  /* "@blocto/sdk", */
   "@project-serum/sol-wallet-adapter",
   "@solana/wallet-adapter-base",
  "@solana/wallet-adapter-react",
  "@solana/wallet-adapter-wallets",
  "@solana/wallet-adapter-bitpie",
  "@solana/wallet-adapter-coin98",
  "@solana/wallet-adapter-ledger",
  "@solana/wallet-adapter-mathwallet",
  "@solana/wallet-adapter-phantom",
  "@solana/wallet-adapter-safepal",
  "@solana/wallet-adapter-slope",
  "@solana/wallet-adapter-solflare",
  "@solana/wallet-adapter-sollet",
  "@solana/wallet-adapter-solong",
   "@solana/wallet-adapter-torus",
]);

const { withSentryConfig } = require('@sentry/nextjs');



const sentryWebpackPluginOptions = {
  silent: true, 
};


/** @type {import('next').NextConfig} */
module.exports = withSentryConfig({
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      fs: false,
      os: false,
      path: false,
      crypto: false,
    };

    return config;
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/launch',
  //       permanent: true,
  //     },
  //   ]
  // },
}, sentryWebpackPluginOptions);

/* module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      fs: false,
      os: false,
      path: false,
      crypto: false,
    };

    return config;
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/launch',
  //       permanent: true,
  //     },
  //   ]
  // },
} */
