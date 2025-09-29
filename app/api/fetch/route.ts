import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, desiredType } = body;
    
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Check if it's a Facebook URL
    if (!url.includes('facebook.com')) {
      return NextResponse.json(
        { success: false, error: 'Invalid Facebook URL' },
        { status: 400 }
      );
    }
    
    console.log('Fetching Facebook content:', url);
    console.log('Desired type:', desiredType);
    
    // Proxy the request to the backend server
    const backendUrl = 'http://localhost:5003/api/fetch';
    const response = await axios.post(backendUrl, { url, desiredType }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('Backend response:', response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Fetch API error:', error);
    
    // If backend is not available, return a helpful error
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { success: false, error: 'Backend server is not running. Please start the backend server on port 5003.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch content from backend' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs'; // Use nodejs runtime to support axios