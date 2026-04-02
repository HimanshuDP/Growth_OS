// ─── Facebook API ─────────────────────────────────────────────────────────────
// Facebook Page video posting via Meta Graph API v20.0

export interface FacebookPostResult {
  success: boolean;
  postId?: string;
  permalink?: string;
  error?: string;
}

export async function postVideoToFacebook(
  pageAccessToken: string,
  pageId: string,
  videoUrl: string,
  caption: string,
  title: string,
  onStatusUpdate?: (status: string) => void
): Promise<FacebookPostResult> {
  try {
    onStatusUpdate?.('Uploading video to Facebook...');

    const response = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}/videos`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_url: videoUrl,
          description: caption,
          title: title,
          published: true,
          access_token: pageAccessToken,
        }),
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(`Facebook posting failed: ${data.error.message}`);

    onStatusUpdate?.('Posted to Facebook!');
    return {
      success: true,
      postId: data.id,
      permalink: `https://www.facebook.com/video/${data.id}`,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
