const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    const destEntries = await fs.readdir(dest);
    for (const entry of destEntries) {
      await fs.rm(path.join(dest, entry), { recursive: true, force: true });
    }
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`Ошибка копирования каталога: ${error.message}`);
  }
}

const sourceFolder = path.join(__dirname, 'files');
const destinationFolder = path.join(__dirname, 'files-copy');

copyDir(sourceFolder, destinationFolder);
