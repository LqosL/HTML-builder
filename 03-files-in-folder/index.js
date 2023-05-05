const fs = require('fs');
const path = require('path');

const route = path.join(__dirname, '.\\secret-folder');

fs.promises.readdir(route, { withFileTypes: true })
  .then (files => files.forEach((element) => {
    if (element.isFile()) {
      const curroute = path.join(__dirname, '.\\secret-folder\\', element['name']);
      let info = '';
      info += (path.parse(curroute))['name'] + ' - ';
      info += (path.parse(curroute))['ext'].slice(1) + ' - ';
      fs.stat(curroute, (err, stats) => {
        if (!err) {
          info += (stats.size / 1024).toString() + 'kB';
        }
        console.log(info);
      });
    }
  })
  );
