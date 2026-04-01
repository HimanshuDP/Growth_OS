"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PartyPopper, CalendarDays, Loader2, Sparkles, AlertTriangle, 
  MapPin, Flame, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import { FALLBACK_DATA } from '@/lib/fallback-data';

export default function FestivalsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [festivals, setFestivals] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('All Upcoming');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeRegion, setActiveRegion] = useState('All India');
  
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);

  useEffect(() => {
    const rawProfile = localStorage.getItem('growthOS_businessProfile');
    if (!rawProfile) {
      router.push('/onboard');
      return;
    }
    const p = JSON.parse(rawProfile);
    setProfile(p);

    const fetchFestivals = async () => {
      try {
        if (p.name === 'Mumbai Mithai House') {
          await new Promise(r => setTimeout(r, 1000));
          setFestivals(FALLBACK_DATA.businesses.mumbaiMithai.festivals);
        } else {
          const res = await fetch('/api/detect-festivals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ businessProfile: p })
          });
          const data = await res.json();
          setFestivals(data.data || []);
        }
      } catch (e) {
        console.error("Festival fetch error", e);
      }
      setLoading(false);
    };
    fetchFestivals();
  }, [router]);

  // Filters logic
  const filteredFestivals = festivals.filter(f => {
    if (activeCategory !== 'All' && !f.category?.includes(activeCategory)) return false;
    if (activeRegion !== 'All India' && !f.region?.includes(activeRegion)) return false;
    if (activeFilter === 'Next 7 days') return f.daysUntil <= 7;
    if (activeFilter === 'Next 30 days') return f.daysUntil <= 30;
    if (activeFilter === 'Next 3 months') return f.daysUntil <= 90;
    return true; // 'All Upcoming'
  });

  const getUrgencyBanner = () => {
    const imminent = festivals.find(f => f.daysUntil <= 7);
    if (imminent) return { event: imminent, color: 'red' };
    const soon = festivals.find(f => f.daysUntil <= 14);
    if (soon) return { event: soon, color: 'amber' };
    return null;
  };

  const urgency = getUrgencyBanner();
  const trends = ['#IPL2026', '#RamNavami', '#SummerSale', '#MakeInIndia', '#StartupIndia', '#GreenFuture', '#WomenEntrepreneurs', '#DigitalIndia'];

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200">
      
      {/* Urgency Banner */}
      {urgency && (
        <div className={`px-6 py-3 flex items-center justify-center gap-2 font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity ${urgency.color === 'red' ? 'bg-red-500/20 text-red-400 border-b border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-b border-amber-500/30'}`} onClick={() => document.getElementById(`fest-${urgency.event.festival || urgency.event.name}`)?.scrollIntoView({behavior: 'smooth'})}>
          <AlertTriangle className="w-5 h-5"/> 
          🚨 {urgency.event.festival || urgency.event.name} is in {urgency.event.daysUntil} days — Create your campaign now!
        </div>
      )}

      {/* Header & Filters */}
      <div className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-6 py-4 space-y-4">
         <div className="flex items-center gap-3 max-w-7xl mx-auto">
           <PartyPopper className="w-6 h-6 text-yellow-500"/> 
           <h1 className="text-2xl font-bold text-white">Festival Detector</h1>
         </div>
         
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Time Range */}
            <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto w-full md:w-auto">
               {['Next 7 days', 'Next 30 days', 'Next 3 months', 'All Upcoming'].map(f => (
                 <button key={f} onClick={() => setActiveFilter(f)} className={`whitespace-nowrap px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeFilter === f ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                    {f}
                 </button>
               ))}
            </div>
            
            <div className="flex gap-3 overflow-x-auto w-full md:w-auto pb-1">
               {/* Category Filter */}
               <select value={activeCategory} onChange={e => setActiveCategory(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                 {['All', 'Religious', 'National', 'Commercial', 'Cultural'].map(c => <option key={c} value={c}>{c} Category</option>)}
               </select>

               {/* Region Filter */}
               <select value={activeRegion} onChange={e => setActiveRegion(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                 {['All India', 'North India', 'South India', 'East India', 'West India', 'Global'].map(r => <option key={r} value={r}>{r}</option>)}
               </select>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 pb-24">
         
         {loading ? (
           <div className="flex flex-col items-center justify-center p-32">
             <Loader2 className="w-10 h-10 animate-spin text-yellow-500 mb-4" />
             <p className="text-slate-400 animate-pulse">Mapping Indian cultural calendar to your business...</p>
           </div>
         ) : filteredFestivals.length === 0 ? (
           <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
             <CalendarDays className="w-12 h-12 text-slate-600 mx-auto mb-4"/>
             <h3 className="text-xl font-bold text-white mb-2">No festivals found</h3>
             <p className="text-slate-400">Try adjusting your filters to see more upcoming events.</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
             {filteredFestivals.map((fest, idx) => {
               const urgencyColor = fest.daysUntil <= 7 ? 'bg-red-500/10 text-red-400 border-red-500/20' : fest.daysUntil <= 14 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
               const mPriority = fest.marketingPriority || (fest.urgency === 'high' ? 9 : fest.urgency === 'medium' ? 6 : 3);
               const priorityColor = mPriority >= 8 ? 'bg-red-500' : mPriority >= 5 ? 'bg-yellow-500' : 'bg-emerald-500';
               
               return (
                 <div key={idx} id={`fest-${fest.festival || fest.name}`} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-colors flex flex-col">
                    <div className="p-6 border-b border-slate-800">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                           <h2 className="text-2xl font-bold text-white mb-1">{fest.festival || fest.name}</h2>
                           <div className="text-sm text-slate-400">{new Date(fest.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${urgencyColor}`}>
                          {fest.daysUntil === 0 ? 'Today' : `In ${fest.daysUntil} days`}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-800 text-slate-300 rounded"><MapPin className="w-3 h-3"/> {fest.region}</span>
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-800 text-slate-300 rounded"><CalendarDays className="w-3 h-3"/> {fest.category || 'Cultural'}</span>
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-800 text-slate-300 rounded">
                           <div className={`w-2 h-2 rounded-full ${priorityColor}`}></div> Priority: {mPriority}/10
                        </span>
                      </div>

                      {/* Colors */}
                      {fest.colors && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-slate-500 font-medium">Palette:</span>
                          {fest.colors.map((c: string, ci: number) => <div key={ci} className="w-4 h-4 rounded-full border border-slate-700 shadow-sm transition-transform hover:scale-125" style={{backgroundColor: c}} title={c}></div>)}
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                       <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 mb-6">
                         <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2"><Sparkles className="w-4 h-4"/> AI Campaign Idea</div>
                         <p className="text-sm text-indigo-100/80 leading-relaxed">{fest.campaignIdea || fest.aiCampaignIdea || `A special ${fest.festival || fest.name} campaign targeting your core audience.`}</p>
                       </div>

                       <div className="mb-6">
                         <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3">Content Angles</h4>
                         <ul className="space-y-2">
                           {fest.contentAngles?.map((angle: string, i: number) => (
                             <li key={i} className="flex gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> <span>{angle}</span></li>
                           ))}
                         </ul>
                       </div>

                       <div className="mb-6">
                         <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2 flex justify-between items-end">
                           Caption Draft <button className="text-indigo-400 hover:text-indigo-300 text-xs normal-case" onClick={() => {navigator.clipboard.writeText(fest.sampleCaption); alert('Copied!');}}>Copy text</button>
                         </h4>
                         <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm text-slate-300 font-mono whitespace-pre-wrap">
                           {fest.sampleCaption || "Coming soon..."}
                         </div>
                       </div>
                       
                       <div className="mt-auto pt-4 border-t border-slate-800">
                         <p className="text-xs text-slate-500 mb-4"><strong>Visuals:</strong> {fest.visualRecommendation || "Festive colors with product focus."}</p>
                         <button onClick={() => { localStorage.setItem('growthOS_captionContext', `Tying my product to ${fest.festival || fest.name}`); router.push('/captions'); }} className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                            Open in Caption Generator <ChevronRight className="w-4 h-4"/>
                         </button>
                       </div>
                    </div>
                 </div>
               );
             })}
           </div>
         )}

         {/* Trending Topics Section */}
         <div className="mt-16 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-white font-bold text-2xl">
               <Flame className="w-6 h-6 text-orange-500"/> This Week's Trending Topics
            </div>
            <p className="text-slate-400 mb-6">Real-time hashtags trending across India. Click any trend to see how {profile.name} can leverage it.</p>
            
            <div className="flex flex-wrap gap-3">
              {trends.map(trend => (
                <button key={trend} onClick={() => setSelectedTrend(trend)} className="px-4 py-2 bg-slate-950 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 rounded-full text-slate-300 text-sm font-medium transition-all hover:-translate-y-1">
                  {trend}
                </button>
              ))}
            </div>
         </div>
      </div>

      {/* Trend Modal */}
      {selectedTrend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTrend(null)}>
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><Flame className="w-5 h-5 text-orange-500"/> {selectedTrend}</h3>
              <button onClick={() => setSelectedTrend(null)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-4">
               <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
                 <h4 className="font-bold text-indigo-400 mb-2">Strategy 1: The Direct Hook</h4>
                 <p className="text-sm text-slate-300">Run a limited-time {selectedTrend} flash sale highlighting your top-selling items to ride the organic search volume.</p>
               </div>
               <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                 <h4 className="font-bold text-emerald-400 mb-2">Strategy 2: The Value Add</h4>
                 <p className="text-sm text-slate-300">Create an informative carousel post explaining how your services align perfectly with the themes behind {selectedTrend}.</p>
               </div>
               <button onClick={() => { localStorage.setItem('growthOS_captionContext', `Tying my product to ${selectedTrend}`); router.push('/captions'); }} className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-sm border border-slate-700">
                 Write Captions for this Trend
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
