const fs = require('fs');
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(projectDistPath, 'assets');

fs.promises.mkdir(projectDistPath, { recursive: true })
  .then(() => generateHTML())
  .then(() => compileStyles())
  .then(() => copyAssets(assetsPath, distAssetsPath))
  .catch(err => console.error('Error:', err));

async function generateHTML() {
  try {
    const template = await fs.promises.readFile(templatePath, 'utf-8');
    const tags = template.match(/{{\w+}}/g) || [];
    let resultHTML = template;

    for (const tag of tags) {
      const componentName = tag.slice(2, -2);
      const componentPath = path.join(componentsPath, `${componentName}.html`);

      try {
        const componentContent = await fs.promises.readFile(componentPath, 'utf-8');
        resultHTML = resultHTML.replace(new RegExp(tag, 'g'), componentContent);
      } catch {
        console.error(`Компонент ${componentName}.html не найден.`);
      }
    }

    await fs.promises.writeFile(path.join(projectDistPath, 'index.html'), resultHTML);
  } catch (err) {
    console.error('Ошибка при создании HTML:', err);
  }
}

async function compileStyles() {
  try {
    const files = await fs.promises.readdir(stylesPath, { withFileTypes: true });
    const cssFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.css');

    let styles = '';
    for (const file of cssFiles) {
      const filePath = path.join(stylesPath, file.name);
      const content = await fs.promises.readFile(filePath, 'utf-8');
      styles += content + '\n';
    }

    await fs.promises.writeFile(path.join(projectDistPath, 'style.css'), styles);
  } catch (err) {
    console.error('Ошибка компиляции стилей:', err);
  }
}

async function copyAssets(src, dest) {
  try {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error('Ошибка копирования:', err);
  }
}