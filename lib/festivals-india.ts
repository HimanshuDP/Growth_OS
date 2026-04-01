export interface Festival {
  name: string;
  date: string; // YYYY-MM-DD
  daysUntil: number;
  category: 'religious' | 'national' | 'commercial' | 'cultural';
  region: 'national' | 'north' | 'south' | 'east' | 'west' | 'global';
  marketingPriority: 'high' | 'medium' | 'low';
  relevantIndustries: string[];
  defaultCampaignAngles: string[];
  colorPalette: string[];
  keywords: string[];
}

const RAW_FESTIVALS: Omit<Festival, 'daysUntil'>[] = [
  // High Priority
  {
    name: "Eid ul-Fitr",
    date: "2026-03-31",
    category: "religious",
    region: "national",
    marketingPriority: "high",
    relevantIndustries: ["food", "fashion", "retail", "gifting"],
    defaultCampaignAngles: ["Host a festive giveaway", "Launch special combo packs", "Share brand greetings"],
    colorPalette: ["#15803d", "#facc15", "#ffffff"],
    keywords: ["moon", "eid", "celebration", "feast"]
  },
  {
    name: "Baisakhi",
    date: "2026-04-13",
    category: "cultural",
    region: "north",
    marketingPriority: "high",
    relevantIndustries: ["food", "agriculture", "retail", "events"],
    defaultCampaignAngles: ["Harvest season discounts", "Cultural celebration stories", "Spring collection launch"],
    colorPalette: ["#fbbf24", "#ea580c", "#16a34a"],
    keywords: ["baisakhi", "harvest", "punjab", "festival"]
  },
  {
    name: "Buddha Purnima",
    date: "2026-05-12",
    category: "religious",
    region: "national",
    marketingPriority: "high",
    relevantIndustries: ["wellness", "books", "meditation", "travel"],
    defaultCampaignAngles: ["Peace and mindfulness quotes", "Wellness product discounts", "Charitable initiatives"],
    colorPalette: ["#fef08a", "#ffffff", "#f97316"],
    keywords: ["buddha", "peace", "meditation", "light"]
  },
  {
    name: "Eid ul-Adha",
    date: "2026-06-07",
    category: "religious",
    region: "national",
    marketingPriority: "high",
    relevantIndustries: ["food", "charity", "fashion"],
    defaultCampaignAngles: ["Spirit of giving", "Festive meal offers", "Traditional wear promotion"],
    colorPalette: ["#166534", "#fef08a", "#ffffff"],
    keywords: ["eid", "sacrifice", "charity", "feast"]
  },
  {
    name: "Muharram",
    date: "2026-07-06",
    category: "religious",
    region: "national",
    marketingPriority: "high",
    relevantIndustries: ["all"],
    defaultCampaignAngles: ["Messages of peace", "Community support drives", "Quiet reflection posts"],
    colorPalette: ["#000000", "#166534", "#ffffff"],
    keywords: ["muharram", "prayer", "islamic", "community"]
  },
  {
    name: "Independence Day",
    date: "2026-08-15",
    category: "national",
    region: "national",
    marketingPriority: "high",
    relevantIndustries: ["all"],
    defaultCampaignAngles: ["Freedom sale (15% off)", "Made in India highlight", "Patriotic brand story"],
    colorPalette: ["#f97316", "#ffffff", "#15803d"],
    keywords: ["india", "flag", "independence", "patriotism"]
  },
  {
    name: "Janmashtami",
    date: "2026-08-16",
    category: "religious",
    region: "national",
    marketingPriority: "high",
    relevantIndustries: ["food", "dairy", "kids", "retail"],
    defaultCampaignAngles: ["Midnight flash sale", "Krishna-themed contests for kids", "Dairy product promotions"],
    colorPalette: ["#1e3a8a", "#facc15", "#ffffff"],
    keywords: ["krishna", "flute", "janmashtami", "decoration"]
  },
  {
    name: "Ganesh Chaturthi",
    date: "2026-08-25",
    category: "religious",
    region: "west",
    marketingPriority: "high",
    relevantIndustries: ["sweets", "decor", "events", "fashion"],
    defaultCampaignAngles: ["Eco-friendly celebrations", "Modak/sweets special offers", "Festive home decor bundles"],
    colorPalette: ["#ea580c", "#facc15", "#dc2626"],
    keywords: ["ganesha", "festival", "modak", "celebration"]
  },
  {
    name: "Onam",
    date: "2026-09-04",
    category: "cultural",
    region: "south",
    marketingPriority: "high",
    relevantIndustries: ["fashion", "food", "retail", "travel"],
    defaultCampaignAngles: ["Traditional ethnic wear launch", "Onam Sadhya meal kits", "Floral rangoli contests"],
    colorPalette: ["#fef08a", "#ffffff", "#15803d"],
    keywords: ["onam", "kerala", "flower", "sadhya"]
  },
  {
    name: "Navratri",
    date: "2026-09-22",
    category: "religious",
    region: "national",
    marketingPriority: "high",
    relevantIndustries: ["fashion", "makeup", "food", "events"],
    defaultCampaignAngles: ["9 Days 9 Offers", "Festive makeup tutorials", "Fasting (Vrat) special menu"],
    colorPalette: ["#dc2626", "#f97316", "#facc15"],
    keywords: ["navratri", "garba", "dance", "india"]
  },
  {
    name: "Dussehra",
    date: "2026-10-02",
    category: "religious",
    region: "national",
    marketingPriority: "high",
    relevantIndustries: ["electronics", "auto", "retail"],
    defaultCampaignAngles: ["Victory over evil - Upgrade your old gadgets", "Auspicious new purchases", "Festive joy campaigns"],
    colorPalette: ["#ea580c", "#facc15", "#16a34a"],
    keywords: ["dussehra", "festival", "victory", "celebration"]
  },
  {
    name: "Diwali",
    date: "2026-10-20",
    category: "religious",
    region: "national",
    marketingPriority: "high",
    relevantIndustries: ["all"],
    defaultCampaignAngles: ["Mega Diwali Sale", "Corporate Gifting Catalog", "Festive Home Makeovers"],
    colorPalette: ["#ea580c", "#facc15", "#0f172a"],
    keywords: ["diwali", "diyas", "lights", "celebration"]
  },
  {
    name: "Chhath Puja",
    date: "2026-10-24",
    category: "religious",
    region: "north",
    marketingPriority: "high",
    relevantIndustries: ["food", "travel", "retail"],
    defaultCampaignAngles: ["Purity and tradition highlights", "Travel offers for going home", "Ethnic wear promotions"],
    colorPalette: ["#f97316", "#facc15", "#dc2626"],
    keywords: ["chhath", "sun", "river", "prayer"]
  },
  {
    name: "Guru Nanak Jayanti",
    date: "2026-11-05",
    category: "religious",
    region: "north",
    marketingPriority: "high",
    relevantIndustries: ["all", "food", "books"],
    defaultCampaignAngles: ["Messages of equality", "Community kitchen (Langar) highlights", "Peaceful vibes post"],
    colorPalette: ["#fbbf24", "#ffffff", "#1e40af"],
    keywords: ["gurudwara", "peace", "sikh", "light"]
  },
  {
    name: "Christmas",
    date: "2026-12-25",
    category: "religious",
    region: "global",
    marketingPriority: "high",
    relevantIndustries: ["gifting", "food", "fashion", "decor"],
    defaultCampaignAngles: ["Secret Santa gift guide", "End of year mega sale", "Festive plum cake specials"],
    colorPalette: ["#dc2626", "#16a34a", "#ffffff"],
    keywords: ["christmas", "tree", "gift", "winter"]
  },
  {
    name: "New Year",
    date: "2027-01-01",
    category: "global",
    region: "global",
    marketingPriority: "high",
    relevantIndustries: ["fitness", "planner", "fashion", "all"],
    defaultCampaignAngles: ["New Year New You", "Flash Sale 2027", "Year-in-review"],
    colorPalette: ["#0f172a", "#facc15", "#ffffff"],
    keywords: ["new year", "2027", "celebration", "fireworks"]
  },
  {
    name: "Makar Sankranti",
    date: "2027-01-14",
    category: "cultural",
    region: "national",
    marketingPriority: "high",
    relevantIndustries: ["kites", "sweets", "fashion"],
    defaultCampaignAngles: ["Soar High - Business resolutions", "Tilgul special treats", "Colorful ethnic launch"],
    colorPalette: ["#f97316", "#facc15", "#38bdf8"],
    keywords: ["kite", "sankranti", "sky", "festival"]
  },
  {
    name: "Basant Panchami",
    date: "2027-01-22",
    category: "religious",
    region: "north",
    marketingPriority: "high",
    relevantIndustries: ["education", "books", "fashion", "music"],
    defaultCampaignAngles: ["Wisdom and learning campaigns", "Yellow theme day", "Stationery/Books sale"],
    colorPalette: ["#facc15", "#ffffff", "#16a34a"],
    keywords: ["yellow", "saraswati", "spring", "books"]
  },
  {
    name: "Republic Day",
    date: "2027-01-26",
    category: "national",
    region: "national",
    marketingPriority: "high",
    relevantIndustries: ["all"],
    defaultCampaignAngles: ["26% Off Republic Sale", "Constitution facts trivia", "Tricolor theme launch"],
    colorPalette: ["#f97316", "#ffffff", "#15803d"],
    keywords: ["republic", "india", "parade", "flag"]
  },
  {
    name: "Holi",
    date: "2027-03-01",
    category: "religious",
    region: "national",
    marketingPriority: "high",
    relevantIndustries: ["fashion", "skincare", "food", "events"],
    defaultCampaignAngles: ["Stain-free skincare guide", "Colorful splash sale", "Festive party passes"],
    colorPalette: ["#ec4899", "#3b82f6", "#facc15"],
    keywords: ["holi", "colors", "celebration", "powder"]
  },

  // Medium Priority (E-commerce & Business Events)
  {
    name: "Mother's Day",
    date: "2026-05-10",
    category: "commercial",
    region: "global",
    marketingPriority: "medium",
    relevantIndustries: ["gifting", "jewelry", "fashion", "spa"],
    defaultCampaignAngles: ["Pamper mom packages", "Customized jewelry", "Emotional video tribute"],
    colorPalette: ["#fbcfe8", "#be185d", "#ffffff"],
    keywords: ["mother", "love", "gift", "family"]
  },
  {
    name: "World Environment Day",
    date: "2026-06-05",
    category: "commercial",
    region: "global",
    marketingPriority: "medium",
    relevantIndustries: ["all", "eco-friendly", "solar", "organic"],
    defaultCampaignAngles: ["Go green initiative", "Launch sustainable packaging", "Plant a tree campaign"],
    colorPalette: ["#16a34a", "#4ade80", "#ffffff"],
    keywords: ["environment", "earth", "green", "nature"]
  },
  {
    name: "Father's Day",
    date: "2026-06-21",
    category: "commercial",
    region: "global",
    marketingPriority: "medium",
    relevantIndustries: ["gifting", "electronics", "fashion", "tools"],
    defaultCampaignAngles: ["Tech gifts for dad", "Grooming kits promo", "Dad jokes contest"],
    colorPalette: ["#1e3a8a", "#94a3b8", "#ffffff"],
    keywords: ["father", "dad", "gift", "family"]
  },
  {
    name: "MSME Day",
    date: "2026-06-27",
    category: "commercial",
    region: "global",
    marketingPriority: "medium",
    relevantIndustries: ["b2b", "saas", "finance", "services"],
    defaultCampaignAngles: ["Support local businesses", "Entrepreneurship stories", "B2B software discounts"],
    colorPalette: ["#ea580c", "#2563eb", "#ffffff"],
    keywords: ["business", "growth", "startup", "office"]
  },
  {
    name: "CA Day",
    date: "2026-07-01",
    category: "commercial",
    region: "national",
    marketingPriority: "medium",
    relevantIndustries: ["finance", "b2b", "software"],
    defaultCampaignAngles: ["Thank your CA", "Tax software discounts", "Financial health tips"],
    colorPalette: ["#1e40af", "#ffffff", "#facc15"],
    keywords: ["finance", "calculator", "accountant", "bookkeeping"]
  },
  {
    name: "GST Day",
    date: "2026-07-01",
    category: "commercial",
    region: "national",
    marketingPriority: "medium",
    relevantIndustries: ["finance", "software", "retail", "b2b"],
    defaultCampaignAngles: ["Compliance made easy", "Billing software launch", "GST facts infographic"],
    colorPalette: ["#2563eb", "#ffffff", "#475569"],
    keywords: ["tax", "invoice", "india", "law"]
  },
  {
    name: "Friendship Day",
    date: "2026-08-02",
    category: "commercial",
    region: "global",
    marketingPriority: "medium",
    relevantIndustries: ["gifting", "food", "entertainment", "retail"],
    defaultCampaignAngles: ["BOGO offers for friends", "Tag your bestie giveaways", "Friendship band combos"],
    colorPalette: ["#fcd34d", "#f472b6", "#38bdf8"],
    keywords: ["friends", "fun", "laugh", "group"]
  },
  {
    name: "Teachers Day",
    date: "2026-09-05",
    category: "national",
    region: "national",
    marketingPriority: "medium",
    relevantIndustries: ["education", "books", "gifting", "stationery"],
    defaultCampaignAngles: ["Thank a mentor", "Stationery/book offers", "Back to learning webinars"],
    colorPalette: ["#1e40af", "#facc15", "#ffffff"],
    keywords: ["school", "teacher", "chalkboard", "learning"]
  },
  {
    name: "Children's Day",
    date: "2026-11-14",
    category: "national",
    region: "national",
    marketingPriority: "medium",
    relevantIndustries: ["toys", "kids fashion", "education", "food"],
    defaultCampaignAngles: ["Kids styling guide", "Toy discounts", "Bring out your inner child contest"],
    colorPalette: ["#3b82f6", "#ec4899", "#facc15"],
    keywords: ["kids", "play", "toys", "children"]
  },
  {
    name: "Valentine's Day",
    date: "2027-02-14",
    category: "commercial",
    region: "global",
    marketingPriority: "medium",
    relevantIndustries: ["gifting", "jewelry", "food", "fashion"],
    defaultCampaignAngles: ["Couples dinner combos", "Jewelry gift guide", "Self-love discounts"],
    colorPalette: ["#dc2626", "#fbcfe8", "#ffffff"],
    keywords: ["love", "heart", "couple", "rose"]
  },
  {
    name: "International Women's Day",
    date: "2027-03-08",
    category: "commercial",
    region: "global",
    marketingPriority: "medium",
    relevantIndustries: ["fashion", "wellness", "b2b", "gifting"],
    defaultCampaignAngles: ["Empowerment stories", "Women-led business spotlight", "Special 8% off"],
    colorPalette: ["#9333ea", "#ffffff", "#fbcfe8"],
    keywords: ["women", "power", "business", "equality"]
  }
];

export const INDIAN_FESTIVALS: Festival[] = RAW_FESTIVALS.map(festival => {
  const diffTime = Math.ceil((new Date(festival.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  return {
    ...festival,
    daysUntil: diffTime
  };
});

export function getUpcomingFestivals(days: number): Festival[] {
  const now = new Date();
  
  const upcoming = RAW_FESTIVALS.map(festival => {
    const diffTime = Math.ceil((new Date(festival.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      ...festival,
      daysUntil: diffTime
    };
  }).filter(festival => festival.daysUntil >= 0 && festival.daysUntil <= days);
  
  upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
  return upcoming;
}
