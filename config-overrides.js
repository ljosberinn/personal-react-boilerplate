const {
  override,
  adjustStyleLoaders,
  addExternalBabelPlugins,
} = require('customize-cra');

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
  }),
  // required because netlify env isn't production ¯\_(ツ)_/¯
  addExternalBabelPlugins('babel-plugin-transform-react-remove-prop-types'),
);
