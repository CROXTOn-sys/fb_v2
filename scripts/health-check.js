#!/usr/bin/env node

/**
 * Health check script for deployment verification
 */

const fs = require('fs');
const path = require('path');

console.log('🏥 Facebook Downloader Health Check');
console.log('===================================\n');

// Check required files
const requiredFiles = [
  'package.json',
  'pnpm-lock.yaml',
  'vercel.json',
  'next.config.mjs',
  'backend/server.js',
  'backend/package.json',
  'render.yaml'
];

console.log('🔍 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} (MISSING)`);
    allFilesExist = false;
  }
});

console.log('\n');

// Check configuration files
console.log('⚙️  Checking configuration...');

// Check vercel.json
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
  if (vercelConfig.framework === 'nextjs') {
    console.log('✅ vercel.json configured correctly');
  } else {
    console.log('❌ vercel.json framework should be "nextjs"');
  }
} catch (error) {
  console.log('❌ vercel.json is not valid JSON');
}

// Check render.yaml
try {
  const renderConfig = fs.readFileSync(path.join(__dirname, '..', 'render.yaml'), 'utf8');
  if (renderConfig.includes('type: web') && renderConfig.includes('name: facebook-downloader-backend')) {
    console.log('✅ render.yaml configured correctly');
  } else {
    console.log('❌ render.yaml may have issues');
  }
} catch (error) {
  console.log('❌ render.yaml is missing or invalid');
}

console.log('\n');

// Summary
if (allFilesExist) {
  console.log('🎉 All required files are present!');
  console.log('✅ Ready for deployment to Vercel and Render');
} else {
  console.log('⚠️  Some required files are missing');
  console.log('❌ Please check the missing files before deployment');
}

console.log('\n📝 Next steps:');
console.log('1. Run "npm run deploy" for deployment instructions');
console.log('2. Push to GitHub');
console.log('3. Deploy backend to Render first');
console.log('4. Deploy frontend to Vercel');