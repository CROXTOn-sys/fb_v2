import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const fileUrl = url.searchParams.get('url');
    const filename = url.searchParams.get('filename') || 'facebook-media';
    
    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: 'URL parameter is required' },
        { status: 400 }
      );
    }
    
    console.log('Downloading file:', fileUrl);
    console.log('Filename:', filename);
    
    // ✅ Replace any hardcoded localhost calls with a dynamic BASE_URL
    const BASE_URL = process.env.BASE_URL || "http://localhost:5003";
    const backendUrl = `${BASE_URL}/api/download?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(filename)}`;

    const response = await axios.get(backendUrl, {
      responseType: 'stream',
      timeout: 60000,
    });

    console.log('Download response status:', response.status);

    // Resolve headers
    const contentType = response.headers['content-type'] || (fileUrl.includes('.mp4') ? 'video/mp4' : 'application/octet-stream');
    const contentLength = response.headers['content-length'];
    const disposition = response.headers['content-disposition'] || `attachment; filename="${filename}"`;

    // Create a web ReadableStream from Node stream
    const nodeStream = response.data as NodeJS.ReadableStream;
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk: Buffer) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err: Error) => controller.error(err));
      }
    });

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Content-Disposition': disposition,
      'Cache-Control': 'no-cache'
    };
    if (contentLength) headers['Content-Length'] = contentLength;

    return new NextResponse(webStream as any, { headers });
  } catch (error: any) {
    console.error('Download error:', error?.message || error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to download file' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';