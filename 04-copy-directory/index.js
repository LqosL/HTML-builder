const fs = require('fs');
const path = require('path');

const route = path.join(__dirname, '.\\files');

fs.promises.readdir(path.join(__dirname, '.\\files-copy\\'), {withFileTypes:true})
  .then (files => files.forEach(element => {
    fs.unlink(path.join(__dirname, '.\\files-copy\\', element.name), () => {});
  }),() => {}
  );
fs.rmdir(path.join(__dirname, '.\\files-copy\\'), () => {});
fs.promises.readdir(route, { withFileTypes: true })
  .then (files => files.forEach((element) => {
    if (element.isFile()) {
      const curroute = path.join(__dirname, '.\\files\\', element['name']);
      const copyroute = path.join(__dirname, '.\\files-copy\\');
      const final = path.join(copyroute, element['name']);
      fs.promises.mkdir(copyroute, {recursive: true}, ).then(
        () => {
          const readablestream = fs.createReadStream(curroute, 'utf-8');
          const writablestream = fs.createWriteStream(final, 'utf-8');
          readablestream.on('data', () => {
            writablestream.write('data', 'utf-8');
          });
        }
      );
    }
  })
  );
