export interface HashtagScore {
  hashtag: string;
  score: number;
  tier: 'mega' | 'macro' | 'micro' | 'niche';
  estimatedPosts: string;
  reach: 'Very High' | 'High' | 'Medium' | 'Niche';
  competition: 'Very High' | 'High' | 'Medium' | 'Low';
  indiaRelevant: boolean;
  recommendation: 'use' | 'use-sparingly' | 'avoid';
  reason: string;
}

const INDIA_HASHTAGS = new Set([
  'india', 'mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'pune',
  'madeinindia', 'vocalforlocal', 'atmanirbharbharat', 'startupindia',
  'digitalindia', 'indianbusiness', 'indiabusiness', 'indianentrepreneur',
  'desi', 'indianfood', 'indianfashion', 'swadeshi', 'indiaretail',
  'bharat', 'surat', 'ahmedabad', 'jaipur', 'hyderabad', 'noida',
]);

type TierEntry = {
  posts: string;
  tier: HashtagScore['tier'];
  reach: HashtagScore['reach'];
  competition: HashtagScore['competition'];
};

const HASHTAG_TIERS: Record<string, TierEntry> = {
  love: { posts: '2.1B', tier: 'mega', reach: 'Very High', competition: 'Very High' },
  instagood: { posts: '1.8B', tier: 'mega', reach: 'Very High', competition: 'Very High' },
  fashion: { posts: '800M', tier: 'mega', reach: 'Very High', competition: 'Very High' },
  food: { posts: '600M', tier: 'mega', reach: 'Very High', competition: 'Very High' },
  photography: { posts: '900M', tier: 'mega', reach: 'Very High', competition: 'Very High' },
  travel: { posts: '750M', tier: 'mega', reach: 'Very High', competition: 'Very High' },
  fitness: { posts: '500M', tier: 'mega', reach: 'Very High', competition: 'Very High' },
  smallbusiness: { posts: '85M', tier: 'macro', reach: 'High', competition: 'High' },
  entrepreneur: { posts: '70M', tier: 'macro', reach: 'High', competition: 'High' },
  startup: { posts: '45M', tier: 'macro', reach: 'High', competition: 'High' },
  marketing: { posts: '40M', tier: 'macro', reach: 'High', competition: 'High' },
  business: { posts: '120M', tier: 'macro', reach: 'High', competition: 'Very High' },
  ecommerce: { posts: '35M', tier: 'macro', reach: 'High', competition: 'High' },
  digitalmarketing: { posts: '28M', tier: 'macro', reach: 'High', competition: 'High' },
  socialmedia: { posts: '55M', tier: 'macro', reach: 'High', competition: 'High' },
  branding: { posts: '22M', tier: 'macro', reach: 'High', competition: 'High' },
  indianstartup: { posts: '2.1M', tier: 'micro', reach: 'Medium', competition: 'Medium' },
  mumbaifoodies: { posts: '1.4M', tier: 'micro', reach: 'Medium', competition: 'Medium' },
  delhifashion: { posts: '900K', tier: 'micro', reach: 'Medium', competition: 'Medium' },
  madeinindia: { posts: '4.5M', tier: 'micro', reach: 'Medium', competition: 'Medium' },
  indiabusiness: { posts: '3.2M', tier: 'micro', reach: 'Medium', competition: 'Medium' },
  bangaloreit: { posts: '1.8M', tier: 'micro', reach: 'Medium', competition: 'Medium' },
  indianentrepreneur: { posts: '2.8M', tier: 'micro', reach: 'Medium', competition: 'Medium' },
  startupindia: { posts: '5.1M', tier: 'micro', reach: 'Medium', competition: 'Medium' },
  punestartups: { posts: '45K', tier: 'niche', reach: 'Niche', competition: 'Low' },
  bangalorefood: { posts: '380K', tier: 'niche', reach: 'Niche', competition: 'Low' },
  delhifood: { posts: '220K', tier: 'niche', reach: 'Niche', competition: 'Low' },
  mumbaibusiness: { posts: '180K', tier: 'niche', reach: 'Niche', competition: 'Low' },
  jaipurstartup: { posts: '32K', tier: 'niche', reach: 'Niche', competition: 'Low' },
  hyderabadtech: { posts: '95K', tier: 'niche', reach: 'Niche', competition: 'Low' },
};

export function scoreHashtag(
  hashtag: string,
  captionText: string,
  industry: string
): HashtagScore {
  const tag = hashtag.replace('#', '').toLowerCase();
  const known = HASHTAG_TIERS[tag];
  const isIndia =
    INDIA_HASHTAGS.has(tag) || tag.includes('india') || tag.includes('indian');

  const tagWords = tag.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(/\s+/);
  const captionWords = captionText.toLowerCase().split(/\s+/);
  const relevance =
    tagWords.filter((w) => captionWords.some((cw) => cw.includes(w))).length /
    tagWords.length;

  let baseScore = 50;
  if (known) {
    if (known.tier === 'mega') baseScore = 35;
    if (known.tier === 'macro') baseScore = 60;
    if (known.tier === 'micro') baseScore = 80;
    if (known.tier === 'niche') baseScore = 70;
  }
  baseScore += relevance * 20;
  if (isIndia) baseScore += 8;

  const score = Math.min(100, Math.round(baseScore));

  return {
    hashtag: hashtag.startsWith('#') ? hashtag : `#${hashtag}`,
    score,
    tier: known?.tier || 'micro',
    estimatedPosts: known?.posts || '~500K',
    reach: known?.reach || 'Medium',
    competition: known?.competition || 'Medium',
    indiaRelevant: isIndia,
    recommendation: score >= 70 ? 'use' : score >= 45 ? 'use-sparingly' : 'avoid',
    reason:
      score >= 70
        ? 'Sweet spot: good reach with manageable competition'
        : score >= 45
        ? `Decent reach but ${
            known?.competition === 'Very High'
              ? 'high competition reduces discoverability'
              : 'could be more targeted'
          }`
        : 'Too competitive — your post gets buried instantly',
  };
}

export function scoreHashtagSet(
  hashtags: string[],
  caption: string,
  industry: string
): {
  scores: HashtagScore[];
  overallScore: number;
  mixAnalysis: string;
  suggestedSwaps: Array<{ remove: string; addInstead: string; reason: string }>;
} {
  const scores = hashtags.map((h) => scoreHashtag(h, caption, industry));
  const overallScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
      : 0;

  const megaCount = scores.filter((s) => s.tier === 'mega').length;
  const microCount = scores.filter((s) => s.tier === 'micro').length;
  const nicheCount = scores.filter((s) => s.tier === 'niche').length;

  let mixAnalysis = '';
  if (megaCount > 4)
    mixAnalysis =
      '⚠️ Too many mega hashtags — your post will get buried. Swap some for micro-niche tags.';
  else if (microCount + nicheCount >= hashtags.length * 0.6)
    mixAnalysis = '✅ Great mix! Strong niche targeting with good discovery potential.';
  else
    mixAnalysis =
      '💡 Good start. Add 3-4 more India-specific or industry-specific hashtags for better targeting.';

  return { scores, overallScore, mixAnalysis, suggestedSwaps: [] };
}
