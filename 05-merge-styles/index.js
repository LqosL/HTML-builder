const fs = require('fs');
const path = require('path');

const route = path.join(__dirname, '.\\styles');
const destinationroute = path.join(__dirname, '.\\project-dist\\bundle.css');
const writable = fs.createWriteStream(destinationroute, 'utf-8');
const style = [];
fs.unlink(destinationroute, ()=> {
  fs.promises.readdir(route, {withFileTypes: true})
    .then (files => files.forEach(element => {
      const curroute = path.join(route, '.\\', element['name']);
      if (element['name'].slice(-3) === 'css') {
        const readable = fs.createReadStream(curroute, 'utf-8');
        readable.on('data', data => {
          style.push(data);
        });
        readable.on('end', () => {
          writable.write(style.flat().join('\n'), 'utf-8');
        });
      }
    }));
});




