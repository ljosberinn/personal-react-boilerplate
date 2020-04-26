const nextSourceMaps = require('@zeit/next-source-maps')();
const webpack = require('webpack');

const date = new Date();

console.debug(`> Building on NODE_ENV="${process.env.NODE_ENV}"`);

module.exports = nextSourceMaps({
  env: {
    // api
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_TOKEN: process.env.SENTRY_TOKEN,

    // meta
    BUILD_TIME: date.toString(),
    BUILD_TIMESTAMP: +date,
  },
  webpack: (config, { isServer, buildId }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.SENTRY_RELEASE': JSON.stringify(buildId),
      })
    );

    return config;
  },
});
