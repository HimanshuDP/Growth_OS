'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X, Check, Loader2,
  ExternalLink, Share2, Copy,
  ChevronRight, Link2, Send, Download
} from 'lucide-react';
import { getTokens, saveTokens, isPlatformConnected, type PlatformTokens, type Platform } from '@/lib/social/tokenManager';
import { uploadVideoToStorage } from '@/lib/social/videoUploader';

// Platform SVG icons (lucide doesn't have social icons)
const IgIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const FbIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const LiIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const YtIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>;

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'choose' | 'customize' | 'posting' | 'success';

interface PlatformStatus {
  platform: Platform;
  phase: 'waiting' | 'uploading' | 'processing' | 'done' | 'error';
  message: string;
  permalink?: string;
  error?: string;
}

interface PostToSocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoBlob?: Blob | null;
  imageUrl?: string | null;
  mediaType?: 'video' | 'image';
  initialCaption?: string;
  initialHashtags?: string[];
  videoUrl?: string | null;
}

// ─── Demo Mode Detection ───────────────────────────────────────────────────────

function isDemoMode() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('growthOS_demoMode') === 'true';
}

function randomId(len: number) {
  return Math.random().toString(36).substring(2, 2 + len);
}

// ─── Platform Config ──────────────────────────────────────────────────────────

const PLATFORM_CONFIG = {
  instagram: {
    name: 'Instagram Reels',
    color: 'from-purple-600 to-pink-600',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10',
    icon: <IgIcon />,
    oauthPath: '/api/oauth/meta',
    charLimit: 2200,
  },
  facebook: {
    name: 'Facebook Page',
    color: 'from-blue-600 to-blue-700',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    icon: <FbIcon />,
    oauthPath: '/api/oauth/meta',
    charLimit: 63206,
  },
  linkedin: {
    name: 'LinkedIn',
    color: 'from-sky-600 to-sky-700',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500/10',
    icon: <LiIcon />,
    oauthPath: '/api/oauth/linkedin',
    charLimit: 3000,
  },
  youtube: {
    name: 'YouTube',
    color: 'from-red-600 to-red-700',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/10',
    icon: <YtIcon />,
    oauthPath: '/api/oauth/youtube',
    charLimit: 5000,
  },
};

