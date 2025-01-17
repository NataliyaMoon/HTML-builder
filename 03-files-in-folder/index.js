const fs = require('fs/promises');
const path = require('path');

(async () => {
    try {
        const folderPath = path.join(__dirname, 'secret-folder');
        const files = await fs.readdir(folderPath, { withFileTypes: true });

        for (const file of files) {
            if (file.isFile()) {
                const filePath = path.join(folderPath, file.name);
                const stats = await fs.stat(filePath);
                const fileName = path.parse(file.name).name;
                const fileExt = path.parse(file.name).ext.slice(1);
                const fileSize = stats.size / 1024;

                console.log(`${fileName} - ${fileExt} - ${fileSize.toFixed(3)}kb`);
            }
        }
    } catch (err) {
        console.error('Ошибка при чтении папки:', err.message);
    }
})();
