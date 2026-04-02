'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Settings, Save, Trash2, Globe, Key, Palette, Check, Share2, Unlink, ExternalLink, Zap } from 'lucide-react';
import type { BusinessProfile } from '@/types';
import { getTokens, saveTokens, disconnectPlatform, formatConnectedDate, type PlatformTokens, type Platform } from '@/lib/social/tokenManager';

// ─── SVG Social Icons ─────────────────────────────────────────────────────────

const IgIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const FbIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const LiIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const YtIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>;

const SOCIAL_PLATFORMS = [
  { id: 'instagram' as Platform, name: 'Instagram', icon: <IgIcon />, color: 'from-purple-600 to-pink-600', oauthPath: '/api/oauth/meta', subtitle: 'Reels & Posts' },
  { id: 'facebook' as Platform, name: 'Facebook', icon: <FbIcon />, color: 'from-blue-600 to-blue-700', oauthPath: '/api/oauth/meta', subtitle: 'Page Videos' },
  { id: 'linkedin' as Platform, name: 'LinkedIn', icon: <LiIcon />, color: 'from-sky-600 to-sky-700', oauthPath: '/api/oauth/linkedin', subtitle: 'Professional Posts' },
  { id: 'youtube' as Platform, name: 'YouTube', icon: <YtIcon />, color: 'from-red-600 to-red-700', oauthPath: '/api/oauth/youtube', subtitle: 'Video Uploads' },
];

