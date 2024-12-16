const fs = require('fs');
const path = require('path');

// Source and destination directories
const sourceDir = path.resolve(__dirname, '../node_modules/monaco-editor/esm/vs/base/worker');
const destDir = path.resolve(__dirname, '../public/monaco-editor-workers');

// Check if the source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory does not exist: ${sourceDir}`);
  process.exit(1); // Exit the script if the directory doesn't exist
}

// Create the destination directory if it doesn't exist
fs.mkdirSync(destDir, { recursive: true });

// Copy all `.js` files from source to destination
fs.readdirSync(sourceDir).forEach((file) => {
  if (file.endsWith('.js')) {
    fs.copyFileSync(path.join(sourceDir, file), path.join(destDir, file));
    console.log(`Copied: ${file}`);
  }
});

console.log('Monaco editor workers copied successfully.');
