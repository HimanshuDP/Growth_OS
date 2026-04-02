import * as tf from '@tensorflow/tfjs';

export interface CaptionFeatures {
  length: number;
  hashtagCount: number;
  hasEmoji: boolean;
  hasQuestion: boolean;
  hasCTA: boolean;
  hasFestivalHook: boolean;
  hasPrice: boolean;
  sentenceCount: number;
  platform: 'instagram' | 'linkedin' | 'facebook' | 'twitter';
}

export interface PredictionResult {
  score: number;
  predictedCTR: string;
  predictedReach: 'High' | 'Medium' | 'Low';
  tips: string[];
  breakdown: {
    hookStrength: number;
    ctaStrength: number;
    hashtagOptimization: number;
    lengthOptimization: number;
  };
}

export function extractFeatures(caption: string, platform: string): CaptionFeatures {
  const emojiRegex = /[\u{1F300}-\u{1FFFF}]|[\u{2600}-\u{26FF}]/gu;
  const ctaWords = [
    'buy', 'shop', 'order', 'click', 'visit', 'call', 'dm',
    'link in bio', 'book now', 'get', 'grab', 'try',
  ];
  const festivalWords = [
    'diwali', 'holi', 'eid', 'christmas', 'navratri', 'ganesh',
    'onam', 'baisakhi', 'festival', 'celebration',
  ];

  return {
    length: caption.length,
    hashtagCount: (caption.match(/#\w+/g) || []).length,
    hasEmoji: emojiRegex.test(caption),
    hasQuestion: caption.includes('?'),
    hasCTA: ctaWords.some((word) => caption.toLowerCase().includes(word)),
    hasFestivalHook: festivalWords.some((word) => caption.toLowerCase().includes(word)),
    hasPrice:
      caption.includes('₹') ||
      caption.toLowerCase().includes('price') ||
      caption.toLowerCase().includes('off'),
    sentenceCount: caption.split(/[.!?]+/).filter((s) => s.trim().length > 0).length,
    platform: platform.toLowerCase() as any,
  };
}

function generateTrainingData() {
  const samples = [];
  for (let i = 0; i < 200; i++) {
    const length = Math.random() * 400 + 50;
    const hashtags = Math.floor(Math.random() * 20);
    const hasEmoji = Math.random() > 0.4;
    const hasQuestion = Math.random() > 0.5;
    const hasCTA = Math.random() > 0.4;
    const hasFestival = Math.random() > 0.7;
    const hasPrice = Math.random() > 0.6;

    let score = 40;
    if (length >= 100 && length <= 220) score += 15;
    else if (length > 300) score -= 10;
    if (hashtags >= 8 && hashtags <= 15) score += 12;
    else if (hashtags > 20) score -= 8;
    if (hasEmoji) score += 8;
    if (hasQuestion) score += 10;
    if (hasCTA) score += 12;
    if (hasFestival) score += 10;
    if (hasPrice) score += 6;
    score += (Math.random() - 0.5) * 15;
    score = Math.max(10, Math.min(95, score));

    samples.push({
      input: [
        length / 500,
        hashtags / 20,
        hasEmoji ? 1 : 0,
        hasQuestion ? 1 : 0,
        hasCTA ? 1 : 0,
        hasFestival ? 1 : 0,
        hasPrice ? 1 : 0,
      ],
      output: [score / 100],
    });
  }
  return samples;
}

let model: tf.Sequential | null = null;
let isTraining = false;

export async function trainModel(): Promise<void> {
  if (isTraining) return;
  isTraining = true;
  const data = generateTrainingData();
  const xs = tf.tensor2d(data.map((d) => d.input));
  const ys = tf.tensor2d(data.map((d) => d.output));

  model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [7], units: 16, activation: 'relu' }),
      tf.layers.dense({ units: 8, activation: 'relu' }),
      tf.layers.dense({ units: 1, activation: 'sigmoid' }),
    ],
  });

  model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });
  await model.fit(xs, ys, { epochs: 50, verbose: 0 });
  xs.dispose();
  ys.dispose();
  isTraining = false;
}

export function isModelTrained(): boolean {
  return model !== null;
}

export async function predictEngagement(features: CaptionFeatures): Promise<PredictionResult> {
  if (!model) await trainModel();

  const platformBoost =
    features.platform === 'instagram' ? 1.05 : features.platform === 'facebook' ? 0.95 : 1.0;

  const input = tf.tensor2d([
    [
      features.length / 500,
      features.hashtagCount / 20,
      features.hasEmoji ? 1 : 0,
      features.hasQuestion ? 1 : 0,
      features.hasCTA ? 1 : 0,
      features.hasFestivalHook ? 1 : 0,
      features.hasPrice ? 1 : 0,
    ],
  ]);

  const prediction = model!.predict(input) as tf.Tensor;
  const rawScore = (await prediction.data())[0] * platformBoost;
  const score = Math.round(Math.min(98, rawScore * 100));
  input.dispose();
  prediction.dispose();

  const tips: string[] = [];
  if (features.length < 80)
    tips.push('Caption is too short — aim for 100-200 characters for best engagement');
  if (features.length > 280)
    tips.push('Caption may be too long — consider trimming for better readability');
  if (features.hashtagCount < 6)
    tips.push('Add more hashtags — 8-12 is optimal for Instagram');
  if (features.hashtagCount > 18)
    tips.push('Too many hashtags can look spammy — keep it under 15');
  if (!features.hasEmoji && features.platform !== 'linkedin')
    tips.push('Add 1-2 relevant emojis to increase visual appeal');
  if (!features.hasQuestion) tips.push('End with a question to boost comment engagement');
  if (!features.hasCTA)
    tips.push('Add a clear call-to-action (e.g. "Shop now", "DM us", "Link in bio")');
  if (tips.length === 0) tips.push('Great caption! This looks optimized for high engagement.');

  return {
    score,
    predictedCTR: `${(score * 0.038).toFixed(1)}%`,
    predictedReach: score >= 75 ? 'High' : score >= 50 ? 'Medium' : 'Low',
    tips,
    breakdown: {
      hookStrength: features.hasQuestion
        ? Math.min(100, score + 10)
        : Math.max(20, score - 15),
      ctaStrength: features.hasCTA
        ? Math.min(100, score + 5)
        : Math.max(15, score - 20),
      hashtagOptimization:
        features.hashtagCount >= 8 && features.hashtagCount <= 15
          ? Math.min(100, score + 8)
          : Math.max(20, score - 10),
      lengthOptimization:
        features.length >= 100 && features.length <= 220
          ? Math.min(100, score + 12)
          : Math.max(20, score - 12),
    },
  };
}
