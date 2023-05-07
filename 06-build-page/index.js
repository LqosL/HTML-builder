const fs = require('fs');
const path = require('path');
const route = __dirname;
const copyroute = path.join(__dirname, '.\\project-dist');

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

async function createhtml (templateFile, source, destination) {
  const htmlWrite = fs.createWriteStream(destination, 'utf-8');
  const files = await fs.promises.readdir(source, {withFileTypes:true});
  const params = {};
  for (const element of files) {
    if(element.name.slice(-4) === 'html') {
      const paramName = element.name.slice(0, -5);
      const paramValue = (await fs.promises.readFile(path.join(source, element.name))).toString();
      params[paramName] = paramValue;
    }
  }

  const template = (await fs.promises.readFile(templateFile)).toString();
  let result = template;
  Object.keys(params).forEach(key => {
    result = result.replaceAll('{{' + key + '}}', params[key]);
  });
  htmlWrite.write(result, 'utf-8');
}

async function mergeHTML() {
  await cleanFolder(path.join(__dirname, '.\\project-dist\\'), );
  await fs.promises.mkdir(path.join(__dirname, '.\\project-dist'), {recursive: true});
  copyDir(path.join(route, '.\\', 'assets'), path.join(copyroute, '.\\', 'assets'));
  mergestyles(path.join(route, '.\\styles'), path.join(__dirname, '.\\project-dist\\style.css'));
  await createhtml(path.join(__dirname, '.\\template.html'), path.join(__dirname, '.\\components'), path.join(copyroute, '.\\index.html'));
}

mergeHTML();

