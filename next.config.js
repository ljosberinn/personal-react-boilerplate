const nextSourceMaps = require('@zeit/next-source-maps')();
const webpack = require('webpack');

const date = new Date();

console.debug(`> Building on NODE_ENV="${process.env.NODE_ENV}"`);

module.exports = nextSourceMaps({
  env: {
    // core
    ENABLED_LANGUAGES: process.env.NEXT_PUBLIC_ENABLED_LANGUAGES,

    // sentry
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    SENTRY_TOKEN: process.env.NEXT_PUBLIC_SENTRY_TOKEN,

    // meta
    BUILD_TIME: date.toString(),
    BUILD_TIMESTAMP: +date,
  },
  webpack: (config, { isServer, buildId }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_SENTRY_RELEASE': JSON.stringify(buildId),
      })
    );

    return config;
  },
});
