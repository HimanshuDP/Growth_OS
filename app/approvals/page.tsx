'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAutopilot } from '@/context/AutopilotContext';
import { ApprovalItem } from '@/lib/autopilot';
import {
  CheckCircle2, CalendarDays, PartyPopper, Megaphone,
  ChevronDown, ChevronUp, Edit3, Clock, Sparkles, X
} from 'lucide-react';

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function CalendarCard({ item, onApprove, onSkip }: { item: ApprovalItem; onApprove: () => void; onSkip: () => void }) {
  const days = item.data?.posts || item.data?.calendar || [];
  const weekOf = item.data?.weekStartDate
    ? new Date(item.data.weekStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : 'this week';

  if (item.status === 'approved') {
    return (
      <div className="rounded-2xl border border-brand-teal/30 bg-brand-teal/5 p-5 flex items-center gap-3">
        <CheckCircle2 className="text-brand-teal" size={22} />
        <div>
          <p className="font-bold text-brand-teal">Calendar Saved to Your Schedule</p>
          <p className="text-xs text-white/50 mt-0.5">Approved {timeAgo(item.generatedAt)}</p>
        </div>
      </div>
    );
  }

  if (item.status === 'skipped') {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5 flex items-center gap-3 opacity-50">
        <X size={18} className="text-white/40" />
        <p className="text-sm text-white/40">Calendar skipped for this week.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-orange/25 bg-gradient-to-br from-brand-orange/5 to-transparent overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <CalendarDays size={18} className="text-brand-orange" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm">{item.title}</p>
          <p className="text-xs text-white/50 mt-0.5">7-day plan for w/c {weekOf} — Review each day below</p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-brand-teal/20 text-brand-teal border border-brand-teal/30">
          AUTO-GENERATED
        </span>
      </div>

      {/* Mini calendar preview */}
      <div className="px-5 py-4">
        {days.length > 0 ? (
          <div className="grid grid-cols-7 gap-1.5">
            {days.slice(0, 7).map((day: any, i: number) => {
              const dayName = day.day || day.dayName || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i];
              const theme = day.theme || day.caption?.slice(0, 30) || 'Content';
              const time = day.time || day.scheduledTime || '9:00 AM';
              return (
                <div key={i} className="rounded-lg bg-white/5 border border-white/8 p-2 text-center">
                  <p className="text-[10px] font-black text-brand-orange/80 uppercase">{dayName}</p>
                  <p className="text-[9px] text-white/60 mt-1 leading-tight line-clamp-2">{theme}</p>
                  <p className="text-[9px] text-white/30 mt-1">{time}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-white/40 italic">Calendar preview not available — approve to save.</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 px-5 py-4 border-t border-white/5 bg-black/20">
        <button
          onClick={onApprove}
          className="flex-1 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-bold hover:bg-brand-orange/80 transition-colors shadow-lg shadow-brand-orange/20"
        >
          ✓ Approve & Save Calendar
        </button>
        <button
          onClick={onSkip}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:text-white hover:bg-white/10 transition-colors"
        >
          Skip This Week
        </button>
      </div>
    </div>
  );
}

function FestivalCard({ item, onApprove, onSkip }: { item: ApprovalItem; onApprove: () => void; onSkip: () => void }) {
  const f = item.data || {};
  const isUrgent = (f.daysUntil ?? 10) <= 7;

  if (item.status !== 'pending') {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5 flex items-center gap-3 opacity-60">
        <CheckCircle2 size={18} className="text-brand-teal" />
        <p className="text-sm text-white/50">{item.title} — {item.status}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-gold/25 bg-gradient-to-br from-brand-gold/5 to-transparent overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <PartyPopper size={18} className="text-brand-gold" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm">{item.title}</p>
          <p className="text-xs text-white/50 mt-0.5">{item.preview}</p>
        </div>
        {isUrgent && (
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            URGENT
          </span>
        )}
      </div>

      <div className="px-5 py-4 space-y-3">
        {f.campaignIdea && (
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Campaign Idea</p>
            <p className="text-sm text-white/80">{f.campaignIdea}</p>
          </div>
        )}
        {f.sampleCaption && (
          <div className="bg-white/5 rounded-xl p-3 border border-white/8">
            <p className="text-[10px] font-bold text-brand-gold/60 uppercase tracking-wider mb-1">Sample Caption</p>
            <p className="text-sm text-white/70 italic">"{f.sampleCaption}"</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 px-5 py-4 border-t border-white/5 bg-black/20">
        <button
          onClick={onApprove}
          className="flex-1 py-2.5 rounded-xl bg-brand-gold text-black text-sm font-bold hover:bg-brand-gold/80 transition-colors"
        >
          ✓ Approve Campaign
        </button>
        <button
          onClick={onSkip}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:text-white hover:bg-white/10 transition-colors"
        >
          Skip Festival
        </button>
      </div>
    </div>
  );
}

function AdRecsCard({ item, onApprove, onSkip }: { item: ApprovalItem; onApprove: () => void; onSkip: () => void }) {
  if (item.status !== 'pending') {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5 flex items-center gap-3 opacity-60">
        <CheckCircle2 size={18} className="text-brand-teal" />
        <p className="text-sm text-white/50">Ad Recommendations — {item.status}</p>
      </div>
    );
  }
  const recs = item.data?.recommendations || item.data?.campaigns || [];
  return (
    <div className="rounded-2xl border border-brand-teal/25 bg-gradient-to-br from-brand-teal/5 to-transparent overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <Megaphone size={18} className="text-brand-teal" />
        <div className="flex-1">
          <p className="font-bold text-white text-sm">{item.title}</p>
          <p className="text-xs text-white/50 mt-0.5">New ad strategies generated for your business</p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-brand-teal/20 text-brand-teal border border-brand-teal/30">
          NEW
        </span>
      </div>
      <div className="px-5 py-4 space-y-2">
        {recs.slice(0, 2).map((rec: any, i: number) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/8">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{rec.platform || rec.title || 'Campaign'}</p>
              <p className="text-xs text-white/50">{rec.budget || ''} {rec.projectedROAS ? `· ROAS ${rec.projectedROAS}` : ''}</p>
            </div>
          </div>
        ))}
        {recs.length === 0 && <p className="text-xs text-white/40 italic">View in Ad Recommendations for full details.</p>}
      </div>
      <div className="flex items-center gap-3 px-5 py-4 border-t border-white/5 bg-black/20">
        <button onClick={onApprove} className="flex-1 py-2.5 rounded-xl bg-brand-teal text-black text-sm font-bold hover:bg-brand-teal/80 transition-colors">
          ✓ Save Recommendations
        </button>
        <Link href="/ads" className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:text-white hover:bg-white/10 transition-colors text-center">
          View Full Report
        </Link>
        <button onClick={onSkip} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:text-white hover:bg-white/10 transition-colors">
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default function ApprovalsPage() {
  const { state, approveItem, skipItem, isRunning } = useAutopilot();
  const [showApproved, setShowApproved] = useState(false);

  const pending = state.pendingApprovals.filter(a => a.status === 'pending');
  const approved = state.pendingApprovals.filter(a => a.status !== 'pending');
  const approvedCount = approved.filter(a => a.status === 'approved').length;

  const approveAll = () => {
    pending.forEach(a => approveItem(a.id));
  };

  const lastRunText = state.lastFullRunAt
    ? timeAgo(state.lastFullRunAt)
    : 'never';

  const renderItem = (item: ApprovalItem) => {
    switch (item.type) {
      case 'calendar':
        return <CalendarCard key={item.id} item={item} onApprove={() => approveItem(item.id)} onSkip={() => skipItem(item.id)} />;
      case 'festival_campaign':
        return <FestivalCard key={item.id} item={item} onApprove={() => approveItem(item.id)} onSkip={() => skipItem(item.id)} />;
      case 'ad_recommendation':
        return <AdRecsCard key={item.id} item={item} onApprove={() => approveItem(item.id)} onSkip={() => skipItem(item.id)} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Your Approval Inbox</h1>
          <p className="text-sm text-white/50 mt-1">
            GrowthOS prepared these for you. Review, edit, or approve in one click.
          </p>
        </div>
        {pending.length > 0 && (
          <button
            onClick={approveAll}
            className="flex-shrink-0 px-4 py-2 rounded-xl bg-brand-orange text-white text-sm font-bold hover:bg-brand-orange/80 transition-colors shadow-lg shadow-brand-orange/20"
          >
            Approve All ({pending.length})
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending', value: pending.length, color: 'text-brand-gold' },
          { label: 'Approved this week', value: approvedCount, color: 'text-brand-teal' },
          { label: 'Auto-posted (simulated)', value: approvedCount, color: 'text-brand-orange' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-white/8 bg-white/3 px-4 py-3 text-center">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Items */}
      {pending.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center mb-5">
            <CheckCircle2 size={28} className="text-brand-teal" />
          </div>
          <h2 className="text-xl font-extrabold text-white mb-2">You're all caught up! 🎉</h2>
          <p className="text-sm text-white/50 max-w-xs">
            GrowthOS is working in the background. Check back tomorrow for your next batch.
          </p>
          <div className="flex items-center gap-3 mt-6 text-xs text-white/30">
            <Clock size={12} />
            <span>Last run: {lastRunText}</span>
            <span>·</span>
            <span>Next scheduled: Tomorrow, 9:00 AM</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map(item => renderItem(item))}
        </div>
      )}

      {/* Approved Section (accordion) */}
      {approved.length > 0 && (
        <div className="rounded-2xl border border-white/8 overflow-hidden">
          <button
            onClick={() => setShowApproved(!showApproved)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-white/50 hover:text-white hover:bg-white/3 transition-colors"
          >
            <span>Previously Approved this week ({approved.length})</span>
            {showApproved ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showApproved && (
            <div className="border-t border-white/5 px-5 py-4 space-y-3">
              {approved.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <CheckCircle2 size={14} className="text-brand-teal flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 truncate">{item.title}</p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)} · {timeAgo(item.generatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
