const fs = require('fs').promises;
const path = require('path');

async function buildCSSBundle() {
  try {
    const stylesFolder = path.join(__dirname, 'styles');
    const outputFolder = path.join(__dirname, 'project-dist');
    const outputFile = path.join(outputFolder, 'bundle.css');

    await fs.mkdir(outputFolder, { recursive: true });

    const files = await fs.readdir(stylesFolder, { withFileTypes: true });
    const cssContents = [];

    for (const file of files) {
      const filePath = path.join(stylesFolder, file.name);
      if (file.isFile() && path.extname(file.name) === '.css') {
        const content = await fs.readFile(filePath, 'utf-8');
        cssContents.push(content);
      }
    }

    await fs.writeFile(outputFile, cssContents.join('\n'));
  } catch (error) {
    console.error(`Ошибка при создании пакета CSS: ${error.message}`);
  }
}

buildCSSBundle();
