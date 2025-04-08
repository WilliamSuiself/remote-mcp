import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 清理旧的dist目录并重新编译
console.log('🔄 清理旧的dist目录...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist', { recursive: true });

// 运行TypeScript编译
console.log('🔄 执行TypeScript编译...');
try {
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('✅ TypeScript编译成功');
} catch (error) {
  console.error('❌ TypeScript编译失败:', error);
  process.exit(1);
}

// 检查编译后的index.js是否存在
const indexPath = path.join(__dirname, 'dist', 'index.js');
if (!fs.existsSync(indexPath)) {
  console.error('❌ 错误: 编译后的dist/index.js文件不存在!');
  process.exit(1);
}

// 复制其他必要的文件
console.log('🔄 复制配置文件...');
const filesToCopy = ['package.json', 'wrangler.jsonc'];
filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
    console.log(`✅ 已复制: ${file} -> dist/${file}`);
  }
});

console.log('✅ 构建完成');