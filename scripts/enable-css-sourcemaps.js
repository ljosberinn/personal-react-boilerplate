const { writeFileSync, existsSync, readFileSync } = require('fs');

const path = 'node_modules/react-scripts/config/webpack.config.js';

const find = /(sourceMap: isEnvProduction && shouldUseSourceMap)/g;
const replace = 'sourceMap: isEnvDevelopment && shouldUseSourceMap';

if (existsSync(path)) {
  const buffer = readFileSync(path)
    .toString()
    .replace(find, replace);

  try {
    writeFileSync(path, buffer);
    console.info('enable-css-sourcemaps: active');
  } catch (e) {
    console.error(`enable-css-sourcemaps: ${path} manipulation failed!`);
  }
} else {
  console.warn(`enable-css-sourcemaps: ${path} does not exist`);
}
