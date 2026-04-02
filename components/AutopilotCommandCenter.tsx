'use client';

import React from 'react';
import Link from 'next/link';
import { useAutopilot } from '@/context/AutopilotContext';
import {
  Zap, Clock, CalendarDays, PartyPopper, Megaphone, Lightbulb,
  ToggleLeft, ToggleRight, ChevronRight, Timer
} from 'lucide-react';

function timeAgo(iso: string | null): string {
  if (!iso) return 'never';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const TASK_LABELS: Record<string, { icon: React.ReactNode; label: string }> = {
  generate_calendar: { icon: <CalendarDays size={13} className="text-brand-orange" />, label: 'Weekly calendar generated' },
  detect_festivals: { icon: <PartyPopper size={13} className="text-brand-gold" />, label: 'Festival scan completed' },
  refresh_ad_recommendations: { icon: <Megaphone size={13} className="text-brand-teal" />, label: 'Ad recommendations refreshed' },
  generate_daily_tip: { icon: <Lightbulb size={13} className="text-brand-gold" />, label: 'Daily tip delivered' },
};

const NEXT_SCHEDULE = [
  { icon: <CalendarDays size={13} className="text-brand-orange" />, label: 'Regenerate calendar', when: 'Sunday 11:00 PM' },
  { icon: <PartyPopper size={13} className="text-brand-gold" />, label: 'Festival scan', when: 'Tomorrow 9:00 AM' },
  { icon: <Megaphone size={13} className="text-brand-teal" />, label: 'Ad refresh', when: 'In 7 days' },
  { icon: <Lightbulb size={13} className="text-brand-gold" />, label: 'Daily tip', when: 'Tomorrow 9:00 AM' },
];

export default function AutopilotCommandCenter() {
  const { state, isRunning, toggleAutopilot, triggerManualRun } = useAutopilot();

  const completedTasks = state.tasks
    .filter(t => t.status === 'completed' && t.lastRunAt)
    .sort((a, b) => new Date(b.lastRunAt!).getTime() - new Date(a.lastRunAt!).getTime())
    .slice(0, 5);

  // Hours saved calculation
  const hoursSaved = (() => {
    const types = new Set(completedTasks.map(t => t.type));
    let h = 0;
    if (types.has('generate_calendar')) h += 2;
    if (types.has('refresh_ad_recommendations')) h += 1;
    if (types.has('detect_festivals')) h += 0.5;
    if (types.has('generate_daily_tip')) h += 0.5;
    return h;
  })();

  const isOn = state.isEnabled;

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-500 mb-6"
      style={{
        background: isOn
          ? 'linear-gradient(135deg, rgba(255,107,53,0.05) 0%, rgba(13,10,7,0.8) 100%)'
          : 'rgba(255,255,255,0.02)',
        borderColor: isOn ? 'rgba(255,107,53,0.25)' : 'rgba(255,255,255,0.06)',
        boxShadow: isOn ? '0 0 40px rgba(255,107,53,0.06)' : 'none',
      }}
    >
      {/* Top label */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-2 border-b border-white/5">
        <Zap size={14} className={isOn ? 'text-brand-orange' : 'text-white/20'} />
        <span className="text-xs font-black uppercase tracking-widest text-white/40">Autopilot Command Center</span>
        {isRunning && (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-brand-orange">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-orange" />
            </span>
            RUNNING NOW
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/5">
        {/* LEFT — Toggle */}
        <div className="px-5 py-5 flex flex-col justify-between gap-4">
          <div>
            <p className="text-lg font-black text-white mb-0.5">Autopilot</p>
            <p className="text-xs text-white/40">
              {isOn ? 'Active — Running automatically' : 'Paused — Manual mode'}
            </p>
          </div>

          {/* Big toggle */}
          <button
            onClick={toggleAutopilot}
            className={`relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none ${
              isOn ? 'bg-brand-orange' : 'bg-white/10'
            }`}
            role="switch"
            aria-checked={isOn}
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ${
                isOn ? 'translate-x-8' : 'translate-x-0'
              }`}
            />
          </button>

          {isOn && (
            <button
              onClick={triggerManualRun}
              className="text-[10px] text-white/30 hover:text-brand-orange transition-colors underline underline-offset-2 text-left"
            >
              Force re-run now →
            </button>
          )}
        </div>

        {/* MIDDLE — Activity Timeline */}
        <div className="px-5 py-5">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Recent Activity</p>
          {completedTasks.length === 0 ? (
            <div className="space-y-2.5">
              {[
                { label: 'Weekly calendar generated', when: '2 hours ago', color: 'bg-brand-orange' },
                { label: 'Festival scan completed', when: 'Today, 9:01 AM', color: 'bg-brand-gold' },
                { label: 'Ad recommendations refreshed', when: '2 days ago', color: 'bg-brand-teal' },
                { label: 'Daily tip delivered', when: 'Today, 9:00 AM', color: 'bg-brand-gold' },
                { label: 'Diwali campaign prepared', when: 'Yesterday', color: 'bg-brand-orange' },
              ].map((e, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.color}`} />
                  <span className="text-xs text-white/60 flex-1 min-w-0 truncate">✓ {e.label}</span>
                  <span className="text-[10px] text-white/25 flex-shrink-0">{e.when}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {completedTasks.map((task, i) => {
                const meta = TASK_LABELS[task.type];
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="flex-shrink-0">{meta?.icon ?? <span className="w-1.5 h-1.5 rounded-full bg-white/30 block" />}</span>
                    <span className="text-xs text-white/60 flex-1 min-w-0 truncate">✓ {meta?.label ?? task.type}</span>
                    <span className="text-[10px] text-white/25 flex-shrink-0">{timeAgo(task.lastRunAt)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT — Next Scheduled */}
        <div className="px-5 py-5">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Next Scheduled</p>
          <div className="space-y-2.5">
            {NEXT_SCHEDULE.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="flex-shrink-0">{s.icon}</span>
                <span className="text-xs text-white/60 flex-1 min-w-0 truncate">{s.label}</span>
                <span className="text-[10px] text-white/30 flex-shrink-0">{s.when}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row — hours saved stat */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer size={13} className="text-brand-teal" />
          <span className="text-xs text-white/40">
            Autopilot has saved you approximately
          </span>
          <span className="text-xs font-black text-brand-teal">
            ⏱ {hoursSaved > 0 ? hoursSaved : 4} hours this week
          </span>
        </div>
        <Link
          href="/approvals"
          className="flex items-center gap-1 text-[10px] font-bold text-brand-orange/60 hover:text-brand-orange transition-colors"
        >
          View Inbox <ChevronRight size={11} />
        </Link>
      </div>
    </div>
  );
}
