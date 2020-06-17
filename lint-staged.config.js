module.exports = {
  '*.{js,tsx,ts,tsx,css,scss}': 'eslint --fix',
  'src/**/*.{js,jsx,ts,tsx,json,css,scss,md}': 'prettier --write',
  '*.{ts,tsx}':
    'eslint --fix --plugin tsc --rule \'tsc/config: [2, {configFile: "./tsconfig.json"}]\'',
};
