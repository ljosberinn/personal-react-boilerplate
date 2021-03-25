const withOffline = require('next-offline');
const { withPlugins } = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

console.debug(`> Building on NODE_ENV="${process.env.NODE_ENV}"`);

/**
 * @see https://github.com/hanford/next-offline#customizing-service-worker
 */
const offlineConfig = {
  target: 'serverless',
  // add the homepage to the cache
  transformManifest: (manifest) => ['/'].concat(manifest),
  generateInDevMode: false,
  dontAutoRegisterSw: true,
  workboxOpts: {
    swDest: '../public/service-worker.js',
    clientsClaim: true,
    skipWaiting: true,
    exclude: [
      // clients that support service workers most likely support modules too
      // so it makes no sense to cache non-modules for them as they wouldn't
      // even load them in the first place
      /^(?!.*\.module\.js$).*\.js$/,
      /**
       * default values from next-offline which aren't merged in and aren't
       * exported either
       * @see https://github.com/hanford/next-offline/blob/master/packages/next-offline/index.js#L10
       */
      'react-loadable-manifest.json',
      'build-manifest.json',
      /\.map$/,
    ],
    runtimeCaching: [
      {
        // we do not want localhost to be served from service worker
        urlPattern: /https:\/\/personal-react-boilerplate.now.sh/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'https-calls',
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            // 1 month
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
};

const withSentry = (config, options) => {
  if (!options.isServer) {
    config.resolve.alias['@sentry/node'] = '@sentry/react';
  }

  // Define an environment variable so source code can check whether or not
  // it's running on the server so we can correctly initialize Sentry
  config.plugins.push(
    new options.webpack.DefinePlugin({
      'process.env.NEXT_IS_SERVER': JSON.stringify(options.isServer.toString()),
    })
  );

  /**
   * @see https://docs.sentry.io/product/integrations/vercel/
   */
  const hasSentry =
    process.env.NEXT_PUBLIC_SENTRY_DSN &&
    process.env.SENTRY_ORG &&
    process.env.SENTRY_PROJECT &&
    process.env.SENTRY_AUTH_TOKEN &&
    process.env.VERCEL_GITHUB_COMMIT_SHA;

  if (hasSentry && !options.isServer && process.env.NODE_ENV === 'production') {
    const SentryWebpackPlugin = require('@sentry/webpack-plugin');

    config.plugins.push(
      /**
       * @see https://github.com/getsentry/sentry-webpack-plugin#options
       */
      new SentryWebpackPlugin({
        include: '.next',
        ignore: ['node_modules'],
        stripPrefix: ['webpack://_N_E/'],
        urlPrefix: '~/_next',
        release: process.env.VERCEL_GITHUB_COMMIT_SHA,
      })
    );
  }
};

const defaultConfig = {
  typescript: {
    /**
     * `yarn lint:types` ran in CI already so we can safely assume no errors
     *  here, conveniently reducing build time by ~55%
     * @see https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors
     */
    ignoreBuildErrors: true,
  },
  webpack: (config, options) => {
    // disables transpiling all `__tests__` files, speeding up build process
    // in case of a barebones karma install, this reduces build time by ~ 25%
    config.plugins.push(new options.webpack.IgnorePlugin(/\/__tests__\//));

    withSentry(config, options);

    return config;
  },
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  i18n: {
    localeDetection: true,
    defaultLocale: process.env.NEXT_PUBLIC_FALLBACK_LANGUAGE,
    locales: process.env.NEXT_PUBLIC_ENABLED_LANGUAGES.split(','),
  },
  eslint: {
    dev: false,
    build: false,
  },
  productionBrowserSourceMaps: true,
  env: {
    // Make the COMMIT_SHA available to the client so that Sentry events can be
    // marked for the release they belong to. It may be undefined if running
    // outside of Vercel
    NEXT_PUBLIC_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
  },
};

module.exports = withPlugins(
  [withBundleAnalyzer, [withOffline, offlineConfig]],
  defaultConfig
);
