"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, Copy, 
  Sparkles, Clock, PartyPopper, Image as ImageIcon, Loader2, Play,
  Cpu, Database, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDemo } from '@/context/DemoContext';
import { CalendarSkeleton } from '@/components/Skeletons';
import LoadingOverlay from '@/components/LoadingOverlay';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dynamic from 'next/dynamic';

const ContentPillarBadge = dynamic(() => import('@/components/ml/ContentPillarBadge'), { ssr: false });
const OptimalTimeWidget = dynamic(() => import('@/components/ml/OptimalTimeWidget'), { ssr: false });
import { buildAIImagePrompt, buildVariationUrls, SOCIAL_FORMATS, getProxiedImageUrl } from '@/lib/pollinations';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CalendarPage() {
  const router = useRouter();
  const { isDemoMode, demoBusiness } = useDemo();
  const [profile, setProfile] = useState<any>(null);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'ai' | 'cached' | 'fallback' | null>(null);
  const [selectedDay, setSelectedDay] = useState<any>(null);

  // Pollinations state
  const [generatingVisuals, setGeneratingVisuals] = useState<boolean>(false);
  const [generatedVisuals, setGeneratedVisuals] = useState<string[]>([]);
  const [selectedVisual, setSelectedVisual] = useState<string | null>(null);

  useEffect(() => {
    const rawProfile = localStorage.getItem('growthOS_businessProfile');
    if (!rawProfile) {
      router.push('/onboard');
      return;
    }
    setProfile(JSON.parse(rawProfile));
    
    const storedCal = localStorage.getItem('growthOS_calendar');
    const storedSource = localStorage.getItem('growthOS_calendar_source');
    try {
      if (storedCal) {
        const parsed = JSON.parse(storedCal);
        if (Array.isArray(parsed)) setCalendar(parsed);
        else if (parsed?.calendar && Array.isArray(parsed.calendar)) setCalendar(parsed.calendar);
        else if (parsed?.data && Array.isArray(parsed.data)) setCalendar(parsed.data);
        else setCalendar([]);
        setSource(storedSource as any || 'cached');
      }
    } catch(e) {
      setCalendar([]);
    }
  }, [router]);

  const generateCalendar = async () => {
    if (!profile) return;
    setLoading(true);
    
    // Simulate initial delay for "Analyzing" message even in demo
    const startTime = Date.now();

    try {
      const res = await fetch('/api/generate-calendar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-demo-mode': isDemoMode.toString(),
          'x-demo-business': demoBusiness
        },
        body: JSON.stringify({ 
          businessProfile: profile, 
          weekStartDate: new Date().toISOString().split('T')[0] 
        })
      });
      
      const data = await res.json();
      
      // Ensure minimum 1.5s delay for smooth transition
      const elapsed = Date.now() - startTime;
      if (elapsed < 1500) await new Promise(r => setTimeout(r, 1500 - elapsed));

      const actualData = Array.isArray(data.data) ? data.data : (data.data?.calendar || []);
      setCalendar(actualData);
      setSource(data.source);
      localStorage.setItem('growthOS_calendar', JSON.stringify(actualData));
      localStorage.setItem('growthOS_calendar_source', data.source);
      
      toast.success(`Calendar generated for the week of ${new Date().toLocaleDateString()}`);
      if (data.source === 'cached') {
        toast('Using high-quality cached data', { icon: '⚡', style: { border: '1px solid #f59e0b', color: '#f59e0b' } });
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate calendar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string = 'Content') => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const getPillarColor = (pillar: string) => {
    const p = pillar?.toLowerCase() || '';
    if (p.includes('edu')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (p.includes('promo') || p.includes('sale')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (p.includes('entert')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  if (!profile) return null;

  return (
    <div className="flex flex-col gap-6">
      <LoadingOverlay isLoading={loading} messages={[
        "Analyzing your business niche...",
        "Scanning Indian festival calendar...",
        "Calculating optimal posting times...",
        "Crafting human-centric captions..."
      ]} />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-indigo-500"/> Content Calendar
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Strategic 7-day plan optimized for {profile.name}</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {calendar.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <button 
                onClick={() => copyToClipboard(calendar.map(c => c.caption).join('\n\n---\n\n'), 'All captions')} 
                className="px-3 py-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all"
              >
                Copy All Captions
              </button>
            </div>
          )}
          <button 
            onClick={generateCalendar} 
            disabled={loading} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-black bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>} 
            {calendar.length === 0 ? 'Generate Strategy' : 'Regenerate Strategy'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {/* Source Badge */}
        {calendar.length > 0 && source && (
          <div className={cn(
            "absolute -top-3 right-0 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-xl animate-in zoom-in duration-500",
            source === 'ai' ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"
          )}>
            {source === 'ai' ? <Cpu size={12}/> : <Database size={12}/>}
            {source === 'ai' ? 'AI Generated Real-time' : 'High-Quality Cached Strategy'}
          </div>
        )}

        {calendar.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.02]">
             <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 shadow-inner">
               <Play className="w-10 h-10 text-indigo-500 ml-1 fill-current"/>
             </div>
             <h2 className="text-3xl font-black text-white mb-4">Ready to Grow?</h2>
             <p className="text-slate-400 mb-10 max-w-md text-center leading-relaxed font-medium">
               Click the button above to build an autonomous 7-day social media calendar based on {profile.name}'s exact target persona.
             </p>
             <button onClick={generateCalendar} className="px-8 py-4 bg-white text-indigo-950 font-black rounded-2xl shadow-2xl hover:bg-indigo-50 transition-all flex items-center gap-3 text-lg group">
                Generate My Plan <Sparkles className="w-5 h-5 text-indigo-600 transition-transform group-hover:rotate-12"/>
             </button>
          </div>
        ) : loading ? (
          <CalendarSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-5 overflow-visible">
            {calendar.map((day, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                   setSelectedDay(day);
                   setGeneratedVisuals([]);
                   setSelectedVisual(day.pollinationsImg || null);
                }}
                className="group relative bg-slate-900/50 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/30 rounded-3xl p-5 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 min-h-[420px] flex flex-col"
              >
                  <div className="flex justify-between items-center mb-6">
                    <div className="font-black text-xl text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{day.dayOfWeek}</div>
                    <div className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-lg uppercase tracking-wider">{day.date.split('-').slice(1).reverse().join('/')}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className={cn("text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 border rounded-xl", getPillarColor(day.contentPillar))}>
                      {day.contentPillar}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white mb-4 leading-tight group-hover:translate-x-1 transition-transform">{day.theme}</h3>
                  
                  <div className="flex-1 relative overflow-hidden">
                     <p className="text-sm text-slate-400 leading-relaxed font-medium line-clamp-4">
                       {day.caption}
                     </p>
                     <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-slate-950/0 to-transparent"></div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/5 space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span className="flex items-center gap-1.5 text-indigo-400/80"><Clock size={14}/> {day.suggestedTime}</span>
                        <span>{day.hashtags?.length || 0} Tags</span>
                     </div>
                     {day.festivalHook && (
                       <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] px-3 py-2 rounded-xl flex items-center gap-2 font-black uppercase tracking-widest">
                         <PartyPopper size={14} className="shrink-0 animate-bounce"/> {day.festivalHook}
                       </div>
                     )}
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ ML MODULE 5: OPTIMAL TIME WIDGET ═══ */}
      {!loading && (
        <div className="mt-6">
          <OptimalTimeWidget industry={profile?.industry || 'retail'} />
        </div>
      )}

      {/* Slide-over panel for day details */}
      {selectedDay && (
        <>
          <div className="fixed inset-0 bg-black/80 z-[150] backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedDay(null)}></div>
          <div className="fixed inset-y-0 right-0 max-w-2xl w-full bg-slate-950 border-l border-white/10 z-[160] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col m-0 animate-in slide-in-from-right duration-500 ease-out">
             
             <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-indigo-950/20">
                <div>
                   <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{selectedDay.date}</div>
                   <h2 className="text-3xl font-black text-white tracking-tight uppercase">{selectedDay.dayOfWeek}</h2>
                </div>
                <button onClick={() => setSelectedDay(null)} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all active:scale-90"><ChevronRight className="w-6 h-6"/></button>
             </div>

             <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                
                {/* Rationale Block */}
                {selectedDay.rationale && (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-3xl text-sm text-indigo-200 relative overflow-hidden">
                    <span className="font-black uppercase tracking-widest text-[10px] text-indigo-400 flex items-center gap-1.5 mb-3"><Sparkles size={14}/> AI Reasoning & Strategy</span>
                    <p className="font-medium leading-relaxed italic">"{selectedDay.rationale}"</p>
                  </div>
                )}

                {/* ═══ ML MODULE 4: CONTENT PILLAR CLASSIFIER ═══ */}
                {selectedDay.caption && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                    <ContentPillarBadge
                      captionText={selectedDay.caption}
                      aiSuggestedPillar={selectedDay.contentPillar}
                    />
                  </div>
                )}

                {/* Caption Block */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Ready-to-Post Caption</h3>
                    <button 
                      onClick={() => copyToClipboard(selectedDay.caption, 'Caption')} 
                      className="text-xs font-black text-indigo-400 hover:text-indigo-300 flex items-center gap-2 p-1.5 hover:bg-indigo-500/10 rounded-lg transition-all"
                    >
                      <Copy size={16}/> Copy text
                    </button>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] shadow-inner">
                    <p className="text-slate-200 text-base font-medium whitespace-pre-line leading-loose tracking-wide">{selectedDay.caption}</p>
                  </div>
                </div>

                {/* Hashtags Block */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Handpicked Hashtags</h3>
                    <button 
                      onClick={() => copyToClipboard(selectedDay.hashtags?.join(' '), 'All hashtags')} 
                      className="text-xs font-black text-indigo-400 hover:text-indigo-300 flex items-center gap-2 p-1.5 hover:bg-indigo-500/10 rounded-lg transition-all"
                    >
                      <Copy size={16}/> Copy all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                     {selectedDay.hashtags?.map((tag: string, i: number) => (
                       <span 
                         key={i} 
                         onClick={() => copyToClipboard(tag, 'Hashtag')} 
                         className="cursor-pointer bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/30 text-slate-400 text-xs font-bold px-4 py-2 rounded-xl transition-all border border-white/5 active:scale-95"
                       >
                         {tag.startsWith('#') ? tag : `#${tag}`}
                       </span>
                     ))}
                  </div>
                </div>

                {/* Pollinations AI Integration */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                     <ImageIcon size={16}/> AI Visual Production
                  </h3>
                  
                  {selectedVisual ? (
                     <div className="aspect-square bg-slate-800 rounded-2xl overflow-hidden border border-white/10 relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getProxiedImageUrl(selectedVisual)} alt="Generated post" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                           <a href={selectedVisual} download className="p-3 bg-white text-black font-bold rounded-xl flex items-center gap-2">
                             <Download size={16} /> Save Image
                           </a>
                           <button onClick={() => setSelectedVisual(null)} className="p-3 bg-red-500 text-white font-bold rounded-xl flex items-center gap-2">
                             Remove
                           </button>
                        </div>
                     </div>
                  ) : (
                     <>
                        <button 
                          disabled={generatingVisuals}
                          className="w-full py-4 bg-brand-orange hover:bg-brand-orange/80 text-white font-bold rounded-2xl flex justify-center items-center gap-2 transition-all disabled:opacity-50"
                          onClick={async () => {
                             setGeneratingVisuals(true);
                             try {
                                const prompt = await buildAIImagePrompt(
                                   profile.name, profile.industry, selectedDay.theme, profile.brandTone || 'Professional', selectedDay.festivalHook || null, 'vibrant'
                                );
                                const format = SOCIAL_FORMATS.find(f => f.name === 'instagram_post')!;
                                const urls = buildVariationUrls(prompt, format, 4, 'flux');
                                setGeneratedVisuals(urls);
                             } catch(err) {
                               toast.error("Failed to generate visuals");
                             } finally {
                               setGeneratingVisuals(false);
                             }
                          }}
                        >
                           {generatingVisuals ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                           {generatingVisuals ? "Crafting Visuals with Flux AI..." : "Generate Post Image (Free)"}
                        </button>

                        {generatedVisuals.length > 0 && (
                          <div className="grid grid-cols-2 gap-3 mt-4">
                            {generatedVisuals.map((url, i) => (
                               <div key={i} className="aspect-square bg-slate-800 rounded-xl overflow-hidden relative cursor-pointer group" onClick={() => {
                                  setSelectedVisual(url);
                                  // Assign to day in state and local storage
                                  const updated = calendar.map(d => d.date === selectedDay.date ? {...d, pollinationsImg: url} : d);
                                  setCalendar(updated);
                                  localStorage.setItem('growthOS_calendar', JSON.stringify(updated));
                               }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={getProxiedImageUrl(url)} alt={`gen-${i}`} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 flex justify-center">
                                     <span className="text-xs font-bold text-white uppercase bg-brand-orange px-2 py-1 rounded">Select</span>
                                  </div>
                               </div>
                            ))}
                          </div>
                        )}
                     </>
                  )}
                </div>

             </div>

          </div>
        </>
      )}
    </div>
  );
}
