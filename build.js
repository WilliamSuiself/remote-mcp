import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保目标目录存在
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 获取所有指定目录下的 .js 文件
function copyJSFiles(srcDir, destDir) {
  // 确保源目录存在
  if (!fs.existsSync(srcDir)) {
    console.error(`错误: 源目录 ${srcDir} 不存在!`);
    process.exit(1);
  }

  // 确保目标目录存在
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  console.log(`复制文件从 ${srcDir} 到 ${destDir}`);
  
  try {
    const files = fs.readdirSync(srcDir);
    let jsCount = 0;
    
    for (const file of files) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);
      
      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) {
        // 递归复制子目录
        copyJSFiles(srcPath, destPath);
      } else if (file.endsWith('.js')) {
        // 复制 JS 文件
        fs.copyFileSync(srcPath, destPath);
        jsCount++;
      }
    }
    
    console.log(`在 ${srcDir} 中找到并复制了 ${jsCount} 个JS文件`);
  } catch (err) {
    console.error(`复制文件时出错: ${err.message}`);
    process.exit(1);
  }
}

// 复制编译后的 JS 文件到 dist 目录
// 注意：我们从dist目录复制到dist目录，因为TypeScript已经将文件编译到dist目录
const compiledDir = path.join(__dirname, 'dist');

// 确保编译后的目录存在
if (!fs.existsSync(compiledDir)) {
  console.error(`错误: 编译后的目录 ${compiledDir} 不存在!`);
  console.error('请确保先运行 tsc 命令编译TypeScript文件');
  process.exit(1);
}

// 确保编译后的index.js文件存在
const indexJsPath = path.join(compiledDir, 'index.js');
if (!fs.existsSync(indexJsPath)) {
  console.error(`错误: 入口文件 ${indexJsPath} 不存在!`);
  console.error('请确保TypeScript编译生成了index.js文件');
  process.exit(1);
}

// 复制其他必要的文件到dist目录
const filesToCopy = ['package.json', 'wrangler.toml'];
filesToCopy.forEach(file => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`已复制 ${file} 到 dist 目录`);
  } else {
    console.warn(`警告: ${file} 文件不存在，已跳过`);
  }
});

console.log('构建完成!');