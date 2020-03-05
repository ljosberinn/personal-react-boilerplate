const { writeFileSync } = require('fs');
const { renderSync } = require('node-sass');

const isDev = process.env.NODE_ENV !== 'production';
const targetFolder = isDev ? 'public' : 'build';

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
