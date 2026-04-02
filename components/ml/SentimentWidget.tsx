'use client';

import { useState, useRef } from 'react';
import { analyzeSentiment, calculateBrandSentimentScore, isModelCached, type SentimentResult } from '@/lib/ml/sentimentAnalyzer';
import { Brain, Plus, X, ChevronDown, ChevronUp, Loader2, CheckCircle } from 'lucide-react';

const DEFAULT_COMMENTS = [
  'Great products, will order again!',
  'Delivery was slow this time',
  'Amazing quality for the price',
  'Customer service could be better',
  'Totally worth it, love the packaging!',
  'Product was different from the photo',
  'Fast delivery and lovely packaging',
  'A bit expensive but good quality',
];

function CircularGauge({ score, color }: { score: number; color: string }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="180" height="180" className="-rotate-90">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        <circle
          cx="90" cy="90" r={radius} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-white">{score}</span>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

function AnimatedBar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="font-bold text-white">{value}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function SentimentWidget() {
  const [comments, setComments] = useState<string[]>(DEFAULT_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [cached, setCached] = useState(false);
  const [results, setResults] = useState<SentimentResult[] | null>(null);
  const [brandScore, setBrandScore] = useState<ReturnType<typeof calculateBrandSentimentScore> | null>(null);

  const removeComment = (i: number) => setComments(comments.filter((_, idx) => idx !== i));
  const addComment = () => {
    if (newComment.trim()) { setComments([...comments, newComment.trim()]); setNewComment(''); }
  };

  const runAnalysis = async () => {
    if (!comments.length) return;
    setLoading(true);
    setResults(null);
    setBrandScore(null);
    setStatusMsg('Initializing ML model...');
    try {
      const res = await analyzeSentiment(comments, (msg) => {
        setStatusMsg(msg);
        if (msg.includes('cached')) setCached(true);
      });
      if (isModelCached()) setCached(true);
      setResults(res);
      setBrandScore(calculateBrandSentimentScore(res));
      setStatusMsg('');
    } catch (e) {
      setStatusMsg('Error loading model. Check internet connection.');
      console.error(e);
    }
    setLoading(false);
  };

  const getLabelColor = (label: string) =>
    label === 'POSITIVE' ? '#00C9A7' : label === 'NEGATIVE' ? '#FF5757' : '#FFD166';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center">
            <Brain size={18} className="text-teal-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Brand Sentiment Analyzer</h3>
            <p className="text-xs text-slate-500">Analyze customer comments with DistilBERT</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cached && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded-full border border-teal-500/20">
              <CheckCircle size={10} /> Cached
            </span>
          )}
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/25">
            ML Powered
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Comments Section */}
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
            Sample Comments ({comments.length})
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
            {comments.map((c, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <input
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-teal-500/50 transition-colors"
                  value={c}
                  onChange={e => setComments(comments.map((x, j) => j === i ? e.target.value : x))}
                />
                {results?.[i] && (
                  <span
                    className="text-[10px] font-black px-2 py-1 rounded-full flex-shrink-0 border"
                    style={{
                      color: getLabelColor(results[i].label),
                      borderColor: getLabelColor(results[i].label) + '40',
                      backgroundColor: getLabelColor(results[i].label) + '15',
                    }}
                  >
                    {results[i].emoji} {results[i].label} {results[i].score}%
                  </span>
                )}
                <button onClick={() => removeComment(i)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-600 hover:text-red-400">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="flex gap-2 mt-3">
            <input
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-teal-500/50 transition-colors"
              placeholder="Add a customer comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addComment()}
            />
            <button onClick={addComment} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300 transition-colors">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={runAnalysis}
          disabled={loading || !comments.length}
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          style={{ background: loading ? 'rgba(0,201,167,0.1)' : 'linear-gradient(135deg, #00C9A7, #00A3E0)', color: 'white' }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
          {loading ? statusMsg || 'Analyzing...' : 'Analyze Sentiment'}
        </button>

        {loading && (
          <p className="text-xs text-center text-slate-500 -mt-2">
            DistilBERT (~67MB) loads from HuggingFace CDN on first use. Cached locally after.
          </p>
        )}

        {/* Results */}
        {brandScore && results && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Gauge */}
            <div className="flex flex-col items-center gap-3">
              <CircularGauge score={brandScore.score} color={brandScore.color} />
              <div>
                <p className="text-center font-black text-white text-lg">{brandScore.verdict}</p>
                <p className="text-center text-xs text-slate-500 mt-1">Brand Sentiment Score</p>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="space-y-3 bg-slate-950/50 rounded-xl p-4 border border-slate-800">
              <AnimatedBar value={brandScore.breakdown.positive} color="#00C9A7" label="Positive" />
              <AnimatedBar value={brandScore.breakdown.neutral} color="#FFD166" label="Neutral" />
              <AnimatedBar value={brandScore.breakdown.negative} color="#FF5757" label="Negative" />
            </div>

            {/* Insight */}
            <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 text-sm text-teal-100">
              <span className="font-black text-teal-400">AI Insight: </span>
              Your brand shows <strong>{brandScore.verdict}</strong>. {brandScore.breakdown.positive}% of audience
              interactions are positive.{' '}
              {brandScore.score >= 75
                ? 'Keep up the great work and amplify what customers love!'
                : brandScore.score >= 55
                ? 'Address negative feedback promptly to improve brand perception.'
                : 'Prioritize customer satisfaction — respond to all reviews this week.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
