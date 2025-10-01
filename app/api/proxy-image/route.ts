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
    
    // ✅ Use only the environment variable for API base URL and remove trailing slash
    const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, "");
    const backendUrl = `${API_BASE}/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    
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