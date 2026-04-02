// ─── Social Token Manager ─────────────────────────────────────────────────────
// Manages OAuth access tokens for all connected social platforms.
// Primary store: localStorage (instant) + Firestore mirror (persistent).

import { saveSocialTokens, getSocialTokens, deleteSocialToken } from '@/lib/firebase';

export interface InstagramTokens {
  accessToken: string;
  userId: string;
  username: string;
  profilePic?: string;
  connectedAt: string;
  expiresAt: string;
}

export interface FacebookTokens {
  accessToken: string;
  pageId: string;
  pageName: string;
  connectedAt: string;
}

export interface LinkedInTokens {
  accessToken: string;
  personUrn: string;
  displayName: string;
  connectedAt: string;
  expiresAt: string;
}

export interface YouTubeTokens {
  accessToken: string;
  refreshToken: string;
  channelId: string;
  channelName: string;
  connectedAt: string;
}

export interface PlatformTokens {
  instagram?: InstagramTokens;
  facebook?: FacebookTokens;
  linkedin?: LinkedInTokens;
  youtube?: YouTubeTokens;
}

export type Platform = 'instagram' | 'facebook' | 'linkedin' | 'youtube';

// ─── Demo Mode Tokens ─────────────────────────────────────────────────────────

const DEMO_TOKENS: PlatformTokens = {
  instagram: {
    accessToken: 'DEMO_TOKEN',
    userId: 'demo_ig_user',
    username: 'mumbai.mithai.house',
    profilePic: '',
    connectedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  facebook: {
    accessToken: 'DEMO_TOKEN',
    pageId: 'demo_fb_page',
    pageName: 'Mumbai Mithai House',
    connectedAt: new Date().toISOString(),
  },
  linkedin: {
    accessToken: 'DEMO_TOKEN',
    personUrn: 'urn:li:person:demo123',
    displayName: 'Rajesh Sharma',
    connectedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  youtube: {
    accessToken: 'DEMO_TOKEN',
    refreshToken: 'DEMO_REFRESH',
    channelId: 'demo_channel',
    channelName: 'Mumbai Mithai Official',
    connectedAt: new Date().toISOString(),
  },
};

function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('growthOS_demoMode') === 'true';
}

// ─── Token CRUD ───────────────────────────────────────────────────────────────

export async function saveTokens(tokens: Partial<PlatformTokens>): Promise<void> {
  const current = await getTokens();
  const merged = { ...current, ...tokens };
  // Remove null values
  Object.keys(merged).forEach(k => {
    if ((merged as any)[k] === null) delete (merged as any)[k];
  });
  await saveSocialTokens(merged);
}

export async function getTokens(): Promise<PlatformTokens> {
  if (isDemoMode()) return DEMO_TOKENS;
  return (await getSocialTokens()) as PlatformTokens;
}

export async function isPlatformConnected(platform: Platform): Promise<boolean> {
  const tokens = await getTokens();
  return !!tokens[platform];
}

export async function disconnectPlatform(platform: Platform): Promise<void> {
  if (isDemoMode()) return; // No-op in demo mode
  await deleteSocialToken(platform);
}

export function isTokenExpiringSoon(expiresAt: string): boolean {
  const expiry = new Date(expiresAt).getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return expiry - Date.now() < sevenDaysMs;
}

export function formatConnectedDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

export function formatExpiryDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}
