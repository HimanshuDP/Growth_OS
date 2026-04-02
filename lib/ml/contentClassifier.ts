import { pipeline } from '@xenova/transformers';

let classifier: any = null;

const CONTENT_PILLARS = [
  'educational and informative',
  'promotional and sales-focused',
  'entertaining and humorous',
  'inspirational and motivational',
  'behind the scenes and personal',
  'user-generated content and testimonials',
];

export const PILLAR_MAP: Record<
  string,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  'educational and informative': {
    label: 'Educational',
    color: '#5B8DEF',
    bgColor: 'rgba(91,141,239,0.12)',
    icon: '📚',
  },
  'promotional and sales-focused': {
    label: 'Promotional',
    color: '#FF6B35',
    bgColor: 'rgba(255,107,53,0.12)',
    icon: '🛒',
  },
  'entertaining and humorous': {
    label: 'Entertainment',
    color: '#FFD166',
    bgColor: 'rgba(255,209,102,0.12)',
    icon: '🎭',
  },
  'inspirational and motivational': {
    label: 'Inspirational',
    color: '#00C9A7',
    bgColor: 'rgba(0,201,167,0.12)',
    icon: '✨',
  },
  'behind the scenes and personal': {
    label: 'Behind the Scenes',
    color: '#B47AFF',
    bgColor: 'rgba(180,122,255,0.12)',
    icon: '🎬',
  },
  'user-generated content and testimonials': {
    label: 'Social Proof',
    color: '#FF5F9E',
    bgColor: 'rgba(255,95,158,0.12)',
    icon: '⭐',
  },
};

export async function classifyContent(text: string): Promise<{
  primaryPillar: string;
  confidence: number;
  allScores: Array<{ pillar: string; score: number }>;
  displayProps: (typeof PILLAR_MAP)[string];
}> {
  if (!classifier) {
    classifier = await pipeline(
      'zero-shot-classification',
      'Xenova/nli-deberta-v3-small'
    );
  }

  const result = await classifier(text, CONTENT_PILLARS, { multi_label: false });
  const topPillar = result.labels[0];
  const confidence = Math.round(result.scores[0] * 100);

  return {
    primaryPillar: topPillar,
    confidence,
    allScores: result.labels.map((l: string, i: number) => ({
      pillar: l,
      score: Math.round(result.scores[i] * 100),
    })),
    displayProps: PILLAR_MAP[topPillar] || PILLAR_MAP['educational and informative'],
  };
}
