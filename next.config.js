// Use the hidden-source-map option when you don't want the source maps to be
// publicly available on the servers, only to the error reporting
const withSourceMaps = require('@zeit/next-source-maps')();
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withOffline = require('next-offline');
const { withPlugins } = require('next-compose-plugins');
const { IgnorePlugin } = require('webpack');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const {
  NEXT_PUBLIC_SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
  VERCEL_GITHUB_COMMIT_SHA,
} = process.env;

const date = new Date();

console.debug(`> Building on NODE_ENV="${NODE_ENV}"`);

const offlineConfig = {
  target: 'serverless',
  // add the homepage to the cache
  transformManifest: (manifest) => ['/'].concat(manifest),
  // turn on the SW in dev mode so that we can actually test it
  generateInDevMode: false,
  dontAutoRegisterSw: true,
  workboxOpts: {
    swDest: '../public/service-worker.js',
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'https-calls',
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
};

/**
 * a list of packages not to bundle with the frontend
 *
 * @see https://arunoda.me/blog/ssr-and-server-only-modules
 */
const serverOnlyPackages = [];

const defaultConfig = {
  typescript: {
    /**
     * `yarn tsc` is run in CI already so we can safely assume no errors here
     * reduces build time by ~55%
     * @see https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors
     */
    ignoreBuildErrors: true,
  },
  env: {
    BUILD_TIME: date.toString(),
    BUILD_TIMESTAMP: +date,
  },
  webpack: (config, { isServer, buildId }) => {
    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/react';

      serverOnlyPackages.forEach((package) => {
        config.plugins.push(new IgnorePlugin(new RegExp(package)));
      });
    }

    if (
      NODE_ENV === 'production' &&
      NEXT_PUBLIC_SENTRY_DSN &&
      SENTRY_ORG &&
      SENTRY_PROJECT &&
      SENTRY_AUTH_TOKEN &&
      VERCEL_GITHUB_COMMIT_SHA
    ) {
      config.plugins.push(
        /**
         * @see https://docs.sentry.io/product/integrations/vercel/
         * @see https://github.com/getsentry/sentry-webpack-plugin#options
         */
        new SentryWebpackPlugin({
          include: '.next',
          ignore: ['node_modules'],
          urlPrefix: '~/_next',
          release: VERCEL_GITHUB_COMMIT_SHA,
          deploy: {
            env: NODE_ENV,
            started: +date,
          },
        })
      );
    }

    return config;
  },
  reactStrictMode: true,
  experimental: {
    modern: true,
  },
};

module.exports = withPlugins(
  [withBundleAnalyzer, withSourceMaps, [withOffline, offlineConfig]],
  defaultConfig
);
