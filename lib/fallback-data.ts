import type {
  BusinessProfile,
  CalendarDay,
  CaptionVariation,
  FestivalCampaign,
  AdRecommendation,
  PerformanceMetric,
} from '@/types';

function generateTrendData(baseRoas: number, baseCtr: number, baseCpc: number, platforms: string[]): PerformanceMetric[] {
  const metrics: PerformanceMetric[] = [];
  
  for (let i = 30; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const platform = platforms[i % platforms.length];

    // Simulate an upward trend (improving performance as days get to 0)
    const improvementFactor = 1 + ((30 - i) / 30) * 0.4;
    
    const impressions = Math.round((5000 + (Math.random() * 3000)) * improvementFactor);
    const reach = Math.round(impressions * 0.7);
    const clicks = Math.round((impressions * (baseCtr / 100)) * improvementFactor);
    const spend = Math.round(clicks * baseCpc * (1 - ((30 - i) / 30) * 0.15)); // CPC slightly goes down
    const roundedCpc = parseFloat((spend / clicks).toFixed(2));
    const ctr = parseFloat(((clicks / impressions) * 100).toFixed(2));
    
    // Simulate conversions based on ROAS
    const revenue = spend * (baseRoas * improvementFactor);
    const avgOrderValue = 850;
    const conversions = Math.round(revenue / avgOrderValue);
    const finalRoas = parseFloat((revenue / spend).toFixed(2));

    metrics.push({
      date: dateStr,
      impressions,
      reach,
      clicks,
      ctr,
      cpc: roundedCpc,
      conversions,
      roas: finalRoas,
      spend,
      platform,
    });
  }

  return metrics;
}

const pPlatforms = ['Instagram', 'Instagram', 'Facebook', 'LinkedIn']; // ~45% IG, 30% FB, 25% LI

