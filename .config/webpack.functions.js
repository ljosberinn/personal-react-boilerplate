const nodeExternals = require('webpack-node-externals');

// https://github.com/netlify/netlify-lambda/issues/112
module.exports = {
  externals: [nodeExternals()],
  mode: 'development',
};
