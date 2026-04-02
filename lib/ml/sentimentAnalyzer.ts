import { pipeline } from '@xenova/transformers';

let classifier: any = null;
let modelCached = false;

export async function loadSentimentModel(onProgress?: (msg: string) => void) {
  if (!classifier) {
    if (onProgress) onProgress('Loading ML model... (first time takes ~10 seconds)');
    classifier = await pipeline(
      'sentiment-analysis',
      'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
      { quantized: true }
    );
    modelCached = true;
    if (onProgress) onProgress('Model cached — instant analysis next time ✓');
  }
  return classifier;
}

export function isModelCached() {
  return modelCached;
}

export interface SentimentResult {
  text: string;
  label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  score: number;
  emoji: string;
}

export async function analyzeSentiment(
  texts: string[],
  onProgress?: (msg: string) => void
): Promise<SentimentResult[]> {
  const model = await loadSentimentModel(onProgress);
  const results = await model(texts);
  return results.map((r: any, i: number) => ({
    text: texts[i],
    label: r.score > 0.85 ? r.label : 'NEUTRAL',
    score: Math.round(r.score * 100),
    emoji: r.label === 'POSITIVE' ? '😊' : r.label === 'NEGATIVE' ? '😞' : '😐',
  }));
}

export function calculateBrandSentimentScore(results: SentimentResult[]): {
  score: number;
  breakdown: { positive: number; neutral: number; negative: number };
  verdict: string;
  color: string;
} {
  const pos = results.filter((r) => r.label === 'POSITIVE').length;
  const neg = results.filter((r) => r.label === 'NEGATIVE').length;
  const neu = results.filter((r) => r.label === 'NEUTRAL').length;
  const total = results.length || 1;
  const score = Math.round(((pos * 1 + neu * 0.5) / total) * 100);
  return {
    score,
    breakdown: {
      positive: Math.round((pos / total) * 100),
      neutral: Math.round((neu / total) * 100),
      negative: Math.round((neg / total) * 100),
    },
    verdict:
      score >= 75
        ? 'Excellent Brand Sentiment'
        : score >= 55
        ? 'Positive Reception'
        : score >= 40
        ? 'Mixed Signals'
        : 'Needs Attention',
    color: score >= 75 ? '#00C9A7' : score >= 55 ? '#FFD166' : '#FF5757',
  };
}
