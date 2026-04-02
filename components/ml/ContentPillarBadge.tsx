'use client';

import { useEffect, useState } from 'react';
import { classifyContent, PILLAR_MAP } from '@/lib/ml/contentClassifier';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface ContentPillarBadgeProps {
  captionText: string;
  aiSuggestedPillar?: string;
}

export default function ContentPillarBadge({ captionText, aiSuggestedPillar }: ContentPillarBadgeProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof classifyContent>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!captionText || captionText.trim().length < 20) return;
    setLoading(true);
    setError(null);

    classifyContent(captionText)
      .then(setResult)
      .catch(e => {
        console.error('Content classifier error:', e);
        setError('Model loading failed — check internet connection');
      })
      .finally(() => setLoading(false));
  }, [captionText]);

  if (loading) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <Loader2 size={16} className="text-blue-400 animate-spin flex-shrink-0" />
        <div>
          <div className="text-xs font-bold text-white">Classifying Content Pillar...</div>
          <div className="text-[10px] text-slate-500 mt-0.5">DeBERTa zero-shot model loading (~45MB, first use)</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-xs text-red-400">
        <AlertTriangle size={14} />
        <span>{error}</span>
      </div>
    );
  }

  if (!result) return null;

  const { displayProps, primaryPillar, confidence } = result;

  // Check if ML matches AI suggestion
  const aiPillarLower = aiSuggestedPillar?.toLowerCase() || '';
  const mlPillarLower = displayProps.label.toLowerCase();
  const matches = aiPillarLower.length > 0 && mlPillarLower.includes(aiPillarLower.split(' ')[0]);

  return (
    <div className="space-y-3">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        ML Content Intelligence
      </div>

      <div
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-bold"
        style={{
          color: displayProps.color,
          backgroundColor: displayProps.bgColor,
          borderColor: displayProps.color + '40',
        }}
      >
        <span>{displayProps.icon}</span>
        <span>{displayProps.label}</span>
        <span
          className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: displayProps.color + '25' }}
        >
          {confidence}%
        </span>
      </div>

      {/* ML vs AI badge */}
      {aiSuggestedPillar && (
        <div className="flex items-center gap-2">
          {matches ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-black text-teal-400 bg-teal-500/10 px-2 py-1 rounded-full border border-teal-500/20">
              <CheckCircle size={10} /> ML Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
              <AlertTriangle size={10} /> ML Suggests: {displayProps.label}
            </span>
          )}
        </div>
      )}

      {/* Score breakdown */}
      <div className="space-y-1.5">
        {result.allScores.slice(0, 3).map(({ pillar, score }) => {
          const props = PILLAR_MAP[pillar];
          return (
            <div key={pillar} className="flex items-center gap-2">
              <div className="text-[10px] text-slate-400 w-32 truncate">{props?.label || pillar}</div>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${score}%`, backgroundColor: props?.color || '#666' }}
                />
              </div>
              <div className="text-[10px] font-bold text-slate-400 w-8 text-right">{score}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
