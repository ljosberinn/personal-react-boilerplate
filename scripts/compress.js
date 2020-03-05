const { writeFileSync } = require('fs');
const { renderSync } = require('node-sass');

const isProd = !!process.env.NETLIFY;
const targetFolder = isProd ? 'build' : 'public';

const compress = file => {
  writeFileSync(
    [targetFolder, file].join('/'),
    renderSync({
      file: ['public', file].join('/'),
      outputStyle: 'compressed',
    }).css,
  );
};

['app.css', 'root.css'].forEach(compress);
