#!/usr/bin/env node

/**
 * Simple API test script to verify routes are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 API Route Configuration Test');
console.log('==============================\n');

// Test API routes for proper configuration
const apiRoutes = [
  'app/api/download/route.ts',
  'app/api/fetch/route.ts',
  'app/api/preview/route.ts',
  'app/api/proxy-image/route.ts'
];

let allRoutesValid = true;

apiRoutes.forEach(route => {
  const routePath = path.join(__dirname, '..', route);
  if (fs.existsSync(routePath)) {
    const routeContent = fs.readFileSync(routePath, 'utf8');
    
    console.log(`🔍 Checking ${route}...`);
    
    // Check for dynamic rendering configuration
    if (routeContent.includes('dynamic = \'force-dynamic\'')) {
      console.log('  ✅ Dynamic rendering configured');
    } else {
      console.log('  ❌ Missing dynamic rendering configuration');
      allRoutesValid = false;
    }
    
    // Check for environment variable usage
    if (routeContent.includes('RENDER_BACKEND_URL') || routeContent.includes('BACKEND_URL')) {
      console.log('  ✅ Environment variable usage configured');
    } else {
      console.log('  ⚠️  No environment variable usage detected');
    }
    
    // Check for proper URL handling
    if (routeContent.includes('new URL(request.url)') || routeContent.includes('request.url')) {
      console.log('  ✅ URL handling configured');
    } else {
      console.log('  ⚠️  URL handling may need review');
    }
    
    console.log('');
  } else {
    console.log(`❌ ${route} not found\n`);
    allRoutesValid = false;
  }
});

// Summary
if (allRoutesValid) {
  console.log('🎉 All API routes are properly configured!');
  console.log('✅ Ready for deployment');
} else {
  console.log('⚠️  Some API routes need attention');
  console.log('❌ Please review the configuration');
}

console.log('\n📝 Notes:');
console.log('- API routes now use "dynamic = \'force-dynamic\'" to prevent static rendering issues');
console.log('- Backend URLs are configured with environment variables for flexibility');
console.log('- URL parsing is handled properly to avoid dynamic server usage errors');