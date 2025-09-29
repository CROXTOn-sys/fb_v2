#!/usr/bin/env node

/**
 * Deployment helper script
 * This script provides guidance for deploying to Vercel and Render
 */

console.log('🚀 Facebook Downloader Deployment Helper');
console.log('========================================\n');

console.log('📋 Deployment Steps:');
console.log('1. Ensure all changes are committed and pushed to GitHub');
console.log('2. Deploy backend to Render:');
console.log('   - Go to https://dashboard.render.com/');
console.log('   - Create a new Web Service');
console.log('   - Connect your GitHub repository');
console.log('   - Set Build Command: cd backend && npm install');
console.log('   - Set Start Command: cd backend && node server.js');
console.log('   - Add Environment Variables:');
console.log('     * NODE_ENV=production');
console.log('     * PORT=10000\n');

console.log('3. After backend deployment, note the Render URL');
console.log('4. Deploy frontend to Vercel:');
console.log('   - Go to https://vercel.com/dashboard');
console.log('   - Create a new project from your GitHub repository');
console.log('   - Add Environment Variables:');
console.log('     * NODE_ENV=production');
console.log('     * RENDER_BACKEND_URL=<your-render-url>\n');

console.log('5. Wait for both deployments to complete');
console.log('6. Test the application at your Vercel URL\n');

console.log('📝 Notes:');
console.log('- The backend must be deployed before the frontend');
console.log('- Ensure RENDER_BACKEND_URL in Vercel matches your Render deployment');
console.log('- Check both dashboards for build logs and errors');
console.log('- For detailed instructions, see DEPLOYMENT_GUIDE.md\n');

console.log('✅ Deployment ready! Push your code to GitHub and follow the steps above.');