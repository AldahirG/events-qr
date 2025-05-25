const fs = require('fs');
const path = require('path');

// Nuevo mapeo de imports según QrAppClean
const importReplacements = {
  "../config": "../utils/config",
  "../utils/storage": "../utils/storage",
  "../theme/colors": "../theme/colors",
  "../components/Loader": "../components/ui/Loader",
  "../components/CustomButton": "../components/ui/CustomButton",
  "../components/EmptyState": "../components/ui/EmptyState",
  "../components/EventoCard": "../components/ui/EventoCard",
  "../components/ScannerOverlay": "../components/ui/ScannerOverlay",
  "../components/ReportTable": "../components/ui/ReportTable",
  "../components/ConfirmDialog": "../components/ui/ConfirmDialog",
  "../components/styles/sharedStyles": "../components/styles/sharedStyles"
};

// Directorios donde se aplicará el reemplazo
const targetDirs = [
  path.join(__dirname, '../app/screens'),
  path.join(__dirname, '../components'),
  path.join(__dirname, '../app/(tabs)')
];

const fileExts = ['.js', '.jsx', '.ts', '.tsx'];

function replaceImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = content;

  for (const [oldPath, newPath] of Object.entries(importReplacements)) {
    const regex = new RegExp(`from ['"]${oldPath}['"]`, 'g');
    updated = updated.replace(regex, `from '${newPath}'`);
  }

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Import actualizado en: ${filePath}`);
  }
}

function scanDir(dirPath) {
  fs.readdirSync(dirPath).forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (fileExts.includes(path.extname(file))) {
      replaceImportsInFile(fullPath);
    }
  });
}

// Ejecutar en directorios seleccionados
targetDirs.forEach(scanDir);
