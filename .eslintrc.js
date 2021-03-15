const {
  createConfig,
  getDependencies,
} = require('eslint-config-galex/src/createConfig');
const {
  createJestOverride,
} = require('eslint-config-galex/src/overrides/jest');

/**
 * override to enable jest globals for `/testUtils` folder
 */
const customJestLikeOverride = createJestOverride({
  ...getDependencies(),
  files: ['testUtils/*.ts?(x)'],
});

/**
 * read more on how to customize this config:
 *
 * @see https://github.com/ljosberinn/eslint-config-galex#i-went-through-30-eslint-plugins-so-you-dont-have-to
 */
module.exports = createConfig({
  overrides: [customJestLikeOverride],
});
