// ─── LinkedIn API ─────────────────────────────────────────────────────────────
// LinkedIn video post via LinkedIn Marketing API

const LINKEDIN_API = 'https://api.linkedin.com/v2';

export interface LinkedInPostResult {
  success: boolean;
  postId?: string;
  permalink?: string;
  error?: string;
}

async function initializeLinkedInVideoUpload(
  personUrn: string,
  accessToken: string,
  fileSize: number
): Promise<{ videoUrn: string; uploadUrl: string }> {
  const response = await fetch(`${LINKEDIN_API}/assets?action=registerUpload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-video'],
        owner: personUrn,
        serviceRelationships: [
          {
            relationshipType: 'OWNER',
            identifier: 'urn:li:userGeneratedContent',
          },
        ],
        supportedUploadMechanism: ['SYNCHRONOUS_UPLOAD'],
      },
    }),
  });

  const data = await response.json();
  if (data.status === 400 || data.status === 401) {
    throw new Error(`LinkedIn init failed: ${data.message}`);
  }

  return {
    videoUrn: data.value.asset,
    uploadUrl:
      data.value.uploadMechanism[
        'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
      ].uploadUrl,
  };
}

async function uploadVideoToLinkedIn(
  uploadUrl: string,
  videoBlob: Blob,
  accessToken: string
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': videoBlob.type || 'video/mp4',
    },
    body: videoBlob,
  });

  if (!response.ok) throw new Error(`LinkedIn video upload failed: ${response.status}`);
}

async function createLinkedInPost(
  personUrn: string,
  videoUrn: string,
  accessToken: string,
  text: string
): Promise<string> {
  const response = await fetch(`${LINKEDIN_API}/ugcPosts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'VIDEO',
          media: [
            {
              status: 'READY',
              description: { text: text.slice(0, 200) },
              media: videoUrn,
              title: { text: text.slice(0, 50) },
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }),
  });

  const data = await response.json();
  if (data.status === 422 || data.status === 400) {
    throw new Error(`LinkedIn post creation failed: ${data.message}`);
  }
  return data.id;
}

export async function postVideoToLinkedIn(
  accessToken: string,
  personUrn: string,
  videoUrl: string,
  videoBlob: Blob,
  caption: string,
  onStatusUpdate?: (status: string) => void
): Promise<LinkedInPostResult> {
  try {
    onStatusUpdate?.('Initializing LinkedIn upload...');
    const { videoUrn, uploadUrl } = await initializeLinkedInVideoUpload(
      personUrn,
      accessToken,
      videoBlob.size
    );

    onStatusUpdate?.('Uploading video to LinkedIn...');
    await uploadVideoToLinkedIn(uploadUrl, videoBlob, accessToken);

    onStatusUpdate?.('Publishing LinkedIn post...');
    const postId = await createLinkedInPost(personUrn, videoUrn, accessToken, caption);

    onStatusUpdate?.('Posted to LinkedIn!');
    return {
      success: true,
      postId,
      permalink: `https://www.linkedin.com/feed/update/${postId}`,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
