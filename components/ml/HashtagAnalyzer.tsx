'use client';

import { useState } from 'react';
import { scoreHashtagSet, type HashtagScore } from '@/lib/ml/hashtagScorer';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface HashtagAnalyzerProps {
  hashtags: string[];
  captionText: string;
  industry: string;
}

const TIER_STYLES: Record<string, { label: string; bg: string; color: string; border: string }> = {
  mega: { label: 'MEGA', bg: 'rgba(255,87,87,0.12)', color: '#FF5757', border: 'rgba(255,87,87,0.3)' },
  macro: { label: 'MACRO', bg: 'rgba(255,209,102,0.12)', color: '#FFD166', border: 'rgba(255,209,102,0.3)' },
  micro: { label: 'MICRO ⭐', bg: 'rgba(0,201,167,0.12)', color: '#00C9A7', border: 'rgba(0,201,167,0.3)' },
  niche: { label: 'NICHE', bg: 'rgba(91,141,239,0.12)', color: '#5B8DEF', border: 'rgba(91,141,239,0.3)' },
};

function HashtagBadge({ hs }: { hs: HashtagScore }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const style = TIER_STYLES[hs.tier];

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="text-[10px] font-black px-2 py-1 rounded-lg border transition-all hover:brightness-125"
        style={{ background: style.bg, color: style.color, borderColor: style.border }}
      >
        {style.label}
      </button>

      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 w-52 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl z-50 text-left animate-in fade-in zoom-in-95 duration-100">
          <div className="font-black text-white text-xs mb-2">{hs.hashtag}</div>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between"><span className="text-slate-400">Posts</span><span className="text-white font-bold">{hs.estimatedPosts}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Reach</span><span className="text-white font-bold">{hs.reach}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Competition</span><span className="text-white font-bold">{hs.competition}</span></div>
            {hs.indiaRelevant && <div className="text-teal-400">🇮🇳 India relevant</div>}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px]" style={{ color: style.color }}>
            {hs.recommendation === 'use' ? '✅' : hs.recommendation === 'use-sparingly' ? '⚠️' : '❌'} {hs.reason}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HashtagAnalyzer({ hashtags, captionText, industry }: HashtagAnalyzerProps) {
  const [open, setOpen] = useState(false);

  if (!hashtags || hashtags.length === 0) return null;

  const analysis = scoreHashtagSet(hashtags, captionText, industry);

  const overallColor =
    analysis.overallScore >= 70
      ? '#00C9A7'
      : analysis.overallScore >= 50
      ? '#FFD166'
      : '#FF5757';

  return (
    <div className="border-t border-slate-800 mt-4 pt-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info size={13} />
          <span>Hashtag Performance Analysis</span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="font-black text-sm px-2 py-0.5 rounded-lg"
            style={{ color: overallColor, backgroundColor: overallColor + '20' }}
          >
            {analysis.overallScore}/100
          </span>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {open && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mix Analysis */}
          <div className="text-xs text-slate-300 bg-slate-950 border border-slate-800 rounded-xl p-3 leading-relaxed">
            {analysis.mixAnalysis}
          </div>

          {/* Score Bar Chart */}
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Score Distribution</div>
            <div className="flex gap-1 items-end h-12">
              {analysis.scores.map((hs, i) => {
                const style = TIER_STYLES[hs.tier];
                const barH = Math.max(8, (hs.score / 100) * 48);
                return (
                  <div
                    key={i}
                    title={`${hs.hashtag}: ${hs.score}`}
                    className="flex-1 rounded-t transition-all"
                    style={{ height: barH, backgroundColor: style.color + '80' }}
                  />
                );
              })}
            </div>
          </div>

          {/* Hashtag Tier List */}
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tag Breakdown</div>
            <div className="flex flex-wrap gap-2">
              {analysis.scores.map((hs, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">{hs.hashtag}</span>
                  <HashtagBadge hs={hs} />
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-[10px] text-slate-500">
            {Object.entries(TIER_STYLES).map(([key, val]) => (
              <span key={key} className="flex items-center gap-1">
                <span style={{ color: val.color }}>●</span> {val.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
