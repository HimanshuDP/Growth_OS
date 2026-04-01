"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Sparkles, Calendar, PenTool, PartyPopper, BarChart3, 
  ChevronDown, ChevronUp, Bell, TrendingUp, Lightbulb, X
} from 'lucide-react';
import { FALLBACK_DATA, getUpcomingFestivals } from '@/lib/fallback-data';
import { Festival } from '@/lib/festivals-india';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [dailyTip, setDailyTip] = useState("");
  const [showDemoBar, setShowDemoBar] = useState(true);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedDay, setSelectedDay] = useState<any>(null);

  useEffect(() => {
    const rawProfile = localStorage.getItem('growthOS_businessProfile');
    if (!rawProfile) {
      router.push('/onboard');
      return;
    }
    const p = JSON.parse(rawProfile);
    setProfile(p);

    // Initial load: Fetch performance data
    fetch('/api/performance-data')
      .then(res => res.json())
      .then(d => {
        setPerformanceData(d.data?.metrics?.slice(-7) || []); // Last 7 days for small chart
        
        // Cache daily tip
        const today = new Date().toISOString().split('T')[0];
        const cachedTip = localStorage.getItem(`growthOS_tip_${today}`);
        if (cachedTip) {
          setDailyTip(cachedTip);
        } else if (d.data?.aiInsight) {
          setDailyTip(d.data.aiInsight);
          localStorage.setItem(`growthOS_tip_${today}`, d.data.aiInsight);
        } else {
          setDailyTip("Consistency is key. Even when reach dips, stick to your content pillars.");
        }
      })
      .catch(() => setDailyTip("Consistency is key. Stand out with authentic brand stories."));

    // Fetch calendar if it exists in local storage
    const storedCal = localStorage.getItem('growthOS_calendar');
    if (storedCal) setCalendarData(JSON.parse(storedCal));

    // Dynamic import to avoid SSR issues with 'lib/festivals-india' dates
    import('@/lib/festivals-india').then(module => {
       setFestivals(module.getUpcomingFestivals(30).slice(0, 3));
    });

    setLoading(false);
  }, [router]);

  const loadSample = (companyKey: keyof typeof FALLBACK_DATA.businesses) => {
    const data = FALLBACK_DATA.businesses[companyKey];
    localStorage.setItem('growthOS_businessProfile', JSON.stringify(data.profile));
    localStorage.setItem('growthOS_calendar', JSON.stringify(data.calendar));
    window.location.reload();
  };

  if (loading || !profile) return <div className="min-h-screen bg-[#0F172A] p-8 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 p-4 md:p-8 font-sans pb-24">
      {/* Demo Bar */}
      {showDemoBar && (
        <div className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-200 rounded-xl p-3 mb-8 flex justify-between items-center text-sm relative z-50">
          <div className="flex items-center gap-3">
             <span className="font-semibold">Demo Mode</span>
             <select onChange={(e) => loadSample(e.target.value as any)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 outline-none text-slate-300">
                <option value="mumbaiMithai">Mumbai Mithai House (B2C)</option>
                <option value="techVenture">TechVenture Solutions (B2B)</option>
                <option value="priyasBoutique">Priya's Boutique (D2C)</option>
             </select>
          </div>
          <button onClick={() => setShowDemoBar(false)}><X className="w-4 h-4 hover:text-white"/></button>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          
          <header className="flex justify-between items-end">
            <div>
              <p className="text-slate-400 capitalize mb-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome back, {profile.name} <span className="inline-block animate-wave">👋</span></h1>
            </div>
            <div className="hidden sm:flex w-10 h-10 rounded-full bg-slate-800 border border-slate-700 items-center justify-center relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </header>

          {/* Business Intelligence Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            <div className="flex items-start gap-4 mb-4">
               <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20"><Sparkles className="w-6 h-6"/></div>
               <div>
                 <h2 className="text-xl font-bold text-white mb-2">AI Marketing Intelligence</h2>
                 <blockquote className="text-slate-300 italic border-l-2 border-indigo-500 pl-4 py-1 leading-relaxed">
                   "{profile.marketingInsight || profile.uniqueValueProposition || "Your business holds unique potential in the local market. Maintaining a consistent voice is your biggest lever for growth."}"
                 </blockquote>
               </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4 mt-6">
              <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-medium text-slate-300 capitalize">{profile.brandTone} Tone</span>
              <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-medium text-slate-300">{profile.industry}</span>
              <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-medium text-slate-300">{profile.location}</span>
              <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-medium text-slate-300">{profile.primaryGoal}</span>
            </div>

            <button onClick={() => setShowFullProfile(!showFullProfile)} className="text-indigo-400 text-sm font-medium flex items-center gap-1 hover:text-indigo-300">
              {showFullProfile ? 'Hide Profile Details' : 'View Full AI Profile'} {showFullProfile ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
            </button>

            {showFullProfile && (
              <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm animate-in fade-in duration-300">
                <div>
                  <h4 className="font-bold text-white mb-1">Target Audience</h4>
                  <p className="text-slate-400 leading-relaxed text-xs">
                    {typeof profile.targetAudiencePersona === 'object' 
                      ? `${profile.targetAudiencePersona.primaryAge} | ${profile.targetAudiencePersona.gender} | Interests: ${profile.targetAudiencePersona.interests?.join(', ')}` 
                      : profile.targetAudience}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Best Posting Times</h4>
                  <p className="text-slate-400 leading-relaxed text-xs">
                    {profile.bestPostingTimes ? Object.entries(profile.bestPostingTimes).map(([k,v]) => `${k}: ${v}`).join(' • ') : "IG: 8AM & 7PM • FB: 1PM • LI: 9AM"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/calendar" className="bg-slate-900 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 transition-all group">
               <div className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform"><Calendar className="w-6 h-6"/></div>
               <span className="text-sm font-medium">Generate<br/>Calendar</span>
            </Link>
            <Link href="/captions" className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 transition-all group">
               <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform"><PenTool className="w-6 h-6"/></div>
               <span className="text-sm font-medium">Create<br/>Caption</span>
            </Link>
            <Link href="/festivals" className="bg-slate-900 border border-slate-800 hover:border-yellow-500/50 hover:bg-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 transition-all group">
               <div className="w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform"><PartyPopper className="w-6 h-6"/></div>
               <span className="text-sm font-medium">Festival<br/>Tracker</span>
            </Link>
            <Link href="/performance" className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 transition-all group">
               <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform"><BarChart3 className="w-6 h-6"/></div>
               <span className="text-sm font-medium">Ad<br/>Performance</span>
            </Link>
          </div>

          {/* This Week's Content */}
          <div className="pt-4">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">This Week's Plan</h3>
                <Link href="/calendar" className="text-sm text-indigo-400 hover:text-indigo-300">View Full Calendar →</Link>
             </div>
             
             {calendarData.length === 0 ? (
               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
                 <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="w-8 h-8 text-slate-500"/></div>
                 <h4 className="text-lg font-bold text-white mb-2">Your week is empty</h4>
                 <p className="text-slate-400 mb-6 max-w-sm mx-auto">Let AI build a highly optimized 7-day social media calendar based on your exact audience.</p>
                 <Link href="/calendar" className="px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 shadow-lg inline-block">Generate Strategy</Link>
               </div>
             ) : (
               <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                 {calendarData.slice(0, 7).map((day, idx) => (
                   <div key={idx} onClick={() => setSelectedDay(day)} className="min-w-[240px] bg-slate-900 border border-slate-800 rounded-xl p-5 snap-start cursor-pointer hover:border-indigo-500/50 transition-colors flex flex-col justify-between h-48">
                     <div>
                       <div className="flex justify-between items-start mb-2">
                         <span className="font-bold text-slate-300">{day.dayOfWeek}</span>
                         <span className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400">{day.postType}</span>
                       </div>
                       <p className="text-white font-medium line-clamp-2 leading-tight">{day.theme}</p>
                     </div>
                     <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-indigo-400 font-medium bg-indigo-500/10 px-2 py-1 rounded">{day.suggestedTime}</span>
                        {day.festivalHook && <span className="text-xs text-orange-400 font-medium"><PartyPopper className="w-3 h-3 inline"/></span>}
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          
          {/* Upcoming Festivals */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-white">Upcoming Festivals</h3>
               <Link href="/festivals" className="text-xs text-indigo-400 hover:text-indigo-300">View All</Link>
            </div>
            <div className="space-y-4">
               {festivals.length > 0 ? festivals.map((f, i) => {
                 const badgeColor = f.daysUntil <= 7 ? 'bg-red-500/20 text-red-400 border-red-500/30' : f.daysUntil <= 14 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                 return (
                   <div key={i} className="flex justify-between items-center border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                     <div>
                       <div className="font-medium text-slate-200">{f.name}</div>
                       <div className="text-xs text-slate-500">{new Date(f.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
                     </div>
                     <div className={`px-2 py-1 border rounded text-xs font-bold ${badgeColor}`}>
                       {f.daysUntil === 0 ? 'Today' : `In ${f.daysUntil} days`}
                     </div>
                   </div>
                 );
               }) : (
                 <p className="text-sm text-slate-500 pb-2">No major festivals in the next 30 days.</p>
               )}
            </div>
          </div>

          {/* Performance Snapshot */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-white">Ad Snapshot <span className="text-xs font-normal text-slate-500 ml-2">(Last 7d)</span></h3>
               <Link href="/performance" className="text-xs text-indigo-400 hover:text-indigo-300">Full Report</Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                 <div className="text-xs text-slate-500 mb-1">Avg Reach</div>
                 <div className="text-lg font-bold text-white">24.5K <TrendingUp className="w-3 h-3 inline text-emerald-400 ml-1"/></div>
               </div>
               <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                 <div className="text-xs text-slate-500 mb-1">Avg ROAS</div>
                 <div className="text-lg font-bold text-white">4.2x <TrendingUp className="w-3 h-3 inline text-emerald-400 ml-1"/></div>
               </div>
               <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                 <div className="text-xs text-slate-500 mb-1">Avg CTR</div>
                 <div className="text-lg font-bold text-white">3.1%</div>
               </div>
               <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                 <div className="text-xs text-slate-500 mb-1">Posts Total</div>
                 <div className="text-lg font-bold text-white">12</div>
               </div>
            </div>

            {/* Micro Chart */}
            <div className="h-32 w-full">
              {performanceData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} itemStyle={{color: '#c7d2fe'}}/>
                    <Area type="monotone" dataKey="reach" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorReach)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Daily Insight */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6">
             <div className="flex items-center gap-2 mb-3 text-indigo-400">
                <Lightbulb className="w-5 h-5"/>
                <span className="font-bold">AI Daily Tip</span>
             </div>
             <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-indigo-500/50 pl-3">
               "{dailyTip}"
             </p>
          </div>

        </div>
      </div>

      {/* Modal for Day details */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDay(null)}>
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
               <div>
                  <h3 className="text-xl font-bold text-white">{selectedDay.dayOfWeek}</h3>
                  <div className="text-sm text-slate-400">{selectedDay.theme}</div>
               </div>
               <button onClick={() => setSelectedDay(null)} className="p-2 hover:bg-slate-800 rounded-full"><X className="w-5 h-5 text-slate-400"/></button>
            </div>
            <div className="p-6 space-y-4">
               <div>
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">Generated Caption</div>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm leading-relaxed text-slate-300 relative">
                     {selectedDay.caption}
                  </div>
               </div>
               <div>
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">Details</div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-slate-800 px-2 py-1 rounded">Format: {selectedDay.postType}</span>
                    <span className="bg-slate-800 px-2 py-1 rounded">Time: {selectedDay.suggestedTime}</span>
                    {selectedDay.festivalHook && <span className="bg-orange-500/20 text-orange-400 border border-orange-500/20 px-2 py-1 rounded">Hook: {selectedDay.festivalHook}</span>}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
