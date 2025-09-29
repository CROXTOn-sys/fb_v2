// Test script to verify backend server functionality
const axios = require('axios');

async function testBackend() {
  try {
    console.log('Testing backend server...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5003/health');
    console.log('Health check:', healthResponse.data);
    
    // Test fetch endpoint
    const fetchResponse = await axios.post('http://localhost:5003/api/fetch', {
      url: 'https://www.facebook.com/facebook/videos/10154226588036729/',
      desiredType: 'video'
    });
    console.log('Fetch response:', fetchResponse.data);
    
    console.log('Backend tests completed successfully!');
  } catch (error) {
    console.error('Backend test failed:', error.message);
  }
}

testBackend();