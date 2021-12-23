// @ts-check
const { writeFileSync, readFileSync } = require('fs');
const { resolve } = require('path');

const reactPackageJsonPath = resolve('node_modules/react/package.json');
const contents = JSON.parse(
  readFileSync(reactPackageJsonPath, { encoding: 'utf-8' })
);

if (!contents.exports['./package.json']) {
  console.log('monkey patching react package.json');
  writeFileSync(
    reactPackageJsonPath,
    JSON.stringify({
      ...contents,
      exports: { ...contents.exports, './package.json': './package.json' },
    })
  );
}
