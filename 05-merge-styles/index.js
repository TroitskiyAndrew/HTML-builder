const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

async function makeBundle() {
  try {
    const styles = await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    for (const item of styles) {
      if (item.isFile()) {
        let extention = path.extname(path.join(__dirname, 'styles', item.name));
        if (extention != '.css')
          continue;
        const stream = fs.createReadStream(path.join(__dirname, 'styles', item.name), 'utf-8');
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
          oneFileRead(data);
        });
        stream.on('error', error => console.error(error));
      }
      
    }
  } catch (err) {
    console.error(err);
  }
  
}

function oneFileRead(data) {
  output.write(data);
}

makeBundle();