export const FALLBACK_DATA = {
  businesses: {
    mumbaiMithai: {
      profile: {
        id: "mumbai-mithai",
        name: "Mumbai Mithai House",
        websiteUrl: "https://mumbaimithaihouse.com",
        industry: "Food & Beverage",
        businessModel: "B2C",
        targetAudience: "Families, corporate gifters, and sweet lovers in Mumbai. Age 25-55.",
        location: "Mumbai, Maharashtra",
        productsServices: ["Kaju Katli", "Motichoor Ladoo", "Corporate Gift Hampers", "Sugar-Free Sweets"],
        brandTone: "friendly",
        uniqueValueProposition: "Authentic traditional recipes made with pure desi ghee for over 40 years.",
        topCompetitors: ["Bikanerwala", "Haldirams", "Local Mumbai sweet shops"],
        primaryGoal: "sales",
        monthlyBudget: "₹25,000",
        createdAt: new Date()
      } as BusinessProfile,
      calendar: [
        { date: "2026-04-10", dayOfWeek: "Friday", theme: "Weekend Box Showcase", contentPillar: "promotional", postType: "carousel", caption: "Weekend family time is incomplete without our Special Assorted Mithai Box! 🍬 Swap the usual desserts for pure, desi ghee goodness.", hashtags: ["#MumbaiDesserts", "#DesiSweets"], suggestedTime: "5:00 PM IST" },
        { date: "2026-04-11", dayOfWeek: "Saturday", theme: "Behind the Kitchen", contentPillar: "entertaining", postType: "reel", caption: "Ever wondered how we get the perfect shape on our Kaju Katli? Watch masterji at work! 🔪✨", hashtags: ["#BehindTheScenes", "#MumbaiMithai"], suggestedTime: "11:00 AM IST" },
        { date: "2026-04-12", dayOfWeek: "Sunday", theme: "Customer Review", contentPillar: "inspirational", postType: "story", caption: "Nothing makes us happier than seeing our sweets at your family celebrations. Thank you, Neha, for the lovely picture!", hashtags: ["#CustomerLove"], suggestedTime: "1:00 PM IST" },
        { date: "2026-04-13", dayOfWeek: "Monday", theme: "Baisakhi Preparation", contentPillar: "educational", postType: "static", caption: "Gearing up for Baisakhi tomorrow! Did you know our Pinnie is made strictly following traditional Punjabi methods? 🌾", hashtags: ["#Baisakhi2026", "#TraditionalRecipe"], suggestedTime: "6:00 PM IST", festivalHook: "Baisakhi build-up" },
        { date: "2026-04-14", dayOfWeek: "Tuesday", theme: "Happy Baisakhi", contentPillar: "inspirational", postType: "carousel", caption: "Wishing everyone a joyous and prosperous Baisakhi! May your year be as sweet as our signature Laddus. ☀️", hashtags: ["#HappyBaisakhi", "#FestivalOfHarvest"], suggestedTime: "9:00 AM IST", festivalHook: "Baisakhi celebration" },
        { date: "2026-04-15", dayOfWeek: "Wednesday", theme: "Sugar-Free Options", contentPillar: "educational", postType: "reel", caption: "Love sweets but watching your sugar? We have a complete range of stevia-sweetened traditional mithai! Taste the joy, skip the guilt. 🌿", hashtags: ["#SugarFreeSweets", "#HealthyOptions"], suggestedTime: "12:00 PM IST" },
        { date: "2026-04-16", dayOfWeek: "Thursday", theme: "Corporate Gifting", contentPillar: "promotional", postType: "static", caption: "Planning team appreciations? Check out our premium wooden assorted boxes. We handle direct deliveries across Mumbai! 🏢", hashtags: ["#CorporateGifting", "#B2BMumbai"], suggestedTime: "3:00 PM IST" }
      ] as CalendarDay[],
      captions: [
        { id: "mm-c1", tone: "Emotional", caption: "Every bite of our Motichoor Ladoo isn't just sweet; it's a memory of childhood festivals and dadi's kitchen. ❤️ Revisit your favorite memories today.", hashtags: ["#Nostalgia", "#MumbaiMithai", "#DesiGhee"], cta: "Order your memory box via link in bio!", characterCount: 185, platform: "instagram" },
        { id: "mm-c2", tone: "Witty", caption: "Diet starts tomorrow, but these Kaju Katlis are staring right at you today. 🤤 Don't fight it, give in to the silver-foiled goodness.", hashtags: ["#SweetTooth", "#KajuKatliLover", "#GuiltyPleasure"], cta: "Swipe to order before we run out!", characterCount: 168, platform: "instagram" },
        { id: "mm-c3", tone: "Professional", caption: "Elevate your corporate gifting with Mumbai Mithai House. Handcrafted, premium sweets wrapped in luxurious packaging, ensuring your clients feel truly valued.", hashtags: ["#CorporateGifts", "#PremiumSweets", "#MumbaiBusiness"], cta: "Contact us for a corporate catalog.", characterCount: 198, platform: "linkedin" }
      ] as CaptionVariation[],
      festivals: [
        { festival: "Baisakhi", date: "2026-04-13", daysUntil: 12, region: "north", campaignIdea: "Highlight traditional winter/spring harvest sweets.", contentAngles: ["Pinnie making process", "Baisakhi discount code", "Harvest history trivia"], urgency: "high", postTypes: ["reel", "static"], sampleCaption: "Celebrate the harvest with the sweetest crops! Enjoy 10% off our Baisakhi special sweets." },
        { festival: "Mother's Day", date: "2026-05-10", daysUntil: 39, region: "global", campaignIdea: "Sweetness like Mom's love.", contentAngles: ["Gift boxes for Mom", "Mom's favorite picks", "User generated selfies with Mom & Mithai"], urgency: "medium", postTypes: ["carousel", "story"], sampleCaption: "To the one who made every day sweet. Treat your mother to her favorite Kaju Katli today! 👩‍👧❤️" },
        { festival: "Buddha Purnima", date: "2026-05-12", daysUntil: 41, region: "national", campaignIdea: "Pure, peaceful, and simple treats.", contentAngles: ["Sattvik sweets line", "Peaceful vibes post"], urgency: "medium", postTypes: ["static"], sampleCaption: "Wishing everyone peace, prosperity, and joy on the occasion of Buddha Purnima." },
        { festival: "Eid ul-Adha", date: "2026-06-07", daysUntil: 67, region: "national", campaignIdea: "Festive celebration combos.", contentAngles: ["Eid hampers", "Sharing family boxes"], urgency: "low", postTypes: ["reel", "carousel"], sampleCaption: "Eid Mubarak! Celebrate the joy of togetherness with our special Eid assortments." }
      ] as FestivalCampaign[],
      ads: [
        { id: "mm-ad1", campaignName: "Mumbai Radius Delivery push", objective: "sales", platform: "Meta Ads (Instagram + Facebook)", targetAudience: "Food enthusiasts in Mumbai within 10km of shop. Age 25-45.", budgetRecommendation: "₹10,000/month (₹333/day)", estimatedReach: "35,000 - 50,000 users", estimatedCPC: "₹12.50", adCopyVariations: ["Craving authentic Kaju Katli? Delivered fresh in 45 mins across Mumbai!", "Mumbai's favorite Mithai, now at your doorstep. Order online today."], visualRecommendation: "High contrast image of glistening motichoor ladoos with a 'Free Delivery' overlay.", aiInsight: "Swiggy/Zomato linkage to the ad increases conversion for local food places by 25%." },
        { id: "mm-ad2", campaignName: "Wedding/Bulk Ordering Leads", objective: "leads", platform: "Google Ads", targetAudience: "Users searching for 'wedding sweets return gifts', 'bulk mithai mumbai', 'custom sweet boxes'", budgetRecommendation: "₹10,000/month", estimatedReach: "1,500 highly specific clicks", estimatedCPC: "₹35.00", adCopyVariations: ["Premium Wedding Sweet Boxes in Mumbai | Custom Gifting", "Bulk Order Desi Ghee Mithai | Get a Free Tasting Setup"], visualRecommendation: "Elegant photo of a stacked wedding hamper.", aiInsight: "Search ads are crucial for high-ticket wedding orders. Send traffic to a dedicated landing page form." },
        { id: "mm-ad3", campaignName: "Corporate Gifting HR Outreach", objective: "leads", platform: "LinkedIn Ads", targetAudience: "HR Managers, Office Admins, Founders in Mumbai area.", budgetRecommendation: "₹5,000/month", estimatedReach: "5,000 impressions", estimatedCPC: "₹55.00", adCopyVariations: ["Appreciate your team the sweet way. Download our Corporate catalog.", "Diwali & annual bonuses are better with authentic Mumbai Mithai. Bulk discounts available."], visualRecommendation: "Corporate desk aesthetic with a classy sweet box.", aiInsight: "LinkedIn lead gen forms convert 3x better than sending them to a website." }
      ] as AdRecommendation[],
      performance: generateTrendData(2.8, 1.8, 14.5, pPlatforms)
    },
    techVenture: {
      profile: {
        id: "tech-venture",
        name: "TechVenture Solutions",
        websiteUrl: "https://techventure.io",
        industry: "Technology",
        businessModel: "B2B",
        targetAudience: "Mid-sized Indian companies (50-500 employees) needing cloud migration and IT infrastructure.",
        location: "Bangalore, Karnataka",
        productsServices: ["Cloud Migration", "Cybersecurity Audits", "Managed IT Services"],
        brandTone: "professional",
        uniqueValueProposition: "Zero downtime cloud migrations managed strictly by AWS/Azure certified engineers.",
        topCompetitors: ["TCS SMB Unit", "Local IT MSPs"],
        primaryGoal: "leads",
        monthlyBudget: "₹50,000",
        createdAt: new Date()
      } as BusinessProfile,
      calendar: [
        { date: "2026-04-10", dayOfWeek: "Friday", theme: "Tech Friday Setup", contentPillar: "educational", postType: "carousel", caption: "5 common security vulnerabilities our audit found in 60% of Bangalore SMBs. Swipe to see if you are at risk. 🛡️", hashtags: ["#CyberSecurity", "#BangaloreIT"], suggestedTime: "10:00 AM IST" },
        { date: "2026-04-13", dayOfWeek: "Monday", theme: "Migration Success Story", contentPillar: "inspirational", postType: "static", caption: "Case Study: How we migrated a 200-person logistics firm to Azure with zero operational downtime. Read the full breakdown in our blog.", hashtags: ["#CloudMigration", "#TechVenture"], suggestedTime: "9:00 AM IST" },
        { date: "2026-04-14", dayOfWeek: "Tuesday", theme: "Team Introduction", contentPillar: "entertaining", postType: "reel", caption: "Meet our Lead Security Architect, Rajesh. When he's not patching servers, he's brewing the best filter coffee in the office! ☕💻", hashtags: ["#LifeAtTechVenture", "#TeamSpotlight"], suggestedTime: "2:00 PM IST" },
        { date: "2026-04-15", dayOfWeek: "Wednesday", theme: "Webinar Announcement", contentPillar: "promotional", postType: "story", caption: "Free Webinar: Architecting Resilient Cloud Infrastructure for Indian Startups. Register now via link!", hashtags: ["#Webinar", "#CloudTech"], suggestedTime: "4:00 PM IST" },
        { date: "2026-04-16", dayOfWeek: "Thursday", theme: "Tip of the Week", contentPillar: "educational", postType: "static", caption: "Stop using your personal phone number for AWS root MFA. Always use a dedicated hardware key or shared team authenticator. 🔐", hashtags: ["#InfoSec", "#TechTip"], suggestedTime: "11:30 AM IST" },
        { date: "2026-04-17", dayOfWeek: "Friday", theme: "Industry News", contentPillar: "inspirational", postType: "carousel", caption: "The New DPDP Act in India: 3 things your IT infrastructure MUST have to remain compliant.", hashtags: ["#DPDPAct", "#DataPrivacyIndia"], suggestedTime: "10:00 AM IST" },
        { date: "2026-04-20", dayOfWeek: "Monday", theme: "Free Audit Offer", contentPillar: "promotional", postType: "static", caption: "Start the week secure. We're giving away 3 free high-level security audits this week. DM 'SECURE' to claim one.", hashtags: ["#SecurityAudit", "#BangaloreBusiness"], suggestedTime: "9:00 AM IST" }
      ] as CalendarDay[],
      captions: [
        { id: "tv-c1", tone: "Professional", caption: "In today's fast-paced digital landscape, downtime isn't an option. Our certified team ensures your cloud migration is seamless and 100% secure. ☁️💼", hashtags: ["#CloudComputing", "#BusinessGrowth", "#TechVenture"], cta: "Download our free Migration Checklist.", characterCount: 195, platform: "linkedin" },
        { id: "tv-c2", tone: "Authoritative", caption: "60% of businesses fail to recover from a major data breach within 6 months. Don't be a statistic. Audit your infrastructure today. 🔒", hashtags: ["#CyberSecurity", "#RiskManagement", "#ITAudit"], cta: "Schedule a consultation with our experts.", characterCount: 178, platform: "linkedin" },
        { id: "tv-c3", tone: "Friendly", caption: "Moving to the cloud doesn't have to be a headache! Let our friendly neighborhood engineers set everything up while you focus on scaling your business. 🚀☁️", hashtags: ["#AWS", "#StartupIndia", "#TechSolutions"], cta: "Let's grab a virtual coffee and chat!", characterCount: 201, platform: "twitter" }
      ] as CaptionVariation[],
      festivals: [
        { festival: "MSME Day", date: "2026-06-27", daysUntil: 87, region: "global", campaignIdea: "B2B special for growing SMBs", contentAngles: ["Special MSME cloud package discounts", "Founders story on supporting Indian SMBs"], urgency: "medium", postTypes: ["linkedin article", "static"], sampleCaption: "Happy MSME Day! To support the backbone of the Indian economy, we're offering flat 20% off our Managed IT services for all MSMEs." },
        { festival: "CA Day", date: "2026-07-01", daysUntil: 91, region: "national", campaignIdea: "Target accounting firms for data security", contentAngles: ["Why CAs need cloud security", "Protecting sensitive financial data"], urgency: "medium", postTypes: ["carousel", "linkedin poll"], sampleCaption: "Happy CA Day! To the professionals handling our financial data, ensure your infrastructure is as rock-solid as your ledgers. 🔒" },
        { festival: "Independence Day", date: "2026-08-15", daysUntil: 136, region: "national", campaignIdea: "Freedom from IT worries", contentAngles: ["Freedom from server crashes", "Made in India tech talent showcase"], urgency: "low", postTypes: ["carousel", "reel"], sampleCaption: "This Independence Day, give your business freedom from IT downtime and security breaches. 🇮🇳🚀" },
        { festival: "Diwali", date: "2026-10-20", daysUntil: 202, region: "national", campaignIdea: "Bright & Secure future", contentAngles: ["Diwali tech gifting", "Cleaning up your digital architecture (clean up theme)"], urgency: "low", postTypes: ["carousel"], sampleCaption: "May your servers be bright and your firewalls strong! Happy Diwali from TechVenture. ✨" }
      ] as FestivalCampaign[],
      ads: [
        { id: "tv-ad1", campaignName: "LinkedIn LeadGen for Audits", objective: "leads", platform: "LinkedIn Ads", targetAudience: "CTOs, Founders, IT Directors in Bangalore & Hyderabad.", budgetRecommendation: "₹25,000/month (₹833/day)", estimatedReach: "15,000 decision makers", estimatedCPC: "₹85.00", adCopyVariations: ["Is your infrastructure DPDP compliant? Get a free 30-min audit.", "Scale faster with zero-downtime AWS migrations. Talk to Bangalore's top certified team."], visualRecommendation: "Clean, corporate graphic with tech diagrams and a strong blue presence.", aiInsight: "In-feed sponsored content with Lead Gen Forms has the lowest CPA for enterprise IT services." },
        { id: "tv-ad2", campaignName: "Search Intent - High Value", objective: "leads", platform: "Google Ads", targetAudience: "Searches for 'cloud migration companies bangalore', 'AWS managed services'", budgetRecommendation: "₹15,000/month", estimatedReach: "2,000 high-intent clicks", estimatedCPC: "₹110.00", adCopyVariations: ["Top Cloud Migration Experts in Bangalore | Zero Downtime", "AWS & Azure Managed IT Services | Free Architecture Review"], visualRecommendation: "Text ads only (Google Search).", aiInsight: "B2B search CPC is high, but conversion value makes up for it. Ensure your landing page loads under 2 seconds." },
        { id: "tv-ad3", campaignName: "Webinar Retargeting", objective: "conversions", platform: "Meta Ads (Facebook)", targetAudience: "Website visitors + past webinar attendees.", budgetRecommendation: "₹10,000/month", estimatedReach: "10,000 users", estimatedCPC: "₹25.00", adCopyVariations: ["Still struggling with server limits? Let's fix your cloud backend today.", "Ready to upgrade your infrastructure? Book your free consultation now."], visualRecommendation: "Video testimonial of a satisfied CTO client.", aiInsight: "Retargeting on Meta is highly effective even for B2B because founders scroll Facebook during off-hours." }
      ] as AdRecommendation[],
      performance: generateTrendData(4.2, 1.2, 75.0, ['LinkedIn', 'Google Ads', 'LinkedIn', 'Facebook'])
    },
    priyasBoutique: {
      profile: {
        id: "priyas-boutique",
        name: "Priya's Boutique",
        websiteUrl: "https://priyasboutique.in",
        industry: "Fashion & Apparel",
        businessModel: "D2C",
        targetAudience: "Young women 18-35 looking for affordable, trendy, and fusion ethnic wear.",
        location: "Jaipur, Rajasthan",
        productsServices: ["Kurta Sets", "Fusion Ethnic Dresses", "Handblock Print Sarees"],
        brandTone: "playful",
        uniqueValueProposition: "Authentic Jaipuri handblock prints reimagined into modern, everyday comfort wear.",
        topCompetitors: ["Biba", "FabIndia", "Local online boutiques"],
        primaryGoal: "sales",
        monthlyBudget: "₹15,000",
        createdAt: new Date()
      } as BusinessProfile,
      calendar: [
        { date: "2026-04-10", dayOfWeek: "Friday", theme: "Summer Collection Drop", contentPillar: "promotional", postType: "reel", caption: "The Jaipur Summer Edit is LIVE! ☀️ Featuring breathable pure cotton kurta sets that keep you cool and stylish. Which color are you grabbing?", hashtags: ["#SummerFashion", "#JaipuriPrint", "#KurtaSets"], suggestedTime: "6:00 PM IST" },
        { date: "2026-04-11", dayOfWeek: "Saturday", theme: "Styling Reel", contentPillar: "entertaining", postType: "reel", caption: "1 Kurta, 3 Ways to Style it! 👗 From office meeting to evening chai date. Watch the magic happen.", hashtags: ["#StyleInspo", "#VersatileFashion"], suggestedTime: "12:00 PM IST" },
        { date: "2026-04-12", dayOfWeek: "Sunday", theme: "Customer Showcase", contentPillar: "inspirational", postType: "carousel", caption: "You girls look stunning! 😍 Swipe to see some of our favorite looks from our lovely customers this weekend.", hashtags: ["#PriyasBoutiqueFamily", "#OOTDIndia"], suggestedTime: "2:00 PM IST" },
        { date: "2026-04-13", dayOfWeek: "Monday", theme: "Artisan Spotlight", contentPillar: "educational", postType: "story", caption: "Meet Ramesh ji, the master artisan behind our intricate handblock prints. Every motif is stamped completely by hand! ✋✨", hashtags: ["#HandmadeWithLove", "#ArtisansOfIndia"], suggestedTime: "10:00 AM IST" },
        { date: "2026-04-14", dayOfWeek: "Tuesday", theme: "Baisakhi Brights", contentPillar: "promotional", postType: "carousel", caption: "Celebrate Baisakhi in bright, beautiful hues! Shop our Yellow and Orange collection with code BAISAKHI10. 🌼", hashtags: ["#BaisakhiOutfit", "#FestiveWear"], suggestedTime: "1:00 PM IST", festivalHook: "Baisakhi outfits" },
        { date: "2026-04-15", dayOfWeek: "Wednesday", theme: "Fabric Care Guide", contentPillar: "educational", postType: "static", caption: "Want your handblock prints to last forever? Always wash in cold water with mild detergent inside-out! 💧 Save this post for laundry day.", hashtags: ["#FashionTips", "#SustainableFashion"], suggestedTime: "5:00 PM IST" },
        { date: "2026-04-16", dayOfWeek: "Thursday", theme: "Flash Sale Teaser", contentPillar: "entertaining", postType: "story", caption: "Something BIG drops tomorrow at noon. Turn on post notifications! 👀💸", hashtags: ["#SaleAlert"], suggestedTime: "8:00 PM IST" }
      ] as CalendarDay[],
      captions: [
        { id: "pb-c1", tone: "Playful", caption: "Warning: Wearing our new Anarkali set may cause sudden twirling and an influx of compliments! 💃✨ You've been warned.", hashtags: ["#TwirlWorthy", "#EthnicWear", "#DesiGirl"], cta: "Shop your twirl-outfit through the link in bio!", characterCount: 182, platform: "instagram" },
        { id: "pb-c2", tone: "Emotional", caption: "Connecting you to the roots of Rajasthan. 🏜️ Every piece is a labor of love by our master weavers and block printers. Wear a story, not just a dress.", hashtags: ["#MadeInIndia", "#Handcrafted", "#Sustainable"], cta: "Explore our artisan collection online.", characterCount: 195, platform: "instagram" },
        { id: "pb-c3", tone: "Direct", caption: "NEW ARRIVALS 🚨 Our much-awaited Cotton Kurta sets are restocked in 5 new pastel shades. Sizes XS to XXL available. Selling fast!", hashtags: ["#RestockAlert", "#SummerKurta", "#ShopNow"], cta: "Click here to buy securely online | Free Shipping on prepaid.", characterCount: 198, platform: "facebook" }
      ] as CaptionVariation[],
      festivals: [
        { festival: "Navratri", date: "2026-09-22", daysUntil: 174, region: "national", campaignIdea: "9 Days, 9 Colors Campaign", contentAngles: ["Color coordinated outfit releases", "Garba night ready looks", "Influencer collaboration series"], urgency: "low", postTypes: ["reel", "carousel"], sampleCaption: "Get Navratri ready with us! 💃 9 vibrant colors for 9 nights of magic. Shop the collection and twirl away!" },
        { festival: "Raksha Bandhan", date: "2026-08-28", daysUntil: 149, region: "national", campaignIdea: "Gift her the perfect outfit.", contentAngles: ["Brother's gifting guide", "Matching sibling outfits", "Express delivery promo"], urgency: "low", postTypes: ["carousel", "story"], sampleCaption: "Brothers, we've got you sorted. Gift her an authentic handblock suit this Rakhi. Delivered in 3 days! 🎁" },
        { festival: "Baisakhi", date: "2026-04-13", daysUntil: 12, region: "north", campaignIdea: "Harvest Hues Collection", contentAngles: ["Yellow / Orange color palette showcase", "Bhangra ready comfy suits"], urgency: "high", postTypes: ["reel"], sampleCaption: "Celebrate Baisakhi in style! Bright, beautiful, and absolutely vibrant. 🌾💛" },
        { festival: "Mother's Day", date: "2026-05-10", daysUntil: 39, region: "global", campaignIdea: "Twinning with Mom", contentAngles: ["Mother-daughter photoshoots", "Matching Sarees & Kurtas", "Gift cards for Mom"], urgency: "medium", postTypes: ["carousel"], sampleCaption: "Because style runs in the family. Shop our special Mother-Daughter matching sets this Mother's Day! 👩‍👧" }
      ] as FestivalCampaign[],
      ads: [
        { id: "pb-ad1", campaignName: "Instagram Reel Discovery", objective: "conversions", platform: "Meta Ads (Instagram)", targetAudience: "Women 18-35 in Tier 1 & 2 cities interested in ethnic fashion and online shopping.", budgetRecommendation: "₹8,000/month (₹266/day)", estimatedReach: "40,000 - 60,000 users", estimatedCPC: "₹7.50", adCopyVariations: ["Tired of boring kurtas? Upgrade your summer wardrobe with authentic Jaipuri prints! 🌸", "The most comfortable and trendy fusion wear you'll find online. Shop now at ₹1299!"], visualRecommendation: "Upbeat Reel demonstrating a quick outfit change highlighting the fabric flow.", aiInsight: "Reel ads have a 45% lower CPA for apparel brands compared to static images." },
        { id: "pb-ad2", campaignName: "Abandoned Cart Recovery", objective: "sales", platform: "Meta Ads (Facebook + IG)", targetAudience: "Users who added to cart but didn't purchase in the last 14 days.", budgetRecommendation: "₹4,000/month", estimatedReach: "4,000 warm users", estimatedCPC: "₹18.00", adCopyVariations: ["Did you leave something behind? 🛒 Take 10% off to easily complete your purchase. Use code WELCOME10.", "Your beautiful Jaipuri dress is waiting for you! Stock is running low. 🏃‍♀️"], visualRecommendation: "Carousel showing exactly the products they viewed.", aiInsight: "Catalog DPA (Dynamic Product Ads) are essential. This will be your highest ROAS campaign." },
        { id: "pb-ad3", campaignName: "Brand Keywords & Competitor Strike", objective: "traffic", platform: "Google Ads (Search)", targetAudience: "Search terms: 'Jaipuri print cotton suits online', 'affordable ethnic wear', 'buy biba suits online'", budgetRecommendation: "₹3,000/month", estimatedReach: "800 clicks", estimatedCPC: "₹22.00", adCopyVariations: ["Authentic Jaipuri Kurtas | Direct from Artisans | Shop Priya's", "Looking for Trendy Ethnic Wear? | Handblock Prints & More"], visualRecommendation: "Text Search Ad", aiInsight: "Capture intent-driven buyers directly searching for your exact specialization." }
      ] as AdRecommendation[],
      performance: generateTrendData(5.4, 2.5, 9.5, ['Instagram', 'Instagram', 'Pinterest', 'Facebook'])
    }
  }
};

