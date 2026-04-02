import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/oauth/linkedin/callback`;

  if (!code) {
    return NextResponse.redirect(`${appUrl}/settings?error=linkedin_auth_cancelled`);
  }

  try {
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId!,
        client_secret: clientSecret!,
      }),
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in || 5184000;

    const profileRes = await fetch('https://api.linkedin.com/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await profileRes.json();
    const personUrn = `urn:li:person:${profile.id}`;
    const displayName = `${profile.localizedFirstName} ${profile.localizedLastName}`;

    const tokenPayload = {
      linkedin: {
        accessToken,
        personUrn,
        displayName,
        connectedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      },
    };

    const encoded = encodeURIComponent(JSON.stringify(tokenPayload));
    return NextResponse.redirect(
      `${appUrl}/settings?platform=linkedin&tokens=${encoded}`
    );
  } catch (err: any) {
    console.error('LinkedIn OAuth error:', err);
    return NextResponse.redirect(`${appUrl}/settings?error=linkedin_token_failed`);
  }
}
