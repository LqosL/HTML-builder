const fs = require('fs');
const path = require('path');
const process = require('node:process');

const route = path.join(__dirname, '.\\destination.txt');
const {stdin, stdout} = process;
const stream = fs.createWriteStream(route, 'utf-8');
console.log('Hello! Write down your text \n');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  else {
    stream.write(data, 'utf-8');
  }
});
process.addListener('SIGINT', ()=> {
  process.exit();
});
process.addListener('exit', ()=> {
  console.log('Okay, bye( \n');
});
