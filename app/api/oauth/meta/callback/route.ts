import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const appId = process.env.NEXT_PUBLIC_META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const redirectUri = `${appUrl}/api/oauth/meta/callback`;

  if (!code) {
    return NextResponse.redirect(`${appUrl}/settings?error=meta_auth_cancelled`);
  }

  try {
    // Step 1: Short-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v20.0/oauth/access_token` +
        `?client_id=${appId}` +
        `&client_secret=${appSecret}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&code=${code}`
    );
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('No access token returned');

    // Step 2: Long-lived token (60 days)
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v20.0/oauth/access_token` +
        `?grant_type=fb_exchange_token` +
        `&client_id=${appId}` +
        `&client_secret=${appSecret}` +
        `&fb_exchange_token=${tokenData.access_token}`
    );
    const longTokenData = await longTokenRes.json();
    const longLivedToken = longTokenData.access_token;
    const expiresIn = longTokenData.expires_in || 5184000;

    // Step 3: Get Facebook Pages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v20.0/me/accounts?access_token=${longLivedToken}`
    );
    const pagesData = await pagesRes.json();
    const page = pagesData.data?.[0];

    // Step 4: Get Instagram Business Account
    let igUserId = '';
    let igUsername = '';
    if (page) {
      const igRes = await fetch(
        `https://graph.facebook.com/v20.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
      );
      const igData = await igRes.json();
      igUserId = igData.instagram_business_account?.id || '';

      if (igUserId) {
        const igProfileRes = await fetch(
          `https://graph.facebook.com/v20.0/${igUserId}?fields=username,profile_picture_url&access_token=${longLivedToken}`
        );
        const igProfile = await igProfileRes.json();
        igUsername = igProfile.username || '';
      }
    }

    const tokenPayload: Record<string, any> = {};

    if (igUserId) {
      tokenPayload.instagram = {
        accessToken: longLivedToken,
        userId: igUserId,
        username: igUsername,
        connectedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      };
    }

    if (page) {
      tokenPayload.facebook = {
        accessToken: page.access_token,
        pageId: page.id,
        pageName: page.name,
        connectedAt: new Date().toISOString(),
      };
    }

    const encoded = encodeURIComponent(JSON.stringify(tokenPayload));
    return NextResponse.redirect(
      `${appUrl}/settings?platform=meta&tokens=${encoded}`
    );
  } catch (err: any) {
    console.error('Meta OAuth callback error:', err);
    return NextResponse.redirect(
      `${appUrl}/settings?error=meta_token_exchange_failed`
    );
  }
}
