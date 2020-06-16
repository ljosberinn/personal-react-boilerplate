// Use the hidden-source-map option when you don't want the source maps to be
// publicly available on the servers, only to the error reporting
const nextSourceMaps = require('@zeit/next-source-maps')();
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withOffline = require('next-offline');
const { withPlugins } = require('next-compose-plugins');

const {
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
} = process.env;

const date = new Date();

console.debug(`> Building on NODE_ENV="${NODE_ENV}"`);

const offlineConfig = {
  target: 'serverless',
  transformManifest: manifest => ['/'].concat(manifest), // add the homepage to the cache
  // turn on the SW in dev mode so that we can actually test it
  generateInDevMode: true,
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

const defaultConfig = {
  env: {
    BUILD_TIME: date.toString(),
    BUILD_TIMESTAMP: +date,
  },
  webpack: (config, { isServer, buildId }) => {
    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
    }

    if (
      SENTRY_DSN &&
      SENTRY_ORG &&
      SENTRY_PROJECT &&
      SENTRY_AUTH_TOKEN &&
      NODE_ENV === 'production'
    ) {
      config.plugins.push(
        new SentryWebpackPlugin({
          include: '.next',
          ignore: ['node_modules'],
          urlPrefix: '~/_next',
          release: buildId,
        })
      );
    }

    return config;
  },
  reactStrictMode: true,
  // experimental: {
  //   modern: true,
  // },
};

module.exports = withPlugins([
  [nextSourceMaps, defaultConfig],
  [withOffline, offlineConfig],
]);
