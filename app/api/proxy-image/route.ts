import { NextRequest, NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Bypass local TLS validation

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Referer': 'https://google.com/'
      },
      // Important to fetch without caching so we don't hold bad streams
      cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Upstream fetch failed with status: ${response.status}`);
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error: any) {
    console.error('Image proxy error:', error?.message || error);
    return NextResponse.json({ 
      error: error?.message || "Unknown error proxying",
      url: url,
      stack: error?.stack 
    }, { status: 500 });
  }
}
