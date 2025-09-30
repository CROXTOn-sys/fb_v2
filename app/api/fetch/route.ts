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
    
    // ✅ Use only the environment variable for API base URL
    const API_BASE = process.env.NEXT_PUBLIC_API_URL!;
    const backendUrl = `${API_BASE}/api/fetch`;
    
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
        { success: false, error: 'Backend server is not accessible. Please check if the backend is running.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch content from backend' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';