function SettingsContent() {
  const searchParams = useSearchParams();
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [tokens, setTokens] = useState<PlatformTokens>({});
  const [demoMode, setDemoMode] = useState(false);
  const [socialMsg, setSocialMsg] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('growthOS_business');
      if (stored) setBusiness(JSON.parse(stored));
    } catch { /* silent */ }
    setDemoMode(localStorage.getItem('growthOS_demoMode') === 'true');
    loadTokens();
  }, []);

  useEffect(() => {
    const platform = searchParams.get('platform');
    const tokensParam = searchParams.get('tokens');
    const error = searchParams.get('error');

    if (error) {
      setSocialMsg(`⚠️ Connection failed: ${error.replace(/_/g, ' ')}`);
      window.history.replaceState({}, '', '/settings');
      return;
    }

    if (platform && tokensParam) {
      try {
        const newTokens = JSON.parse(decodeURIComponent(tokensParam));
        saveTokens(newTokens).then(() => {
          loadTokens();
          setSocialMsg(`✅ ${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully!`);
          setTimeout(() => setSocialMsg(''), 4000);
        });
      } catch (e) {
        setSocialMsg('⚠️ Failed to save connection tokens.');
      }
      window.history.replaceState({}, '', '/settings');
    }
  }, [searchParams]);

  async function loadTokens() {
    const t = await getTokens();
    setTokens(t);
  }

  async function handleDisconnect(platform: Platform) {
    await disconnectPlatform(platform);
    await loadTokens();
    setSocialMsg(`Disconnected from ${platform}.`);
    setTimeout(() => setSocialMsg(''), 3000);
  }

  function toggleDemoMode() {
    const next = !demoMode;
    setDemoMode(next);
    localStorage.setItem('growthOS_demoMode', next ? 'true' : 'false');
    loadTokens();
  }

  const saveBusiness = () => {
    if (business) {
      localStorage.setItem('growthOS_business', JSON.stringify(business));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const clearData = () => {
    localStorage.removeItem('growthOS_business');
    localStorage.removeItem('growthOS_calendar');
    setBusiness(null);
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  const update = (key: keyof BusinessProfile, value: string) => {
    if (!business) return;
    setBusiness({ ...business, [key]: value });
  };

  return (
    <div className="space-y-6 fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Settings size={24} className="text-slate-400" /> Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your business profile, connected accounts, and preferences</p>
      </div>

      {/* Connected Social Accounts */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Share2 size={16} className="text-orange-400" /> Connected Social Accounts
          </h3>
          <button
            onClick={toggleDemoMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              demoMode
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            <Zap size={12} /> {demoMode ? '🎭 Demo Mode ON' : 'Enable Demo Mode'}
          </button>
        </div>

        {socialMsg && (
          <div className={`text-sm px-4 py-2.5 rounded-xl border ${socialMsg.startsWith('✅') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
            {socialMsg}
          </div>
        )}

        {demoMode && (
          <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl text-xs text-amber-400/80">
            🎭 <strong>Demo Mode</strong> — All platforms show as connected with simulated posting. Perfect for hackathon demos!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SOCIAL_PLATFORMS.map(({ id, name, icon, color, oauthPath, subtitle }) => {
            const connected = !!tokens[id];
            const info = tokens[id] as any;
            return (
              <div key={id} className={`p-4 rounded-2xl border transition-all ${connected ? 'border-white/10 bg-white/3' : 'border-dashed border-white/8 bg-transparent'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
                    {icon}
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold">{name}</div>
                    <div className="text-slate-500 text-xs">{subtitle}</div>
                  </div>
                  <div className="ml-auto">
                    {connected
                      ? <span className="flex items-center gap-1 text-xs text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Live</span>
                      : <span className="text-xs text-slate-600">Not connected</span>
                    }
                  </div>
                </div>

                {connected && info && (
                  <p className="text-xs text-slate-400 mb-3 font-mono truncate">
                    {id === 'instagram' && `@${info.username}`}
                    {id === 'facebook' && info.pageName}
                    {id === 'linkedin' && info.displayName}
                    {id === 'youtube' && info.channelName}
                    {info.connectedAt && <span className="text-slate-600"> · since {formatConnectedDate(info.connectedAt)}</span>}
                  </p>
                )}

                {connected ? (
                  <button
                    onClick={() => handleDisconnect(id)}
                    className="w-full py-2 text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Unlink size={11} /> Disconnect
                  </button>
                ) : (
                  <a
                    href={oauthPath}
                    className={`w-full py-2 text-xs font-bold text-white bg-gradient-to-r ${color} rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-1.5`}
                  >
                    <ExternalLink size={11} /> Connect {name}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Business Profile */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2"><Globe size={16} className="text-indigo-400" /> Business Profile</h3>
        {business ? (
          <>
            {[
              { key: 'name' as keyof BusinessProfile, label: 'Business Name' },
              { key: 'websiteUrl' as keyof BusinessProfile, label: 'Website URL' },
              { key: 'location' as keyof BusinessProfile, label: 'Location' },
              { key: 'industry' as keyof BusinessProfile, label: 'Industry' },
              { key: 'monthlyBudget' as keyof BusinessProfile, label: 'Monthly Budget' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
                <input
                  type="text"
                  value={String(business[key] || '')}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={saveBusiness} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400 transition-all">
                {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
              </button>
              <button onClick={clearData} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-all">
                {cleared ? <><Check size={14} /> Cleared</> : <><Trash2 size={14} /> Clear All Data</>}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-slate-500 text-sm mb-3">No business profile found.</p>
            <a href="/onboard" className="text-indigo-400 hover:text-indigo-300 text-sm underline">Set up your business →</a>
          </div>
        )}
      </div>

      {/* API Keys */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2"><Key size={16} className="text-amber-400" /> API Keys</h3>
        <p className="text-xs text-slate-500">Add your API keys in the <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">.env.local</code> file at the project root.</p>
        {[
          { name: 'NEXT_PUBLIC_GEMINI_API_KEY', label: 'Google Gemini API', link: 'https://aistudio.google.com/app/apikey', status: 'Required' },
          { name: 'NEXT_PUBLIC_META_APP_ID', label: 'Meta App (Instagram + Facebook)', link: 'https://developers.facebook.com', status: 'Social' },
          { name: 'NEXT_PUBLIC_LINKEDIN_CLIENT_ID', label: 'LinkedIn App', link: 'https://developer.linkedin.com', status: 'Social' },
          { name: 'NEXT_PUBLIC_GOOGLE_CLIENT_ID', label: 'Google API (YouTube)', link: 'https://console.cloud.google.com', status: 'Social' },
          { name: 'NEXT_PUBLIC_FIREBASE_API_KEY', label: 'Firebase', link: 'https://console.firebase.google.com', status: 'Optional' },
        ].map((api) => (
          <div key={api.name} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
            <div>
              <div className="text-sm font-medium text-white">{api.label}</div>
              <code className="text-xs text-slate-500">{api.name}</code>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${api.status === 'Required' ? 'bg-red-500/10 text-red-400' : api.status === 'Social' ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>{api.status}</span>
              <a href={api.link} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300">Get Key →</a>
            </div>
          </div>
        ))}
      </div>

      {/* App Info */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-3"><Palette size={16} className="text-purple-400" /> About GrowthOS</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <p><span className="text-slate-300 font-medium">Version:</span> 1.0.0 (Innovathon 2026 Build)</p>
          <p><span className="text-slate-300 font-medium">AI Engine:</span> Google Gemini 1.5 Flash</p>
          <p><span className="text-slate-300 font-medium">Framework:</span> Next.js 14 + TypeScript</p>
          <p><span className="text-slate-300 font-medium">Target Market:</span> Indian SMEs (B2B/B2C/D2C)</p>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 p-8">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
