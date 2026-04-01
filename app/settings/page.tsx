'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Trash2, Globe, Key, Bell, Palette, Check } from 'lucide-react';
import type { BusinessProfile } from '@/types';

export default function SettingsPage() {
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('growthOS_business');
      if (stored) setBusiness(JSON.parse(stored));
    } catch { /* silent */ }
  }, []);

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
        <p className="text-slate-400 text-sm mt-1">Manage your business profile and application preferences</p>
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
            <a href="/onboard" className="text-indigo-400 hover:text-indigo-300 text-sm underline">
              Set up your business →
            </a>
          </div>
        )}
      </div>

      {/* API Keys */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2"><Key size={16} className="text-amber-400" /> API Keys</h3>
        <p className="text-xs text-slate-500">Add your API keys in the <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">.env.local</code> file at the project root.</p>
        {[
          { name: 'NEXT_PUBLIC_GEMINI_API_KEY', label: 'Google Gemini API', link: 'https://aistudio.google.com/app/apikey', status: 'Required' },
          { name: 'NEXT_PUBLIC_UNSPLASH_ACCESS_KEY', label: 'Unsplash API', link: 'https://unsplash.com/developers', status: 'Optional' },
          { name: 'NEXT_PUBLIC_FIREBASE_API_KEY', label: 'Firebase API', link: 'https://console.firebase.google.com', status: 'Optional' },
        ].map((api) => (
          <div key={api.name} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
            <div>
              <div className="text-sm font-medium text-white">{api.label}</div>
              <code className="text-xs text-slate-500">{api.name}</code>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${api.status === 'Required' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>{api.status}</span>
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
