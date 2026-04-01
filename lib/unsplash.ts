// ─── Unsplash API Client ──────────────────────────────────────────────────────

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

export interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    links: { html: string };
  };
  links: { download_location: string };
}

// ─── Search photos by keyword ─────────────────────────────────────────────────

export async function searchPhotos(
  query: string,
  count: number = 4
): Promise<UnsplashPhoto[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    return getLocalFallbackPhotos(query, count);
  }

  try {
    const params = new URLSearchParams({
      query: `${query} india`,
      per_page: count.toString(),
      orientation: 'squarish',
      content_filter: 'high',
    });

    const response = await fetch(`${UNSPLASH_BASE_URL}/search/photos?${params}`, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      return getLocalFallbackPhotos(query, count);
    }

    const data = await response.json();
    return (data.results as UnsplashPhoto[]) || [];
  } catch {
    return getLocalFallbackPhotos(query, count);
  }
}

// ─── Get single random photo ──────────────────────────────────────────────────

export async function getRandomPhoto(query: string): Promise<UnsplashPhoto | null> {
  const photos = await searchPhotos(query, 1);
  return photos[0] || null;
}

// ─── Fallback: curated placeholder images ────────────────────────────────────

function getLocalFallbackPhotos(query: string, count: number): UnsplashPhoto[] {
  const fallbackSeeds = [
    'business', 'festival', 'india', 'marketing', 'celebration', 'food',
    'shopping', 'technology', 'fashion', 'people',
  ];

  const seed = fallbackSeeds.find((s) => query.toLowerCase().includes(s)) || 'india';

  return Array.from({ length: count }, (_, i) => ({
    id: `fallback-${seed}-${i}`,
    urls: {
      regular: `https://picsum.photos/seed/${seed}${i * 7}/800/600`,
      small: `https://picsum.photos/seed/${seed}${i * 7}/400/300`,
      thumb: `https://picsum.photos/seed/${seed}${i * 7}/200/150`,
    },
    alt_description: `${query} image ${i + 1}`,
    user: {
      name: 'Stock Photo',
      links: { html: '#' },
    },
    links: { download_location: '#' },
  }));
}
