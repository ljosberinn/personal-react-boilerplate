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

const withSentry = (config, options) => {
  if (!options.isServer) {
    config.resolve.alias['@sentry/node'] = '@sentry/react';
  }

  /**
   * @see https://docs.sentry.io/product/integrations/vercel/
   */
  const hasSentry =
    process.env.NEXT_PUBLIC_SENTRY_DSN &&
    process.env.SENTRY_ORG &&
    process.env.SENTRY_PROJECT &&
    process.env.SENTRY_AUTH_TOKEN &&
    process.env.VERCEL_GITHUB_COMMIT_SHA;

  if (hasSentry && !options.isServer) {
    const SentryWebpackPlugin = require('@sentry/webpack-plugin');

    config.plugins.push(
      /**
       * @see https://github.com/getsentry/sentry-webpack-plugin#options
       */
      new SentryWebpackPlugin({
        include: '.next',
        ignore: ['node_modules'],
        urlPrefix: '~/_next',
        release: process.env.VERCEL_GITHUB_COMMIT_SHA,
      })
    );
  }
};

/**
 * replaces React with Preact in prod
 * this reduces the bundle size by approx. 32 kB
 */
const withPreact = (config, options) => {
  if (!options.dev) {
    const splitChunks = config.optimization && config.optimization.splitChunks;

    if (splitChunks) {
      const cacheGroups = splitChunks.cacheGroups;
      const test = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/u;
      if (cacheGroups.framework) {
        cacheGroups.preact = {
          ...cacheGroups.framework,
          test,
        };

        cacheGroups.commons.name = 'framework';
      } else {
        cacheGroups.preact = {
          name: 'commons',
          chunks: 'all',
          test,
        };
      }
    }

    const aliases = config.resolve.alias || (config.resolve.alias = {});
    aliases.react = aliases['react-dom'] = 'preact/compat';
    aliases['react-ssr-prepass'] = 'preact-ssr-prepass';
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
    withPreact(config, options);

    return config;
  },
  reactStrictMode: true,
  experimental: {
    modern: true,
    // bugged with Sentry, see https://github.com/vercel/next.js/issues/17073
    // scrollRestoration: true,
    productionBrowserSourceMaps: true,
    // i18n: {
    //   localeDetection: true,
    //   defaultLocale: 'de',
    //   locales: ['de', 'en'],
    // },
  },
};

module.exports = withPlugins(
  [withBundleAnalyzer, [withOffline, offlineConfig]],
  defaultConfig
);
