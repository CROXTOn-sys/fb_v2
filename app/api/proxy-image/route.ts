import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'URL parameter is required' },
        { status: 400 }
      );
    }
    
    // Use environment variable for backend URL, fallback to localhost in development
    const backendBaseUrl = process.env.RENDER_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5003';
    const backendUrl = `${backendBaseUrl}/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    
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
export const dynamic = 'force-dynamic';