const PLATFORMS: Platform[] = ['instagram', 'facebook', 'linkedin', 'youtube'];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PostToSocialModal({
  isOpen,
  onClose,
  videoBlob,
  imageUrl,
  mediaType = 'video',
  initialCaption = '',
  initialHashtags = [],
  videoUrl,
}: PostToSocialModalProps) {
  const [step, setStep] = useState<Step>('choose');
  const [tokens, setTokens] = useState<PlatformTokens>({});
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set());
  const [caption, setCaption] = useState(initialCaption);
  const [hashtags, setHashtags] = useState<string[]>(initialHashtags);
  const [hashtagInput, setHashtagInput] = useState('');
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [youtubePrivacy, setYoutubePrivacy] = useState<'public' | 'unlisted' | 'private'>('public');
  const [platformStatuses, setPlatformStatuses] = useState<PlatformStatus[]>([]);
  const [successResults, setSuccessResults] = useState<PlatformStatus[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDemoMode(isDemoMode());
      setStep('choose');
      setCaption(initialCaption);
      setHashtags(initialHashtags);
      loadTokens();
    }
  }, [isOpen, initialCaption, initialHashtags]);

  async function loadTokens() {
    const t = await getTokens();
    setTokens(t);
    // Pre-select all connected platforms
    const connected = new Set<Platform>(
      PLATFORMS.filter(p => !!t[p] as boolean)
    );
    setSelectedPlatforms(connected);
  }

  const togglePlatform = (p: Platform) => {
    if (!tokens[p]) return; // Must be connected first
    setSelectedPlatforms(prev => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  };

  function updateStatus(platform: Platform, update: Partial<PlatformStatus>) {
    setPlatformStatuses(prev =>
      prev.map(s => (s.platform === platform ? { ...s, ...update } : s))
    );
  }

  // ─── Demo Posting ──────────────────────────────────────────────────────────

  async function runDemoPosting() {
    const selected = Array.from(selectedPlatforms);
    const initialStatuses: PlatformStatus[] = selected.map(p => ({
      platform: p,
      phase: 'waiting',
      message: 'Waiting...',
    }));
    setPlatformStatuses(initialStatuses);
    setStep('posting');

    // Simulate Firebase upload
    setUploadProgress(0);
    for (let p = 0; p <= 100; p += 10) {
      await new Promise(r => setTimeout(r, 150));
      setUploadProgress(p);
    }

    // Simulate per-platform posting with different delays
    const delays: Record<Platform, number[]> = {
      instagram: [1000, 5000, 3000],
      facebook: [1000, 2000],
      linkedin: [1500, 2500],
      youtube: [2000, 3000],
    };

    const fakePermalinks: Record<Platform, string> = {
      instagram: `https://www.instagram.com/reel/${randomId(11)}`,
      facebook: `https://www.facebook.com/video/${Math.floor(Math.random() * 1e15)}`,
      linkedin: `https://www.linkedin.com/feed/update/urn:li:ugcPost:${randomId(10)}`,
      youtube: `https://www.youtube.com/watch?v=${randomId(11)}`,
    };

    const demoSteps: Record<Platform, string[]> = {
      instagram: ['Uploading to Firebase...', 'Processing video... (simulated)', 'Publishing Reel...'],
      facebook: ['Uploading to Facebook...', 'Publishing to Page...'],
      linkedin: ['Uploading to LinkedIn...', 'Creating post...'],
      youtube: ['Initializing upload...', 'Uploading video...'],
    };

    const platformPromises = selected.map(async (p) => {
      const steps = demoSteps[p];
      for (let i = 0; i < steps.length; i++) {
        updateStatus(p, { phase: i === 0 ? 'uploading' : 'processing', message: steps[i] });
        await new Promise(r => setTimeout(r, delays[p][i] || 1000));
      }
      updateStatus(p, { phase: 'done', message: 'Posted!', permalink: fakePermalinks[p] });
    });

    await Promise.all(platformPromises);

    const finalResults = selected.map(p => ({
      platform: p,
      phase: 'done' as const,
      message: 'Posted!',
      permalink: fakePermalinks[p],
    }));
    setSuccessResults(finalResults);
    setStep('success');
  }

  // ─── Real Posting ──────────────────────────────────────────────────────────

  async function runRealPosting() {
    const selected = Array.from(selectedPlatforms);
    const initialStatuses: PlatformStatus[] = selected.map(p => ({
      platform: p,
      phase: 'waiting',
      message: 'Waiting...',
    }));
    setPlatformStatuses(initialStatuses);
    setStep('posting');

    // Upload video to Firebase Storage
    let publicUrl = imageUrl || '';
    let storagePath = '';

    if (videoBlob || videoUrl) {
      try {
        updateStatus(selected[0], { phase: 'uploading', message: 'Uploading to cloud...' });
        const blobToUpload = videoBlob || (videoUrl ? await fetch(videoUrl).then(r => r.blob()) : null);
        if (blobToUpload) {
          const uploaded = await uploadVideoToStorage(
            blobToUpload,
            `growthos_video_${Date.now()}.webm`,
            (pct) => setUploadProgress(pct)
          );
          publicUrl = uploaded.publicUrl;
          storagePath = uploaded.storagePath;
        }
      } catch (err) {
        console.warn('Upload failed:', err);
      }
    }

    // Send to server-side posting orchestrator
    let videoBlobBase64 = '';
    let videoBlobType = '';
    if (videoBlob) {
      const buffer = await videoBlob.arrayBuffer();
      videoBlobBase64 = Buffer.from(buffer).toString('base64');
      videoBlobType = videoBlob.type;
    }

    try {
      selected.forEach(p => updateStatus(p, { phase: 'processing', message: 'Posting...' }));

      const res = await fetch('/api/social/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: selected,
          videoPublicUrl: publicUrl,
          videoBlobBase64,
          videoBlobType,
          caption,
          hashtags,
          title: youtubeTitle || caption.slice(0, 80),
          youtubePrivacy,
          tokens,
        }),
      });

      const data = await res.json();
      const finalResults: PlatformStatus[] = (data.results || []).map((r: any) => ({
        platform: r.platform,
        phase: r.success ? 'done' : 'error',
        message: r.success ? 'Posted!' : `Failed: ${r.error}`,
        permalink: r.permalink,
        error: r.error,
      }));

      setSuccessResults(finalResults);
      setStep('success');
    } catch (err: any) {
      selected.forEach(p =>
        updateStatus(p, { phase: 'error', message: `Failed: ${err.message}`, error: err.message })
      );
      setSuccessResults(selected.map(p => ({
        platform: p,
        phase: 'error' as const,
        message: `Failed: ${err.message}`,
        error: err.message,
      })));
      setStep('success');
    }
  }

  async function handlePostNow() {
    if (demoMode) {
      await runDemoPosting();
    } else {
      await runRealPosting();
    }
  }

  function copyAllLinks() {
    const links = successResults
      .filter(r => r.permalink)
      .map(r => `${PLATFORM_CONFIG[r.platform].name}: ${r.permalink}`)
      .join('\n');
    navigator.clipboard?.writeText(links);
  }

  if (!isOpen) return null;

  const selectedCount = selectedPlatforms.size;
  const connectedCount = PLATFORMS.filter(p => !!tokens[p]).length;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
              <Send size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Share to Social Media</h2>
              <p className="text-slate-400 text-xs">
                {step === 'choose' && `${connectedCount} platform${connectedCount !== 1 ? 's' : ''} connected`}
                {step === 'customize' && `${selectedCount} platform${selectedCount !== 1 ? 's' : ''} selected`}
                {step === 'posting' && 'Publishing your content...'}
                {step === 'success' && 'Your content is live 🚀'}
              </p>
            </div>
          </div>
          {demoMode && (
            <span className="text-xs bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2 py-1 rounded-full font-medium mr-2">
              🎭 Demo Mode
            </span>
          )}
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Progress Steps */}
        {step !== 'success' && (
          <div className="flex px-6 py-3 gap-2 border-b border-white/5">
            {(['choose', 'customize', 'posting'] as Step[]).map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1.5 text-xs font-medium ${
                  step === s
                    ? 'text-orange-400'
                    : (s === 'choose' && step !== 'choose') || (s === 'customize' && step === 'posting')
                      ? 'text-emerald-400'
                      : 'text-slate-600'
                }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${
                    step === s
                      ? 'border-orange-400 bg-orange-400/10'
                      : (s === 'choose' && step !== 'choose') || (s === 'customize' && step === 'posting')
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700'
                  }`}>
                    {(s === 'choose' && step !== 'choose') || (s === 'customize' && step === 'posting')
                      ? <Check size={10} />
                      : i + 1
                    }
                  </span>
                  {s === 'choose' ? 'Platforms' : s === 'customize' ? 'Customize' : 'Publishing'}
                </div>
                {i < 2 && <div className="flex-1 h-px bg-slate-800 self-center" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* STEP 1: Choose Platforms */}
          {step === 'choose' && (
            <div className="space-y-4">
              <p className="text-slate-400 text-sm">
                Your content is ready. Select connected platforms to publish.
                {demoMode && (
                  <span className="text-amber-400"> (Demo mode — all platforms simulated)</span>
                )}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {PLATFORMS.map(p => {
                  const cfg = PLATFORM_CONFIG[p];
                  const connected = !!tokens[p];
                  const selected = selectedPlatforms.has(p);
                  const info = tokens[p];

                  return (
                    <div
                      key={p}
                      onClick={() => connected ? togglePlatform(p) : null}
                      className={`relative rounded-2xl border p-4 transition-all cursor-pointer ${
                        connected
                          ? selected
                            ? `${cfg.borderColor} ${cfg.bgColor} ring-1 ring-inset ${cfg.borderColor}`
                            : 'border-slate-800 hover:border-slate-600 bg-slate-800/50'
                          : 'border-slate-800/50 bg-slate-900/30 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {selected && connected && (
                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br ${cfg.color} flex items-center justify-center`}>
                          <Check size={10} className="text-white" />
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.color} flex items-center justify-center text-white`}>
                          {cfg.icon}
                        </div>
                        <div>
                          <div className="text-white text-sm font-semibold">{cfg.name}</div>
                          {connected ? (
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span className="text-emerald-400 text-xs">Connected</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-xs">Not connected</span>
                          )}
                        </div>
                      </div>

                      {connected && info && (
                        <p className={`text-xs ${cfg.textColor} font-medium truncate`}>
                          {p === 'instagram' && `@${(info as any).username}`}
                          {p === 'facebook' && (info as any).pageName}
                          {p === 'linkedin' && (info as any).displayName}
                          {p === 'youtube' && (info as any).channelName}
                        </p>
                      )}

                      {!connected && (
                        <a
                          href={cfg.oauthPath}
                          onClick={e => e.stopPropagation()}
                          className={`mt-2 flex items-center gap-1 text-xs ${cfg.textColor} hover:underline font-medium`}
                        >
                          Connect → <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              {connectedCount === 0 && !demoMode && (
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
                  <p className="text-slate-400 text-sm mb-2">No accounts connected yet.</p>
                  <a href="/settings" className="text-orange-400 hover:text-orange-300 text-sm font-medium">
                    Go to Settings → Connected Accounts →
                  </a>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Customize Post */}
          {step === 'customize' && (
            <div className="space-y-5">
              {/* Video Preview */}
              {(videoBlob || videoUrl) && (
                <div className="flex justify-center">
                  <div className="w-36 h-52 rounded-2xl overflow-hidden border border-white/10 bg-black shadow-xl">
                    <video
                      src={videoUrl || (videoBlob ? URL.createObjectURL(videoBlob) : '')}
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              {imageUrl && !videoBlob && !videoUrl && (
                <div className="flex justify-center">
                  <img src={imageUrl} alt="Post preview" className="h-40 rounded-2xl object-cover border border-white/10 shadow-xl" />
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">Caption</label>
                <textarea
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm resize-none focus:ring-2 focus:ring-orange-500/50 outline-none"
                  placeholder="Write your caption here..."
                />
                <p className="text-xs text-slate-500 mt-1">{caption.length} characters</p>
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">Hashtags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {hashtags.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs px-2 py-1 rounded-full">
                      #{tag}
                      <button onClick={() => setHashtags(hashtags.filter((_, j) => j !== i))}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hashtagInput}
                    onChange={e => setHashtagInput(e.target.value.replace(/\s/g, ''))}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && hashtagInput) {
                        setHashtags([...hashtags, hashtagInput.replace(/^#/, '')]);
                        setHashtagInput('');
                      }
                    }}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-orange-500/50 outline-none"
                    placeholder="#hashtag (press Enter)"
                  />
                </div>
              </div>

              {/* YouTube specific */}
              {selectedPlatforms.has('youtube') && (
                <div className="space-y-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
                    <YtIcon /> YouTube Settings
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Video Title (required)</label>
                    <input
                      type="text"
                      value={youtubeTitle}
                      onChange={e => setYoutubeTitle(e.target.value)}
                      maxLength={100}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-red-500/50 outline-none"
                      placeholder="Enter video title..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Privacy</label>
                    <select
                      value={youtubePrivacy}
                      onChange={e => setYoutubePrivacy(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm outline-none"
                    >
                      <option value="public">Public</option>
                      <option value="unlisted">Unlisted</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Posting Progress */}
          {step === 'posting' && (
            <div className="space-y-4">
              {/* Upload progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Media Upload</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>

              {/* Per-platform status */}
              <div className="space-y-3">
                {platformStatuses.map(status => {
                  const cfg = PLATFORM_CONFIG[status.platform];
                  return (
                    <div key={status.platform} className={`flex items-center gap-3 p-3 rounded-xl border ${cfg.borderColor} ${cfg.bgColor}`}>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.color} flex items-center justify-center text-white flex-shrink-0`}>
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold">{cfg.name}</div>
                        <div className={`text-xs ${status.phase === 'done' ? 'text-emerald-400' : status.phase === 'error' ? 'text-red-400' : 'text-slate-400'}`}>
                          {status.message}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {status.phase === 'waiting' && <div className="w-3 h-3 rounded-full bg-slate-600" />}
                        {(status.phase === 'uploading' || status.phase === 'processing') && (
                          <Loader2 size={16} className="text-amber-400 animate-spin" />
                        )}
                        {status.phase === 'done' && (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                        {status.phase === 'error' && (
                          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                            <X size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center text-slate-500 text-xs animate-pulse">
                Please wait — do not close this window
              </div>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 'success' && (
            <div className="space-y-5 text-center">
              {/* Big checkmark */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-bounce-once">
                  <Check size={40} className="text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Your content is live! 🚀</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Posted to {successResults.filter(r => r.phase === 'done').length} platform
                  {successResults.filter(r => r.phase === 'done').length !== 1 ? 's' : ''} successfully
                </p>
              </div>

              {/* Results */}
              <div className="space-y-2 text-left">
                {successResults.map(r => {
                  const cfg = PLATFORM_CONFIG[r.platform];
                  return (
                    <div key={r.platform} className={`flex items-center gap-3 p-3 rounded-xl border ${r.phase === 'done' ? cfg.borderColor + ' ' + cfg.bgColor : 'border-red-500/20 bg-red-500/5'}`}>
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cfg.color} flex items-center justify-center text-white flex-shrink-0 text-xs`}>
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold">{cfg.name}</div>
                        {r.phase === 'done' ? (
                          <span className="text-emerald-400 text-xs">✓ Posted successfully</span>
                        ) : (
                          <span className="text-red-400 text-xs">⚠️ {r.error || 'Failed'}</span>
                        )}
                      </div>
                      {r.permalink && (
                        <a href={r.permalink} target="_blank" rel="noopener noreferrer"
                           className={`flex items-center gap-1 text-xs ${cfg.textColor} hover:underline flex-shrink-0`}>
                          View <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Demo watermark */}
              {demoMode && (
                <div className="p-2 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-400/70 text-center">
                  🎭 Simulated for demo — real posting requires OAuth setup in Settings
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between gap-3">
          {step === 'choose' && (
            <>
              <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button
                onClick={() => setStep('customize')}
                disabled={selectedCount === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight size={16} />
              </button>
            </>
          )}

          {step === 'customize' && (
            <>
              <button onClick={() => setStep('choose')} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                ← Back
              </button>
              <button
                onClick={handlePostNow}
                disabled={!caption}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={16} /> Post Now →
              </button>
            </>
          )}

          {step === 'posting' && (
            <div className="w-full text-center text-slate-500 text-sm">
              <Loader2 size={16} className="animate-spin inline mr-2" />
              Publishing to {selectedCount} platform{selectedCount !== 1 ? 's' : ''}...
            </div>
          )}

          {step === 'success' && (
            <>
              <button
                onClick={copyAllLinks}
                className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-xl text-slate-300 text-sm hover:bg-slate-800 transition-colors"
              >
                <Copy size={14} /> Copy Links
              </button>
              <div className="flex gap-2">
                <a href="/performance" className="flex items-center gap-1 px-4 py-2 bg-slate-800 rounded-xl text-white text-sm hover:bg-slate-700 transition-colors">
                  View Analytics
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                >
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
