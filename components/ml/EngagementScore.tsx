'use client';

import { useEffect, useState, useRef } from 'react';
import { predictEngagement, extractFeatures, trainModel, isModelTrained, type PredictionResult } from '@/lib/ml/engagementPredictor';
import { Zap } from 'lucide-react';

interface EngagementScoreProps {
  caption: string;
  platform: string;
}

function CircularArc({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 65 ? '#00C9A7' : score >= 40 ? '#FFD166' : '#FF5757';

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
      />
    </svg>
  );
}

export default function EngagementScore({ caption, platform }: EngagementScoreProps) {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [training, setTraining] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const timerRef = useRef<any>(null);
  const animRef = useRef<any>(null);

  // Pre-train model on mount
  useEffect(() => {
    if (!isModelTrained()) {
      setTraining(true);
      trainModel().then(() => setTraining(false));
    }
  }, []);

  // Debounced prediction when caption changes
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!caption.trim() || caption.length < 10) return;

    timerRef.current = setTimeout(async () => {
      const features = extractFeatures(caption, platform);
      const res = await predictEngagement(features);
      setResult(res);

      // Animate score from 0
      let current = 0;
      if (animRef.current) clearInterval(animRef.current);
      animRef.current = setInterval(() => {
        current += 2;
        if (current >= res.score) { setDisplayScore(res.score); clearInterval(animRef.current); }
        else setDisplayScore(current);
      }, 16);
    }, 500);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [caption, platform]);

  const color = displayScore >= 65 ? '#00C9A7' : displayScore >= 40 ? '#FFD166' : '#FF5757';

  if (training) {
    return (
      <div className="relative flex flex-col items-center gap-1 w-20">
        <div className="w-20 h-20 rounded-full border border-slate-700 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <span className="text-[9px] text-slate-500 text-center">Training...</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center gap-1 opacity-40">
        <div className="w-20 h-20 rounded-full border border-dashed border-slate-700 flex items-center justify-center">
          <Zap size={16} className="text-slate-600" />
        </div>
        <span className="text-[9px] text-slate-600">ML Score</span>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center gap-1 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Arc Meter */}
      <div className="relative w-20 h-20">
        <CircularArc score={displayScore} size={80} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black" style={{ color }}>{displayScore}</span>
        </div>
      </div>
      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Engagement</span>
      <span className="text-[8px] text-slate-600">ML Powered</span>

      {/* Hover Tooltip */}
      {hovered && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-white">Engagement Breakdown</span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ color, backgroundColor: color + '20' }}>
              {result.score}/100
            </span>
          </div>

          {/* Mini breakdown bars */}
          {[
            { label: 'Hook Strength', val: result.breakdown.hookStrength },
            { label: 'CTA Strength', val: result.breakdown.ctaStrength },
            { label: 'Hashtags', val: result.breakdown.hashtagOptimization },
            { label: 'Length', val: result.breakdown.lengthOptimization },
          ].map(({ label, val }) => (
            <div key={label} className="mb-2">
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-slate-400">{label}</span>
                <span className="text-white font-bold">{val}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all" style={{ width: `${val}%` }} />
              </div>
            </div>
          ))}

          {/* Top tip */}
          {result.tips[0] && (
            <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-teal-300 leading-relaxed">
              💡 {result.tips[0]}
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-500">
            <span>CTR: <strong className="text-slate-300">{result.predictedCTR}</strong></span>
            <span>Reach: <strong className="text-slate-300">{result.predictedReach}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
