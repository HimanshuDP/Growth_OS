import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/oauth/youtube/callback`;

  if (!code) {
    return NextResponse.redirect(`${appUrl}/settings?error=youtube_auth_cancelled`);
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('No access token returned');

    const channelRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    const channelData = await channelRes.json();
    const channel = channelData.items?.[0];

    const tokenPayload = {
      youtube: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        channelId: channel?.id || '',
        channelName: channel?.snippet?.title || 'My Channel',
        connectedAt: new Date().toISOString(),
      },
    };

    const encoded = encodeURIComponent(JSON.stringify(tokenPayload));
    return NextResponse.redirect(
      `${appUrl}/settings?platform=youtube&tokens=${encoded}`
    );
  } catch (err: any) {
    console.error('YouTube OAuth error:', err);
    return NextResponse.redirect(`${appUrl}/settings?error=youtube_token_failed`);
  }
}
