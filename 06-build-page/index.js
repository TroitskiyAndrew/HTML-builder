const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const components = {};
let temlateString = '';


readTemplate();

async function readTemplate() {
  try {
    await fsPromises.rm(path.join(__dirname, 'project-dist'), {recursive: true});
  } catch (err) {
    await fsPromises.mkdir(path.join(__dirname, 'project-dist'), {}, (e) => {});
  }
  try {
    await fsPromises.mkdir(path.join(__dirname, 'project-dist'), {}, (e) => {});
  } catch (err) {
    
  }
  
  const stream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  
  stream.on('data', chunk => temlateString += chunk);
  stream.on('end', () => {
    readComponents();
  });
  stream.on('error', error => console.error(error));
  copyAll(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
  makeBundle();
}

async function readComponents() {
  
  const componentsFiles = await fsPromises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
  let componentsLoading = componentsFiles.map(item => {
    return new Promise((resolve, reject) => {
      if (item.isFile()) {
        const pathToFile = path.join(__dirname, 'components', item.name);
        const extention = path.extname(pathToFile);
        if (extention != '.html')
          resolve()
        const name = path.basename(pathToFile, extention);
        components[name] = { text: '', ready: false };
        const stream = fs.createReadStream(path.join(__dirname, 'components', item.name), 'utf-8');
        stream.on('data', chunk => components[name].text += chunk);
        stream.on('end', () => { resolve()});
        stream.on('error', error => reject());
      }
    });
    
    });
Promise.allSettled(componentsLoading).then(responses => { writeHtml()});
  
}

function writeHtml() {
  let result = temlateString;
  for (let comp in components) {
    result = result.split(`{{${comp}}}`).join(components[comp].text);
  }
  temlateString = result;
  fs.writeFile(path.join(__dirname,'project-dist',  'index.html'), temlateString, (err) => {
    if (err) throw err;
  });
}

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

async function makeBundle() {
  const output = fs.createWriteStream(path.join(__dirname,'project-dist',  'style.css'));
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
          oneFileRead(output,data);
        });
        stream.on('error', error => console.error(error));
      }
      
    }
  } catch (err) {
    console.error(err);
  }
  
}

function oneFileRead(output,data) {
  output.write(data);
}