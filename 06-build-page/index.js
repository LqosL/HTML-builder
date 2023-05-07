const fs = require('fs');
const path = require('path');
const route = __dirname;
const copyroute = path.join(__dirname, '.\\project-dist');
const readline = require('readline');

async function cleanFolder(folder) {
  let files = [];
  try {
    files = await fs.promises.readdir(folder, {withFileTypes:true});
  } catch(e) {
    return;
  }

  for (const element of files) {
    if (element.isFile()){
      await fs.promises.unlink(path.join(folder, element.name));
    }
    if (element.isDirectory()) {
      await cleanFolder(path.join(folder, element.name));
    }
  }

  await fs.promises.rmdir(folder);
}

const copyDir = (dir, copydir) => {
  fs.mkdir(path.join(copydir), {recursive:true}, ()=> {
    fs.promises.readdir(path.join(dir), {withFileTypes: true})
      .then (files => files.forEach(element => {
        if(element.isDirectory()) {
          copyDir(path.join(dir, '.\\', element.name), path.join(copydir, '.\\', element.name));
        }
        if(element.isFile()){
          fs.promises.copyFile(path.join(dir, '.\\', element.name), path.join(copydir, '.\\', element.name));
        }
      }));
  });
};

const mergestyles = (sourceroute, result) => {
  const style = [];
  const styleswritable = fs.createWriteStream(result, 'utf-8');
  fs.promises.readdir(sourceroute, {withFileTypes: true})
    .then (files => files.forEach(element => {
      const curroute = path.join(sourceroute, '\\', element['name']);
      if (element['name'].slice(-3) === 'css') {
        const readable = fs.createReadStream(curroute, 'utf-8');
        readable.on('data', data => {
          style.push(data);
        });
        readable.on('end', () => {
          styleswritable.write(style.flat().join('\n'), 'utf-8');
        });
      }
    }));
};

const createhtml = (template, source, destination) => {
  const templateRead = fs.createReadStream(template, 'utf-8');
  const htmlWrite = fs.createWriteStream(destination, 'utf-8');

  const rl = readline.createInterface({input: templateRead});
  rl.on('line', (line) => {
    if (line.trim().slice(0,2) === '{{'){
      line.split(' ').forEach(tagname=>{
        if (tagname.length > 4) {
          const filename = tagname.trim().slice(2, -2) + '.html';
          const copyHTML = fs.createReadStream(path.join(source, '.\\', filename));
          copyHTML.on('data', (data) => {
            htmlWrite.write(data, 'utf-8');
          });
        }
      });
    }else{
      htmlWrite.write(line, 'utf-8');
      htmlWrite.write('\r\n');
    }
  });
};

async function mergeHTML() {
  await cleanFolder(path.join(__dirname, '.\\project-dist\\'), );
  await fs.promises.mkdir(path.join(__dirname, '.\\project-dist'), {recursive: true});
  copyDir(path.join(route, '.\\', 'assets'), path.join(copyroute, '.\\', 'assets'));
  mergestyles(path.join(route, '.\\styles'), path.join(__dirname, '.\\project-dist\\style.css'));
  createhtml(path.join(__dirname, '.\\template.html'), path.join(__dirname, '.\\components'), path.join(copyroute, '.\\index.html'));
}

mergeHTML();

