const fs = require('fs');
const path = require('path');

// 确保 dist 目录存在
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// 获取所有 src 目录下的 .js 文件
function copyJSFiles(dir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const srcPath = path.join(dir, file);
    const destPath = path.join(destDir, file);
    
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      // 递归复制子目录
      copyJSFiles(srcPath, destPath);
    } else if (file.endsWith('.js')) {
      // 复制 JS 文件
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 复制所有编译后的 JS 文件
copyJSFiles(path.join(__dirname, 'src'), path.join(__dirname, 'dist'));

// 复制其他必要的文件
const filesToCopy = ['package.json', 'wrangler.toml'];
filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
  }
});