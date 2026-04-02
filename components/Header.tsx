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
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#080C14]/85 border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Greeting */}
        <div>
          <h2 className="text-base font-bold text-text-primary tracking-tight">
            {business
              ? `Welcome back, ${business.name}`
              : 'GrowthOS Dashboard'}
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5 font-medium uppercase tracking-[0.05em]">{currentDate}</p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="group relative p-2.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
          >
            <Search size={18} />
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-all">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-orange ring-2 ring-[#080C14]" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Profile */}
          <button className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-brand-orange/20">
              {business ? business.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-text-primary leading-none">
                {business ? business.name : 'Setup Profile'}
              </p>
              <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider font-semibold">
                {business ? business.industry : 'Free Account'}
              </p>
            </div>
            <ChevronDown size={14} className="text-text-muted group-hover:text-text-primary" />
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="px-6 pb-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search campaigns, captions, festivals..."
              autoFocus
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-bg-surface border border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-[3px] focus:ring-brand-orange/15 focus:border-brand-orange/40 transition-all"
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
