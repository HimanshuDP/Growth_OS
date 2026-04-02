import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    });

    if (!response.ok) {
        throw new Error(`Upstream fetch failed with status: ${response.status}`);
    }

    // Stream the body native to edges/node instead of caching to an array buffer
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000', // Cache long-term
      },
    });

  } catch (error: any) {
    console.error('Image proxy error:', error?.message || error);
    // Explicit redirect fallback if internal node streams fail
    return NextResponse.redirect(url, 302);
  }
}
