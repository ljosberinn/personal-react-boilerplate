const DotEnv = require('dotenv-webpack');

module.exports = {
  mode: process.env.NODE_ENV,
  plugins: [new DotEnv()],
  optimization: {
    minimize: process.env.NODE_ENV === 'production' || !!process.env.NETLIFY,
  },
};
