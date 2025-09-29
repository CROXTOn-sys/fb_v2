import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL parameter is required' },
        { status: 400 }
      );
    }
    
    // Redirect to the backend server for image proxy
    const backendUrl = `http://localhost:5003/api/proxy-image?url=${encodeURIComponent(url)}`;
    
    // Return a redirect response
    return NextResponse.redirect(backendUrl);
  } catch (error: any) {
    console.error('Image proxy error:', error?.message || error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to proxy image request to backend' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
