const DotEnv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  plugins: [new DotEnv()],
};
