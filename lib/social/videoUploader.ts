// ─── Video Uploader ───────────────────────────────────────────────────────────
// Uploads video blob to Firebase Storage for public URL sharing.
// Falls back to object URL if Firebase Storage is unavailable.

export interface UploadedVideo {
  publicUrl: string;
  storagePath: string;
  fileSize: number;
  duration: number;
  mimeType: string;
  isDemo?: boolean;
}

// ─── Firebase Storage Upload (requires Blaze plan) ────────────────────────────

export async function uploadVideoToStorage(
  videoBlob: Blob,
  filename: string,
  onProgress?: (percent: number) => void
): Promise<UploadedVideo> {
  const storageConfigured = !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );

  if (!storageConfigured) {
    // Fallback: use object URL (won't work for external API calls, but works for demo)
    return createDemoUploadedVideo(videoBlob, filename, onProgress);
  }

  try {
    // Dynamic import so Storage SDK doesn't crash if not available
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const { app } = await import('@/lib/firebase');
    if (!app) throw new Error('Firebase app not initialized');

    const storage = getStorage(app);
    const timestamp = Date.now();
    const storagePath = `temp-posts/${timestamp}_${filename}`;
    const storageRef = ref(storage, storagePath);

    // Simulate progress (Firebase SDK v12 doesn't have onSnapshot for progress)
    if (onProgress) {
      onProgress(10);
      await new Promise(r => setTimeout(r, 300));
      onProgress(40);
    }

    await uploadBytes(storageRef, videoBlob, {
      contentType: videoBlob.type || 'video/webm',
    });

    if (onProgress) onProgress(80);

    const publicUrl = await getDownloadURL(storageRef);
    if (onProgress) onProgress(100);

    return {
      publicUrl,
      storagePath,
      fileSize: videoBlob.size,
      duration: 5,
      mimeType: videoBlob.type || 'video/webm',
    };
  } catch (err) {
    console.warn('Firebase Storage upload failed, falling back to demo mode:', err);
    return createDemoUploadedVideo(videoBlob, filename, onProgress);
  }
}

// ─── Demo Upload (for hackathon / no-Storage scenarios) ───────────────────────

async function createDemoUploadedVideo(
  videoBlob: Blob,
  filename: string,
  onProgress?: (percent: number) => void
): Promise<UploadedVideo> {
  // Simulate upload progress
  if (onProgress) {
    for (let p = 0; p <= 100; p += 20) {
      onProgress(p);
      await new Promise(r => setTimeout(r, 200));
    }
  }

  const objectUrl = URL.createObjectURL(videoBlob);
  return {
    publicUrl: objectUrl, // Only works locally, but fine for demo
    storagePath: `demo/${Date.now()}_${filename}`,
    fileSize: videoBlob.size,
    duration: 5,
    mimeType: videoBlob.type || 'video/webm',
    isDemo: true,
  };
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

export async function cleanupUploadedVideo(storagePath: string): Promise<void> {
  if (storagePath.startsWith('demo/')) return; // Skip demo paths

  try {
    const { getStorage, ref, deleteObject } = await import('firebase/storage');
    const { app } = await import('@/lib/firebase');
    if (!app) return;

    const storage = getStorage(app);
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn('Cleanup failed (non-critical):', err);
  }
}
