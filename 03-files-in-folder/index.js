const fs  = require('fs/promises');
const path = require('path');
const fs2  = require('fs');

async function getIngo() {
  try {
    const files = await fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        let fileName = path.join(__dirname, 'secret-folder', file.name);
        fs2.stat(fileName, (err, stats) => {
          let extention = path.extname(fileName);
          console.log(path.basename(fileName,extention) + " - " + extention.slice(1) + " - " +  stats.size/1024 + ' kb');
        });
        
      }
      
    }
  } catch (err) {
    console.error(err);
  }
  
}
getIngo();