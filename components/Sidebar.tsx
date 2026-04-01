'use client';

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
} from 'lucide-react';
import { useState } from 'react';

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const sidebarLinks: SidebarLink[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Content Calendar', href: '/calendar', icon: <CalendarDays size={20} /> },
  { label: 'Caption Generator', href: '/captions', icon: <PenLine size={20} /> },
  { label: 'Festivals & Trends', href: '/festivals', icon: <PartyPopper size={20} /> },
  { label: 'Ad Recommendations', href: '/ads', icon: <Megaphone size={20} /> },
  { label: 'Performance', href: '/performance', icon: <BarChart3 size={20} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        borderRight: '1px solid rgba(99, 102, 241, 0.15)',
      }}
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">
              GrowthOS
            </h1>
            <p className="text-[11px] text-indigo-300/70 mt-0.5">
              AI Marketing Engine
            </p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname?.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-500/15 text-indigo-300 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-400" />
              )}
              <span
                className={`flex-shrink-0 transition-colors ${
                  isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              >
                {link.icon}
              </span>
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>

      {/* Upgrade Banner (collapsed hides it) */}
      {!collapsed && (
        <div className="mx-3 mb-4 p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-amber-500/10 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs font-semibold text-amber-300">PRO</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Unlock advanced AI insights, unlimited captions & priority support.
          </p>
          <button className="mt-3 w-full py-1.5 rounded-lg bg-indigo-500/20 text-xs font-medium text-indigo-300 hover:bg-indigo-500/30 transition-colors border border-indigo-500/30">
            Upgrade Plan
          </button>
        </div>
      )}
    </aside>
  );
}
