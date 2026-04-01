"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  BarChart3, TrendingUp, TrendingDown, Eye, MousePointerClick, Filter, 
  Download, Lightbulb, Zap, AlertTriangle, Target, Sparkles 
} from 'lucide-react';
import { FALLBACK_DATA } from '@/lib/fallback-data';

export default function PerformancePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const [dateRange, setDateRange] = useState('Last 30 days');

  useEffect(() => {
    setMounted(true);
    const rawProfile = localStorage.getItem('growthOS_businessProfile');
    if (!rawProfile) {
      router.push('/onboard');
      return;
    }
    setProfile(JSON.parse(rawProfile));

    const fetchData = async () => {
      try {
        const res = await fetch('/api/performance-data');
        const d = await res.json();
        setData(d.data);
      } catch (e) {
         console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [router]);

  if (!mounted || !profile || loading || !data) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center">
         <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4"></div>
         <p className="text-slate-400 animate-pulse">Querying Analytics Endpoints...</p>
      </div>
    );
  }

  // Defensive extraction
  const metrics = data.metrics || [];
  const aiInsight = data.aiInsight || "";
  
  // Calculate aggregated data if missing from API
  const aggregated = data.aggregated || {
    impressions: metrics.reduce((acc: number, m: any) => acc + (m.impressions || 0), 0),
    reach: metrics.reduce((acc: number, m: any) => acc + (m.reach || 0), 0),
    clicks: metrics.reduce((acc: number, m: any) => acc + (m.clicks || 0), 0),
    spend: metrics.reduce((acc: number, m: any) => acc + (m.spend || 0), 0),
    revenue: metrics.reduce((acc: number, m: any) => acc + (m.revenue || 0), 0),
  };

  // derived metrics
  const avgCtr = aggregated.impressions > 0 ? ((aggregated.clicks / aggregated.impressions) * 100).toFixed(2) : "0.00";
  const avgCpc = aggregated.clicks > 0 ? (aggregated.spend / aggregated.clicks).toFixed(2) : "0";

  // Transform data for charts
  const barData = [
    { name: 'Instagram', ctr: 3.4, fill: '#ec4899' },
    { name: 'Facebook', ctr: 2.1, fill: '#3b82f6' },
    { name: 'LinkedIn', ctr: 1.8, fill: '#0ea5e9' }
  ];

  const contentFormatData = [
    { name: 'Carousel', engRate: 5.2 },
    { name: 'Reel/Video', engRate: 8.4 },
    { name: 'Static Image', engRate: 2.1 },
    { name: 'Story', engRate: 3.8 }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 pb-24 font-sans">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="flex items-center gap-3">
           <BarChart3 className="w-6 h-6 text-indigo-400"/> 
           <h1 className="text-2xl font-bold text-white">Performance Analytics</h1>
         </div>
         <div className="flex gap-3 items-center w-full md:w-auto">
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none flex-1 md:w-auto">
              <option>Last 7 days</option>
              <option>Last 14 days</option>
              <option>Last 30 days</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700 whitespace-nowrap">
              <Filter className="w-4 h-4"/> Filter
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white text-slate-900 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap">
              <Download className="w-4 h-4"/> Export Report
            </button>
         </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
         
         {/* KPI ROW */}
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
               <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><Eye className="w-3 h-3"/> Impressions</div>
               <div className="text-2xl font-black text-white mb-1">{aggregated.impressions.toLocaleString('en-IN')}</div>
               <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium"><TrendingUp className="w-3 h-3"/> +12.4% vs prior</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
               <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Reach</div>
               <div className="text-2xl font-black text-white mb-1">{aggregated.reach.toLocaleString('en-IN')}</div>
               <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium"><TrendingUp className="w-3 h-3"/> +8.1% vs prior</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
               <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><MousePointerClick className="w-3 h-3"/> Avg CTR</div>
               <div className="text-2xl font-black text-white mb-1">{avgCtr}%</div>
               <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium"><TrendingUp className="w-3 h-3"/> +0.2% vs prior</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
               <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg CPC</div>
               <div className="text-2xl font-black text-white mb-1">₹{parseFloat(avgCpc).toLocaleString('en-IN')}</div>
               <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium"><TrendingDown className="w-3 h-3"/> -₹0.4 vs prior</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
               <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Conversions</div>
               <div className="text-2xl font-black text-white mb-1">{(aggregated.impressions * 0.02 * 0.1).toFixed(0)}</div>
               <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium"><TrendingUp className="w-3 h-3"/> +14.2% vs prior</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden shadow-lg">
               <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay"></div>
               <div className="relative z-10">
                 <div className="text-emerald-400/80 text-xs font-bold uppercase tracking-wider mb-2">Overall ROAS</div>
                 <div className="text-2xl font-black text-emerald-400 mb-1">{(aggregated.revenue / (aggregated.spend || 1)).toFixed(1)}x</div>
                 <div className="text-xs text-emerald-500 flex items-center gap-1 font-medium"><TrendingUp className="w-3 h-3"/> Stable</div>
               </div>
            </div>
         </div>

         {/* CHARTS LAYER 1 */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Traffic Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:col-span-2 shadow-xl">
               <h3 className="text-lg font-bold text-white mb-6">Audience Growth ({dateRange})</h3>
               <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={metrics} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                     <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val.split('-').slice(1).join('/')} minTickGap={30}/>
                     <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`}/>
                     <Tooltip 
                       contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff'}}
                       itemStyle={{color: '#fff'}}
                     />
                     <Legend verticalAlign="top" height={36}/>
                     <Area yAxisId="left" type="monotone" dataKey="impressions" name="Impressions" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorImp)" />
                     <Area yAxisId="left" type="monotone" dataKey="reach" name="Reach" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorReach)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* AI Insights Panel */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 shadow-xl flex flex-col">
               <div className="flex items-center gap-2 text-indigo-400 font-bold mb-6">
                  <Sparkles className="w-5 h-5"/> Gemini AI Analysis
               </div>
               
               <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-2"><Zap className="w-4 h-4 text-emerald-400"/> What's Working</h4>
                    <p className="text-sm text-slate-300 leading-relaxed pl-6 relative">
                       <span className="absolute left-1 top-2 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                       Your Reel formats are driving 3x the organic reach of your static images. Keep utilizing trending audio.
                    </p>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-2"><AlertTriangle className="w-4 h-4 text-orange-400"/> Needs Attention</h4>
                    <p className="text-sm text-slate-300 leading-relaxed pl-6 relative">
                       <span className="absolute left-1 top-2 w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                       Facebook engagement has dropped 12% WoW. Consider reducing link-posts and focusing on native engagement questions.
                    </p>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mt-4">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-indigo-300 mb-2"><Target className="w-4 h-4"/> Next Action</h4>
                    <p className="text-xs text-indigo-100">Reallocate 20% of your Facebook static image budget into Instagram Reels. Expected ROAS increase: <strong>+0.4x</strong> over next 7 days.</p>
                  </div>
               </div>
               
               <button className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700">
                  Implement Recommendations
               </button>
            </div>
         </div>

         {/* CHARTS LAYER 2 */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* CTR by Platform */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
               <h3 className="text-lg font-bold text-white mb-6">Avg CTR by Platform</h3>
               <div className="h-60 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                     <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`}/>
                     <YAxis dataKey="name" type="category" stroke="#e2e8f0" fontSize={12} tickLine={false} axisLine={false} width={80}/>
                     <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px'}}/>
                     <Bar dataKey="ctr" radius={[0, 4, 4, 0]}>
                       {barData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.fill} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Content Format Perf */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
               <h3 className="text-lg font-bold text-white mb-6">Engagement by Format</h3>
               <div className="h-60 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={contentFormatData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                     <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`}/>
                     <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px'}}/>
                     <Bar dataKey="engRate" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40}/>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
