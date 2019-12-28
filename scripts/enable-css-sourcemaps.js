const { writeFileSync, existsSync, readFileSync } = require('fs');

const path = 'node_modules/react-scripts/config/webpack.config.js';

const find = new RegExp(/(sourceMap: isEnvProduction && shouldUseSourceMap)/g);
const replace = 'sourceMap: isEnvDevelopment && shouldUseSourceMap';

if (existsSync(path)) {
  const buffer = readFileSync(path)
    .toString()
    .replace(find, replace);

  try {
    writeFileSync(path, buffer);
    console.log('sourcemaps are now active');
  } catch (e) {
    console.log(`${path} manipulation to enable sourcemaps failed!`);
  }
}
