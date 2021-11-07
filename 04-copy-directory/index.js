const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

async function copyAll(pathRead,pathWrite) {
  fs.mkdir(pathWrite, { recursive: true },(err) => {
    if (err) throw err;
  });
  try {
    const content = await fsPromises.readdir(pathRead, {withFileTypes: true});
    for (const item of content) {
      if (item.isFile()) {
        fs.copyFile(path.join(pathRead, item.name), path.join(pathWrite, item.name), (err) => {
          if (err) throw err;
        });
      } else {
        copyAll(path.join(pathRead, item.name),path.join(pathWrite, item.name));
      }
      
    }
  } catch (err) {
    console.error(err);
  }
  
}
fs.rmdir(path.join(__dirname, 'files-copy'), {recursive: true}, (err) => {
  if (err) throw err;
});
setTimeout(start, 500);
function start() {
  copyAll(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
}
