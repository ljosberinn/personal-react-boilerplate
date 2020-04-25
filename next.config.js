const nextSourceMaps = require('@zeit/next-source-maps')();
const webpack = require('webpack');

const date = new Date();

console.debug(`> Building on NODE_ENV="${process.env.NODE_ENV}"`);

module.exports = nextSourceMaps({
  experimental: {
    modern: true,
    polyfillsOptimization: true,
  },

  env: {
    // core
    ENABLED_LANGUAGES: process.env.NEXT_PUBLIC_ENABLED_LANGUAGES,
    ENABLED_PROVIDER: process.env.NEXT_PUBLIC_ENABLED_PROVIDER,

    // sentry
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    SENTRY_TOKEN: process.env.NEXT_PUBLIC_SENTRY_TOKEN,

    // meta
    BUILD_TIME: date.toString(),
    BUILD_TIMESTAMP: +date,
  },
  webpack: (config, { dev, isServer, buildId }) => {
    const splitChunks = config.optimization && config.optimization.splitChunks;
    if (splitChunks) {
      const cacheGroups = splitChunks.cacheGroups;
      const preactModules = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;
      if (cacheGroups.framework) {
        cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
          test: preactModules,
        });
        cacheGroups.commons.name = 'framework';
      } else {
        cacheGroups.preact = {
          name: 'commons',
          chunks: 'all',
          test: preactModules,
        };
      }
    }

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_SENTRY_RELEASE': JSON.stringify(buildId),
      })
    );

    const aliases = config.resolve.alias || (config.resolve.alias = {});
    aliases.react = aliases['react-dom'] = 'preact/compat';

    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser';

      // inject Preact DevTools
      if (dev) {
        const entry = config.entry;
        config.entry = () =>
          entry().then(entries => {
            entries['main.js'] = ['preact/debug'].concat(
              entries['main.js'] || []
            );
            return entries;
          });
      }
    }

    return config;
  },
});
