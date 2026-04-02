// ─── Instagram API ────────────────────────────────────────────────────────────
// Instagram Reels + Feed publishing via Meta Graph API v20.0

const GRAPH_API_BASE = 'https://graph.facebook.com/v20.0';

export type InstagramPostType = 'REELS' | 'VIDEO' | 'IMAGE';

export interface InstagramPostResult {
  success: boolean;
  mediaId?: string;
  permalink?: string;
  error?: string;
}

async function createMediaContainer(
  igUserId: string,
  accessToken: string,
  params: {
    mediaUrl: string;
    caption: string;
    mediaType: InstagramPostType;
    shareToFeed?: boolean;
  }
): Promise<string> {
  const body: Record<string, string> = {
    access_token: accessToken,
    caption: params.caption,
    media_type: params.mediaType,
  };

  if (params.mediaType === 'REELS' || params.mediaType === 'VIDEO') {
    body.video_url = params.mediaUrl;
    if (params.shareToFeed) body.share_to_feed = 'true';
  } else {
    body.image_url = params.mediaUrl;
  }

  const response = await fetch(`${GRAPH_API_BASE}/${igUserId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (data.error) throw new Error(`Container creation failed: ${data.error.message}`);
  return data.id;
}

async function pollContainerStatus(
  containerId: string,
  accessToken: string,
  maxWaitMs: number = 120000
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    await new Promise(r => setTimeout(r, 3000));

    const response = await fetch(
      `${GRAPH_API_BASE}/${containerId}?fields=status_code,status&access_token=${accessToken}`
    );
    const data = await response.json();

    if (data.status_code === 'FINISHED') return;
    if (data.status_code === 'ERROR') throw new Error(`Container processing failed: ${data.status}`);
  }
  throw new Error('Video processing timeout — please try again');
}

async function publishContainer(
  igUserId: string,
  containerId: string,
  accessToken: string
): Promise<string> {
  const response = await fetch(`${GRAPH_API_BASE}/${igUserId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: containerId, access_token: accessToken }),
  });

  const data = await response.json();
  if (data.error) throw new Error(`Publishing failed: ${data.error.message}`);
  return data.id;
}

async function getMediaPermalink(mediaId: string, accessToken: string): Promise<string> {
  const response = await fetch(
    `${GRAPH_API_BASE}/${mediaId}?fields=permalink&access_token=${accessToken}`
  );
  const data = await response.json();
  return data.permalink || `https://www.instagram.com/p/${mediaId}`;
}

export async function postToInstagram(
  accessToken: string,
  igUserId: string,
  videoUrl: string,
  caption: string,
  postType: InstagramPostType = 'REELS',
  onStatusUpdate?: (status: string) => void
): Promise<InstagramPostResult> {
  try {
    onStatusUpdate?.('Creating media container...');
    const containerId = await createMediaContainer(igUserId, accessToken, {
      mediaUrl: videoUrl,
      caption,
      mediaType: postType,
      shareToFeed: true,
    });

    onStatusUpdate?.('Processing video... (this takes 20–60 seconds)');
    await pollContainerStatus(containerId, accessToken);

    onStatusUpdate?.('Publishing to Instagram...');
    const mediaId = await publishContainer(igUserId, containerId, accessToken);
    const permalink = await getMediaPermalink(mediaId, accessToken);

    onStatusUpdate?.('Posted successfully!');
    return { success: true, mediaId, permalink };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
