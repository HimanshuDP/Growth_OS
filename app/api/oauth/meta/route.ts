import { NextResponse } from 'next/server';

export async function GET() {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/meta/callback`;

  if (!appId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=meta_app_not_configured`
    );
  }

  const scopes = [
    'instagram_basic',
    'instagram_content_publish',
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
  ].join(',');

  const authUrl =
    `https://www.facebook.com/v20.0/dialog/oauth?` +
    `client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scopes}` +
    `&response_type=code` +
    `&state=growthOS_meta`;

  return NextResponse.redirect(authUrl);
}
