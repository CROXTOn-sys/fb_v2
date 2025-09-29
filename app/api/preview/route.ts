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
    
    // Use environment variable for backend URL, fallback to localhost in development
    const backendBaseUrl = process.env.RENDER_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5003';
    const backendUrl = `${backendBaseUrl}/api/preview`;
    
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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';