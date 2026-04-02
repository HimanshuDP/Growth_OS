// ─── YouTube API ──────────────────────────────────────────────────────────────
// YouTube video upload via YouTube Data API v3 (resumable upload)

export interface YouTubePostResult {
  success: boolean;
  videoId?: string;
  permalink?: string;
  error?: string;
}

export async function uploadVideoToYouTube(
  accessToken: string,
  videoBlob: Blob,
  metadata: {
    title: string;
    description: string;
    tags: string[];
    privacyStatus: 'public' | 'private' | 'unlisted';
    categoryId?: string;
  },
  onStatusUpdate?: (status: string) => void,
  onProgress?: (percent: number) => void
): Promise<YouTubePostResult> {
  try {
    onStatusUpdate?.('Initializing YouTube upload...');

    // Step 1: Initialize resumable upload session
    const initResponse = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Upload-Content-Type': videoBlob.type || 'video/webm',
          'X-Upload-Content-Length': String(videoBlob.size),
        },
        body: JSON.stringify({
          snippet: {
            title: metadata.title,
            description: metadata.description,
            tags: metadata.tags,
            categoryId: metadata.categoryId || '22',
          },
          status: {
            privacyStatus: metadata.privacyStatus,
            selfDeclaredMadeForKids: false,
          },
        }),
      }
    );

    if (!initResponse.ok) {
      const err = await initResponse.json();
      throw new Error(`YouTube init failed: ${err.error?.message || initResponse.status}`);
    }

    const uploadUrl = initResponse.headers.get('Location');
    if (!uploadUrl) throw new Error('No upload URL returned from YouTube');

    onStatusUpdate?.('Uploading video to YouTube...');
    onProgress?.(10);

    // Step 2: Upload the video
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': videoBlob.type || 'video/webm',
        'Content-Length': String(videoBlob.size),
      },
      body: videoBlob,
    });

    if (!uploadResponse.ok) {
      throw new Error(`YouTube upload failed: ${uploadResponse.status}`);
    }

    const data = await uploadResponse.json();
    const videoId = data.id;

    onStatusUpdate?.('Video uploaded to YouTube!');
    onProgress?.(100);

    return {
      success: true,
      videoId,
      permalink: `https://www.youtube.com/watch?v=${videoId}`,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
