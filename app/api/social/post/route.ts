import { NextRequest, NextResponse } from 'next/server';
import { postToInstagram } from '@/lib/social/instagramApi';
import { postVideoToFacebook } from '@/lib/social/facebookApi';
import { postVideoToLinkedIn } from '@/lib/social/linkedinApi';
import { uploadVideoToYouTube } from '@/lib/social/youtubeApi';

export interface PostResult {
  platform: string;
  success: boolean;
  permalink?: string;
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      platforms,
      videoPublicUrl,
      videoBlobBase64,
      videoBlobType,
      caption,
      hashtags = [],
      title,
      youtubePrivacy = 'public',
      tokens,
    } = body;

    const fullCaption = hashtags.length
      ? `${caption}\n\n${hashtags.map((h: string) => `#${h.replace(/^#/, '')}`).join(' ')}`
      : caption;

    // Reconstruct blob from base64 (sent from browser for LinkedIn/YouTube direct upload)
    let videoBlob: Blob | null = null;
    if (videoBlobBase64 && videoBlobType) {
      const bytes = Buffer.from(videoBlobBase64, 'base64');
      videoBlob = new Blob([bytes], { type: videoBlobType });
    }

    const results: PostResult[] = [];

    const tasks = platforms.map(async (platform: string) => {
      try {
        if (platform === 'instagram' && tokens.instagram) {
          const result = await postToInstagram(
            tokens.instagram.accessToken,
            tokens.instagram.userId,
            videoPublicUrl,
            fullCaption,
            'REELS'
          );
          results.push({ platform: 'instagram', ...result });
        }

        if (platform === 'facebook' && tokens.facebook) {
          const result = await postVideoToFacebook(
            tokens.facebook.accessToken,
            tokens.facebook.pageId,
            videoPublicUrl,
            fullCaption,
            title || 'GrowthOS Post'
          );
          results.push({ platform: 'facebook', ...result });
        }

        if (platform === 'linkedin' && tokens.linkedin && videoBlob) {
          const result = await postVideoToLinkedIn(
            tokens.linkedin.accessToken,
            tokens.linkedin.personUrn,
            videoPublicUrl,
            videoBlob,
            fullCaption
          );
          results.push({ platform: 'linkedin', ...result });
        }

        if (platform === 'youtube' && tokens.youtube && videoBlob) {
          const result = await uploadVideoToYouTube(
            tokens.youtube.accessToken,
            videoBlob,
            {
              title: title || 'GrowthOS Video',
              description: fullCaption,
              tags: hashtags,
              privacyStatus: youtubePrivacy,
            }
          );
          results.push({ platform: 'youtube', ...result });
        }
      } catch (err: any) {
        results.push({
          platform,
          success: false,
          error: err.message,
        });
      }
    });

    await Promise.allSettled(tasks);

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error('Social post API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
