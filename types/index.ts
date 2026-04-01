// ============================================================
// GrowthOS — Zero-Touch Growth Operating System
// TypeScript Type Definitions
// ============================================================

// ─── Business Profile ────────────────────────────────────────

export type BusinessModel = 'B2B' | 'B2C' | 'D2C';
export type BrandTone = 'professional' | 'friendly' | 'playful' | 'authoritative';
export type PrimaryGoal = 'awareness' | 'leads' | 'sales' | 'engagement';

export interface BusinessProfile {
  id: string;
  name: string;
  websiteUrl: string;
  industry: string;
  businessModel: BusinessModel;
  targetAudience: string;
  location: string;
  productsServices: string[];
  brandTone: BrandTone;
  uniqueValueProposition: string;
  topCompetitors: string[];
  monthlyBudget: string;
  primaryGoal: PrimaryGoal;
  createdAt: Date;
}

// ─── Content Calendar ────────────────────────────────────────

export type ContentPillar = 'educational' | 'promotional' | 'entertaining' | 'inspirational';
export type PostType = 'carousel' | 'static' | 'story' | 'reel';

export interface CalendarDay {
  date: string;
  dayOfWeek: string;
  theme: string;
  contentPillar: ContentPillar;
  postType: PostType;
  caption: string;
  hashtags: string[];
  suggestedTime: string;
  festivalHook?: string;
  imageKeyword: string;
}

export interface WeeklyCalendar {
  businessId: string;
  weekStartDate: string;
  days: CalendarDay[];
  generatedAt: string;
}

// ─── Caption Generator ──────────────────────────────────────

export type SocialPlatform = 'instagram' | 'linkedin' | 'facebook' | 'twitter';

export interface CaptionVariation {
  id: string;
  tone: string;
  caption: string;
  hashtags: string[];
  cta: string;
  characterCount: number;
  platform: SocialPlatform;
}

export interface CaptionRequest {
  productDescription: string;
  brandTone: BrandTone;
  targetPlatform: SocialPlatform;
  targetAudience: string;
  includeEmojis: boolean;
  includeHashtags: boolean;
  language: string;
}

// ─── Festival & Trend Detector ──────────────────────────────

export type FestivalUrgency = 'high' | 'medium' | 'low';
export type FestivalRegion = 'national' | 'regional' | 'global';

export interface FestivalCampaign {
  festival: string;
  date: string;
  daysUntil: number;
  region: FestivalRegion;
  campaignIdea: string;
  contentAngles: string[];
  urgency: FestivalUrgency;
  postTypes: string[];
  sampleCaption: string;
}

export interface IndianFestival {
  name: string;
  date: string;
  region: FestivalRegion;
  description: string;
  marketingRelevance: string;
  keywords: string[];
}

// ─── Ad Recommendation Engine ───────────────────────────────

export type AdObjective = 'awareness' | 'traffic' | 'leads' | 'conversions';

export interface AdRecommendation {
  id: string;
  campaignName: string;
  objective: string; // awareness | traffic | leads | conversions
  platform: string;
  targetAudience: string;
  audience?: {
    ageRange: string;
    gender: string;
    location: string;
    interests: string[];
  };
  budgetRecommendation: string;
  budget?: {
    daily: string;
    estimatedReach: string;
    estimatedCPC: string;
    estimatedCTR: string;
  };
  estimatedReach: string;
  estimatedCPC: string;
  estimatedROAS?: string | number;
  adCopyVariations: string[];
  adCopy?: {
    headlines: string[];
    primaryTexts: string[];
  };
  visualRecommendation: string;
  creativeDirection?: string;
  aiInsight: string;
}

// ─── Performance Dashboard ──────────────────────────────────

export interface PerformanceMetric {
  date: string;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  roas: number;
  spend: number;
  platform: string;
}

export interface PerformanceSummary {
  totalImpressions: number;
  totalReach: number;
  totalClicks: number;
  averageCTR: number;
  averageCPC: number;
  totalConversions: number;
  averageROAS: number;
  totalSpend: number;
  aiInsights: string[];
}

// ─── API Response Types ─────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  fallback?: boolean;
}

// ─── Navigation & UI ────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
}
