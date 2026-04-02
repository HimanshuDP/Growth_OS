import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!clientId) {
    return NextResponse.redirect(`${appUrl}/settings?error=linkedin_not_configured`);
  }

  const redirectUri = `${appUrl}/api/oauth/linkedin/callback`;
  const scopes = ['w_member_social', 'r_liteprofile', 'r_emailaddress'].join(' ');

  const authUrl =
    `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&state=growthOS_linkedin`;

  return NextResponse.redirect(authUrl);
}
