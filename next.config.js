const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withOffline = require('next-offline');
const { withPlugins } = require('next-compose-plugins');
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
     * `yarn lint:types` is run in CI already so we can safely assume no errors
     *  here, conveniently reducing build time by ~55%
     * @see https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors
     */
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer, dev, webpack }) => {
    // Perform customizations to webpack config
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));

    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/react';

      serverOnlyPackages.forEach((package) => {
        config.plugins.push(new webpack.IgnorePlugin(new RegExp(package)));
      });
    }

    if (
      !dev &&
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
        })
      );
    }

    return config;
  },
  reactStrictMode: true,
  experimental: {
    modern: true,
    // scrollRestoration: true,
    productionBrowserSourceMaps: true,
  },
};

module.exports = withPlugins(
  [withBundleAnalyzer, [withOffline, offlineConfig]],
  defaultConfig
);