export const SAMPLE_BUSINESS_SELECTOR = [
  { id: 'mumbaiMithai', name: 'Mumbai Mithai House (B2C Food)' },
  { id: 'techVenture', name: 'TechVenture Solutions (B2B SaaS)' },
  { id: 'priyasBoutique', name: "Priya's Boutique (D2C Fashion)" }
];

export function getFallbackPerformanceData(days: number = 30): PerformanceMetric[] {
  return FALLBACK_DATA.businesses.mumbaiMithai.performance.slice(-days);
}

export function getFallbackCalendar(businessName: string): CalendarDay[] {
  const match = Object.values(FALLBACK_DATA.businesses).find(b => b.profile.name === businessName);
  return match?.calendar || FALLBACK_DATA.businesses.mumbaiMithai.calendar;
}

export function getFallbackCaptions(desc: string): CaptionVariation[] {
  return FALLBACK_DATA.businesses.mumbaiMithai.captions;
}

export function getFallbackFestivalCampaign(festival: string): FestivalCampaign {
  const allFests = Object.values(FALLBACK_DATA.businesses).flatMap(b => b.festivals);
  return allFests.find(f => f.festival === festival) || allFests[0];
}

export function getFallbackAdRecommendations(): AdRecommendation[] {
  return FALLBACK_DATA.businesses.mumbaiMithai.ads;
}
