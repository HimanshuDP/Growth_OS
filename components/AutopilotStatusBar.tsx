'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAutopilot } from '@/context/AutopilotContext';
import { Zap, CheckCircle2, Clock, X, ChevronRight, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';

export default function AutopilotStatusBar() {
  const { isRunning, currentTask, pendingApprovalCount, state, toggleAutopilot } = useAutopilot();
  const [dismissed, setDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || dismissed) return null;

  const isDisabled = !state.isEnabled;

  // Compute next run time
  const tomorrow9am = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return d.toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, weekday: 'short' });
  })();

  const approvedThisWeek = state.pendingApprovals.filter(a => a.status === 'approved').length;

  let barStyle: React.CSSProperties = {};
  let content: React.ReactNode = null;

  if (isDisabled) {
    barStyle = { background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid rgba(255,255,255,0.1)' };
    content = (
      <>
        <span className="text-xs text-white/40">Autopilot is paused. Your marketing runs manually in this mode.</span>
        <button
          onClick={toggleAutopilot}
          className="ml-auto text-xs font-bold px-3 py-1 rounded-lg bg-brand-orange text-white hover:bg-brand-orange/80 transition-colors"
        >
          Enable Autopilot
        </button>
      </>
    );
  } else if (isRunning) {
    barStyle = { background: 'rgba(255,107,53,0.08)', borderLeft: '3px solid #FF6B35' };
    content = (
      <>
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange" />
        </span>
        <span className="text-xs font-medium text-brand-orange/90">
          ⚡ GrowthOS Autopilot is working — <span className="font-normal text-white/70">{currentTask}</span>
        </span>
        <Loader2 size={14} className="ml-auto animate-spin text-brand-orange/60 flex-shrink-0" />
      </>
    );
  } else if (pendingApprovalCount > 0) {
    barStyle = { background: 'rgba(255,209,102,0.08)', borderLeft: '3px solid #FFD166' };
    content = (
      <>
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold" />
        </span>
        <span className="text-xs font-medium text-brand-gold/90">
          ✅ Autopilot prepared{' '}
          <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-black bg-brand-gold text-black rounded-full">
            {pendingApprovalCount}
          </span>{' '}
          item{pendingApprovalCount > 1 ? 's' : ''} for your review
        </span>
        <Link
          href="/approvals"
          className="ml-auto flex items-center gap-1 text-xs font-bold text-brand-gold hover:text-white transition-colors flex-shrink-0"
        >
          Review Now <ChevronRight size={12} />
        </Link>
      </>
    );
  } else {
    barStyle = { background: 'rgba(0,201,167,0.06)', borderLeft: '3px solid #00C9A7' };
    content = (
      <>
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal" />
        </span>
        <span className="text-xs text-brand-teal/80">
          ✓ Autopilot is up to date{approvedThisWeek > 0 ? ` — ${approvedThisWeek} approved this week` : ''} — Next check: {tomorrow9am}
        </span>
        <button
          onClick={toggleAutopilot}
          className="ml-auto flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          {state.isEnabled ? <ToggleRight size={16} className="text-brand-teal" /> : <ToggleLeft size={16} />}
          <span className="hidden md:inline text-[10px]">{state.isEnabled ? 'On' : 'Off'}</span>
        </button>
      </>
    );
  }

  return (
    <div
      className="w-full h-10 flex items-center gap-3 px-4 transition-all duration-300 relative"
      style={barStyle}
    >
      {content}
      <button
        onClick={() => setDismissed(true)}
        className="ml-2 p-1 rounded text-white/20 hover:text-white/50 transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        <X size={12} />
      </button>
    </div>
  );
}
