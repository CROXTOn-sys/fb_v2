#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Updating pnpm lockfile...');

try {
  // Check if pnpm is installed
  try {
    execSync('pnpm --version', { stdio: 'ignore' });
    console.log('✅ pnpm is installed');
  } catch (error) {
    console.log('⚠️ pnpm not found, installing...');
    execSync('npm install -g pnpm', { stdio: 'inherit' });
  }

  // Remove existing lockfile
  const lockfilePath = path.join(__dirname, '..', 'pnpm-lock.yaml');
  if (fs.existsSync(lockfilePath)) {
    fs.unlinkSync(lockfilePath);
    console.log('🗑️ Removed old pnpm-lock.yaml');
  }

  // Install dependencies with pnpm
  console.log('📥 Installing dependencies with pnpm...');
  execSync('pnpm install', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

  console.log('✅ pnpm lockfile updated successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Commit the updated pnpm-lock.yaml file');
  console.log('2. Push to your repository');
  console.log('3. Deploy to Vercel again');

} catch (error) {
  console.error('❌ Error updating pnpm lockfile:', error.message);
  process.exit(1);
}