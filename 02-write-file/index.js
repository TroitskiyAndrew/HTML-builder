const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = process;
const rl = readline.createInterface({ input, output });

const path = require('path');
const output2 = fs.createWriteStream(path.join(__dirname, 'result.txt'));

rl.on('line', (input) => {
  if (input == 'exit') {
    process.exit();
  } else {
    output2.write(input + '\r\n');
  }
});

console.log('Введите текст');

process.on('exit', () => output.write('Заходи, если чё!'));