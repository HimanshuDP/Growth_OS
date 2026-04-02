'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  PenLine,
  PartyPopper,
  Megaphone,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Palette,
} from 'lucide-react';
import { useState } from 'react';
import { useAutopilot } from '@/context/AutopilotContext';

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  isNew?: boolean;
  badgeCount?: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { pendingApprovalCount } = useAutopilot();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const sidebarLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Content Calendar', href: '/calendar', icon: <CalendarDays size={20} /> },
    { label: 'Caption Generator', href: '/captions', icon: <PenLine size={20} /> },
    { label: 'Creative Studio', href: '/studio', icon: <Palette size={20} />, isNew: true },
    { label: 'Festivals & Trends', href: '/festivals', icon: <PartyPopper size={20} /> },
    { label: 'Ad Recommendations', href: '/ads', icon: <Megaphone size={20} /> },
    { label: 'Performance', href: '/performance', icon: <BarChart3 size={20} /> },
    { label: 'Approvals', href: '/approvals', icon: <CheckSquare size={20} />, badgeCount: pendingApprovalCount },
    { label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
      style={{
        background: '#0D0A07',
        borderRight: '1px solid rgba(255,107,53,0.1)',
      }}
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-saffron flex items-center justify-center shadow-lg shadow-brand-orange/20">
          <Sparkles size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-extrabold tracking-tight leading-none bg-gradient-to-r from-[#FF6B35] to-[#FFD166] bg-clip-text text-transparent">
              GrowthOS
            </h1>
            <p className="text-[10px] text-text-muted mt-0.5 uppercase tracking-widest font-medium">
              AI Marketing
            </p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin">
        {!collapsed && (
          <div className="px-3 mb-2">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.1em]">Menu</span>
          </div>
        )}
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname?.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-brand-orange border border-transparent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'
              }`}
              style={isActive ? { background: 'rgba(255,107,53,0.18)' } : {}}
            >
              {/* Active indicator bar */}
              {isMounted && isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-brand-orange rounded-r-full" />
              )}
              <span
                className={`flex-shrink-0 transition-colors ${
                  isActive ? 'text-brand-orange' : 'text-text-muted group-hover:text-text-secondary'
                }`}
              >
                {/* Clone icon with specific size */}
                {React.cloneElement(link.icon as React.ReactElement, { size: 18 })}
              </span>
              {!collapsed && <span>{link.label}</span>}
              {!collapsed && link.isNew && (
                <span className="ml-auto flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                  <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">NEW</span>
                </span>
              )}
              {!collapsed && isMounted && (link.badgeCount ?? 0) > 0 && (
                <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand-gold text-black text-[10px] font-black">
                  {link.badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="font-medium">Collapse Sidebar</span>}
        </button>
      </div>

      {/* Upgrade Banner (collapsed hides it) */}
      {!collapsed && (
        <div className="mx-3 mb-6 p-4 rounded-xl bg-gradient-to-br from-brand-orange/10 to-brand-gold/10 border border-brand-orange/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-brand-gold" />
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Growth Pro</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Autonomous marketing for multi-business scaling.
          </p>
          <button className="mt-3 w-full py-1.5 rounded-lg bg-brand-orange/20 text-[10px] font-bold text-brand-orange hover:bg-brand-orange/30 transition-colors border border-brand-orange/30 uppercase tracking-widest">
            Upgrade Now
          </button>
        </div>
      )}
    </aside>
  );
}
