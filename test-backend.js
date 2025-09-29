const axios = require('axios');

// Test script for Facebook Downloader Backend
async function testBackend() {
  const baseUrl = 'http://localhost:5003';
  
  console.log('🧪 Testing Facebook Downloader Backend...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${baseUrl}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test 2: Preview API
    console.log('\n2️⃣ Testing preview API...');
    const previewResponse = await axios.post(`${baseUrl}/api/preview`, {
      url: 'https://www.facebook.com/share/v/123456789/'
    });
    console.log('✅ Preview API working:', previewResponse.data.success);
    
    // Test 3: Fetch API (with mock URL)
    console.log('\n3️⃣ Testing fetch API...');
    try {
      const fetchResponse = await axios.post(`${baseUrl}/api/fetch`, {
        url: 'https://www.facebook.com/share/v/123456789/',
        desiredType: 'video'
      });
      console.log('✅ Fetch API working:', fetchResponse.data.success);
    } catch (error) {
      console.log('⚠️ Fetch API test failed (expected for mock URL):', error.response?.data?.error || error.message);
    }
    
    console.log('\n🎉 Backend tests completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the frontend: npm run dev');
    console.log('2. Open http://localhost:3000');
    console.log('3. Test with real Facebook URLs');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running: cd backend && npm start');
    console.log('2. Check if port 5003 is available');
    console.log('3. Install dependencies: cd backend && npm install');
  }
}

// Run tests
testBackend();

