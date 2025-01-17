const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log('Добро пожаловать! Введите текст для записи в файл. Для выхода введите "exit" или нажмите Ctrl + C.');

rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'exit') {
        console.log('Спасибо за использование программы. До свидания!');
        rl.close();
    } else {
        writeStream.write(input + '\n');
    }
});

rl.on('SIGINT', () => {
    console.log('Спасибо за использование программы. До свидания!');
    rl.close();
});

rl.on('close', () => {
    writeStream.end();
    process.exit(0);
});
