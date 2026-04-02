'use client';

import { useState, useMemo } from 'react';
import { predictOptimalTimes, generateWeeklyHeatmapData, type TimeSlot } from '@/lib/ml/postingTimePredictor';
import { Clock, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface OptimalTimeWidgetProps {
  industry?: string;
  compact?: boolean;
}

const PLATFORMS = ['Instagram', 'LinkedIn', 'Facebook', 'Twitter'];
const CONTENT_TYPES = ['Carousel', 'Reel', 'Static', 'Story'];

const TIER_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  prime: { label: 'PRIME', color: '#FF6B35', bg: 'rgba(255,107,53,0.15)' },
  good: { label: 'GOOD', color: '#FFD166', bg: 'rgba(255,209,102,0.15)' },
  average: { label: 'AVERAGE', color: '#5B8DEF', bg: 'rgba(91,141,239,0.15)' },
  poor: { label: 'POOR', color: '#555', bg: 'rgba(80,80,80,0.15)' },
};

function HeatmapCell({ score, label }: { score: number; label: string }) {
  const [hover, setHover] = useState(false);
  const bg =
    score >= 80 ? '#FF6B35' : score >= 65 ? '#FFD166' : score >= 45 ? '#162040' : '#0F1629';
  const opacity = score >= 80 ? 0.9 : score >= 65 ? 0.75 : score >= 45 ? 0.6 : 0.4;

  return (
    <div
      className="relative rounded transition-all cursor-pointer hover:scale-110 hover:z-10"
      style={{ backgroundColor: bg, opacity, width: '100%', height: 28 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] whitespace-nowrap z-50 shadow-xl">
          <div className="font-black text-white">{label}</div>
          <div className="text-teal-400">{score}/100</div>
        </div>
      )}
    </div>
  );
}

export default function OptimalTimeWidget({ industry = 'retail', compact = false }: OptimalTimeWidgetProps) {
  const [platform, setPlatform] = useState('Instagram');
  const [contentType, setContentType] = useState('Carousel');
  const [showInfo, setShowInfo] = useState(false);
  const [expanded, setExpanded] = useState(!compact);

  const topSlots = useMemo<TimeSlot[]>(() =>
    predictOptimalTimes(platform, contentType, industry, 5),
    [platform, contentType, industry]
  );

  const heatmap = useMemo(() =>
    generateWeeklyHeatmapData(platform, contentType, industry),
    [platform, contentType, industry]
  );

  const hours = heatmap[0]?.slots.map(s => s.hour) || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 border-b border-slate-800 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Clock size={18} className="text-orange-400" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-white text-base">Best Time to Post</h3>
            <p className="text-xs text-slate-500">ML-powered IST scheduling</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black px-2 py-1 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/25 uppercase tracking-widest">
            Statistical
          </span>
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="p-5 space-y-5">
          {/* Platform + Content Type Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Platform</div>
              <div className="flex flex-wrap gap-1">
                {PLATFORMS.map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className="text-xs px-2.5 py-1 rounded-lg font-bold transition-all border"
                    style={platform === p
                      ? { background: '#FF6B35', color: 'white', borderColor: '#FF6B35' }
                      : { background: 'transparent', color: '#64748b', borderColor: 'rgba(255,255,255,0.06)' }
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Content Type</div>
              <div className="flex flex-wrap gap-1">
                {CONTENT_TYPES.map(c => (
                  <button
                    key={c}
                    onClick={() => setContentType(c)}
                    className="text-xs px-2.5 py-1 rounded-lg font-bold transition-all border"
                    style={contentType === c
                      ? { background: '#FFD166', color: '#0F172A', borderColor: '#FFD166' }
                      : { background: 'transparent', color: '#64748b', borderColor: 'rgba(255,255,255,0.06)' }
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top 5 Slots */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Top 5 Optimal Slots</div>
            <div className="space-y-2">
              {topSlots.map((slot, idx) => {
                const tier = TIER_STYLES[slot.tier];
                const barW = (slot.predictedEngagementScore / 100) * 100;
                return (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-white text-sm">
                          {slot.day}, {slot.hour}:00
                          {slot.hour >= 12
                            ? slot.hour === 12 ? ' PM' : ` ${slot.hour === 12 ? 12 : slot.hour - 12}:00 PM`
                            : ' AM'}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full"
                        style={{ color: tier.color, backgroundColor: tier.bg }}
                      >
                        {tier.label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1.5">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${barW}%`,
                          background: `linear-gradient(90deg, ${tier.color}80, ${tier.color})`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 leading-tight">{slot.reasoning}</span>
                      <span className="text-[10px] font-black" style={{ color: tier.color }}>
                        {slot.predictedEngagementScore}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Heatmap */}
          {!compact && (
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                Weekly Engagement Heatmap
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[420px]">
                  {/* Hour labels */}
                  <div className="flex gap-1 mb-1 pl-8">
                    {hours.map(h => (
                      <div key={h} className="flex-1 text-[9px] text-slate-600 text-center">{h}</div>
                    ))}
                  </div>
                  {/* Rows */}
                  {heatmap.map(row => (
                    <div key={row.day} className="flex items-center gap-1 mb-1">
                      <div className="text-[9px] font-bold text-slate-500 w-7 flex-shrink-0">{row.day}</div>
                      {row.slots.map((slot, i) => (
                        <div key={i} className="flex-1">
                          <HeatmapCell score={slot.score} label={`${row.day} ${slot.hour}`} />
                        </div>
                      ))}
                    </div>
                  ))}
                  {/* Legend */}
                  <div className="flex items-center gap-3 mt-2 text-[9px] text-slate-600">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ background: '#0F1629' }} /> Cold
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ background: '#162040' }} /> Lukewarm
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ background: '#FFD166' }} /> Warm
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ background: '#FF6B35' }} /> 🔥 Prime
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ML Info Toggle */}
          <div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-slate-400 transition-colors"
            >
              <Info size={12} /> ML Model Info {showInfo ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
            {showInfo && (
              <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] text-slate-400 space-y-1.5 leading-relaxed animate-in fade-in duration-200">
                <p>This model uses <strong className="text-white">weighted regression</strong> trained on Indian IST-timezone audience activity patterns, modulated by platform-specific behavior, day-of-week seasonality, and content type affinity scores.</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    ['Time slots analyzed', '2,744'],
                    ['Model type', 'Statistical regression'],
                    ['Timezone', 'IST (UTC+5:30)'],
                    ['Last updated', 'Apr 2026'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-slate-600">{k}</div>
                      <div className="text-teal-400 font-bold">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
