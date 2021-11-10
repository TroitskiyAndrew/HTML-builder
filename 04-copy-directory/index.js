const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

async function copyAll(pathRead,pathWrite) {
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
async function start() {
  try {
    await fsPromises.rm(path.join(__dirname, 'files-copy'), {recursive: true});
  } catch (err) {
    await fsPromises.mkdir(path.join(__dirname, 'files-copy'), {}, (e) => {});
  }
  try {
    await fsPromises.mkdir(path.join(__dirname, 'files-copy'), {}, (e) => {});
  } catch (err) {
    
  }
  copyAll(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
}

start();
