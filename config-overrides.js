const { override, adjustStyleLoaders } = require('customize-cra');
const { addReactRefresh } = require('customize-cra-react-refresh');

module.exports = override(
  adjustStyleLoaders(({ use: [, css, postcss, resolve, processor] }) => {
    css.options.sourceMap = true; // css-loader
    postcss.options.sourceMap = true; // postcss-loader
    // when enable pre-processor,
    // resolve-url-loader will be enabled too
    if (resolve) {
      resolve.options.sourceMap = true; // resolve-url-loader
    }
    // pre-processor
    if (processor && processor.loader.includes('sass-loader')) {
      processor.options.sourceMap = true; // sass-loader
    }
  }) && addReactRefresh({ disableRefreshCheck: true }),
);
