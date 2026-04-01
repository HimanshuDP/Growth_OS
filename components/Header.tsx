'use client';

import { Bell, Search, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { BusinessProfile } from '@/types';

export default function Header() {
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    // Load business profile from localStorage
    try {
      const stored = localStorage.getItem('growthOS_business');
      if (stored) {
        setBusiness(JSON.parse(stored));
      }
    } catch {
      // Fail silently — no profile yet
    }
  }, []);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-slate-900/80 border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Greeting */}
        <div>
          <h2 className="text-base font-semibold text-white">
            {business
              ? `Welcome back, ${business.name}`
              : 'Welcome to GrowthOS'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{currentDate}</p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Search size={18} />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900" />
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-white/10 mx-1" />

          {/* Profile */}
          <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-all">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-500/20">
              {business ? business.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white leading-none">
                {business ? business.name : 'Guest'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {business ? business.industry : 'Set up your business'}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="px-6 pb-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search campaigns, captions, festivals..."
              autoFocus
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
