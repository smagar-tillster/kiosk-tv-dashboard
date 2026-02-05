const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'tv-dashboard-deploy.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Created zip: ${archive.pointer()} total bytes`);
});

archive.on('error', err => { throw err; });

archive.pipe(output);

archive.glob('**/*', {
  ignore: [
    'node_modules/**',
    '.next/**',
    'out/**',
    '.env*',
    'tv-dashboard-deploy.zip',
    'package-lock.json',
    'lambda/node_modules/**',
    'lambda/package-lock.json'
  ]
});

archive.finalize();