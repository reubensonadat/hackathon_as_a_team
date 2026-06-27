import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedCount = 0;

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Replace hardcoded primary color
    if (content.includes('#46c300')) {
      content = content.replace(/#46c300/g, '#005c4b');
      changed = true;
    }
    
    // Replace hardcoded hover primary color
    if (content.includes('#3ea900')) {
      content = content.replace(/#3ea900/g, '#004a3c');
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated ' + filePath);
      modifiedCount++;
    }
  }
});

console.log(`Finished updating themes. Modified ${modifiedCount} files.`);
