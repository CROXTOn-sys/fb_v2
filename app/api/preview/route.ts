import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;
    
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Proxy the request to the backend server
    const backendUrl = 'http://localhost:5003/api/preview';
    const response = await axios.post(backendUrl, { url }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Preview API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate preview from backend' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs'; // Use nodejs runtime to support axios
