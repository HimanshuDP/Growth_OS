"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Target, TrendingUp, IndianRupee, Users, Sparkles, Loader2, PenTool, 
  MapPin, Clock, Camera, Settings, ArrowRight, Activity, Zap
} from 'lucide-react';
import { FALLBACK_DATA } from '@/lib/fallback-data';

export default function AdsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  // Budget Calculator State
  const [dailyBudget, setDailyBudget] = useState(1000);
  const [duration, setDuration] = useState(30);

  // Benchmarks
  const CPM = 120; // Cost per 1000 impressions
  const CTR = 0.025; // 2.5%
  const CR = 0.15; // 15% close rate
  const AOV = 2500; // Avg Order Value

  const handleCalculate = () => {
    const totalSpend = dailyBudget * duration;
    const impressions = (totalSpend / CPM) * 1000;
    const clicks = impressions * CTR;
    const leads = clicks * CR;
    const revenue = leads * AOV;
    const roas = revenue > 0 ? (revenue / totalSpend).toFixed(2) : "0.00";

    return { totalSpend, impressions, clicks, leads, revenue, roas };
  };

  const calc = handleCalculate();

  useEffect(() => {
    setMounted(true);
    const rawProfile = localStorage.getItem('growthOS_businessProfile');
    if (!rawProfile) {
      router.push('/onboard');
      return;
    }
    const p = JSON.parse(rawProfile);
    setProfile(p);

    const fetchAds = async () => {
      try {
        if (p.name === 'Mumbai Mithai House') {
          await new Promise(r => setTimeout(r, 1200));
          setCampaigns(FALLBACK_DATA.businesses.mumbaiMithai.ads);
        } else {
          const res = await fetch('/api/ad-recommendations', {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ businessProfile: p })
          });
          const data = await res.json();
          setCampaigns(data.data);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchAds();
  }, [router]);

  if (!mounted) return <div className="min-h-screen bg-[#0F172A]" />;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 pb-24 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-6 py-4">
         <div className="flex items-center gap-3 max-w-7xl mx-auto">
           <Zap className="w-6 h-6 text-blue-400"/> 
           <h1 className="text-2xl font-bold text-white">Ad Optimizer <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded ml-2 uppercase font-bold tracking-widest">Simulated Mode</span></h1>
         </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        
        {/* Top Overview Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
             <div className="flex items-center gap-2 text-slate-400 mb-2"><Users className="w-4 h-4"/> <span className="text-xs font-bold uppercase tracking-wider">Weekly Reach</span></div>
             <div className="text-3xl font-extrabold text-white">{(calc.impressions / (duration/7)).toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
           </div>
           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
             <div className="flex items-center gap-2 text-slate-400 mb-2"><IndianRupee className="w-4 h-4"/> <span className="text-xs font-bold uppercase tracking-wider">Suggested Budget</span></div>
             <div className="text-3xl font-extrabold text-white">₹{dailyBudget}<span className="text-sm font-medium text-slate-500">/day</span></div>
           </div>
           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
             <div className="flex items-center gap-2 text-emerald-400 mb-2 relative z-10"><TrendingUp className="w-4 h-4"/> <span className="text-xs font-bold uppercase tracking-wider">Projected ROAS</span></div>
             <div className="text-3xl font-extrabold text-emerald-400 relative z-10">{calc.roas}x</div>
           </div>
           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
             <div className="flex items-center gap-2 text-slate-400 mb-2"><Activity className="w-4 h-4"/> <span className="text-xs font-bold uppercase tracking-wider">Active Ad Sets</span></div>
             <div className="text-3xl font-extrabold text-white">{campaigns.length || 0}</div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Main Recommendations Column */}
           <div className="lg:col-span-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-400"/> AI Recommended Campaigns</h2>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center p-20 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                  <p className="text-slate-400">Calculating audience overlaps and bid strategies...</p>
                </div>
              ) : campaigns.length === 0 ? (
                 <p>No campaigns generated yet.</p>
              ) : (
                <div className="space-y-6">
                  {campaigns.map((camp, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-slate-800 gap-4">
                          <div>
                            <div className="flex gap-2 items-center mb-1">
                              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{camp.objective}</span>
                              <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Camera className="w-3 h-3"/> {camp.platform}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">{camp.campaignName}</h3>
                          </div>
                          <div className="text-right">
                             <div className="text-xs text-slate-400 mb-1">Estimated Return</div>
                             <div className="text-2xl font-black text-emerald-400">{camp.estimatedROAS || camp.projectedROAS || "2.5"}x</div>
                          </div>
                       </div>

                       <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Audience & Budget Block */}
                          <div className="space-y-6">
                             <div>
                               <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2"><Target className="w-4 h-4"/> Target Audience</h4>
                               <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm space-y-3">
                                  <div className="flex gap-2 items-center text-slate-300">
                                    <span className="font-semibold text-white w-16">Demo:</span> 
                                    <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">{camp.audience?.ageRange || camp.targetAudience?.age || "25-45"}</span>
                                    <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">{camp.audience?.gender || camp.targetAudience?.gender || "All"}</span>
                                  </div>
                                  <div className="flex gap-2 items-start text-slate-300">
                                    <span className="font-semibold text-white w-16 shrink-0 mt-0.5">Loc:</span> 
                                    <div className="flex flex-wrap gap-1">
                                      <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-xs">
                                        <MapPin className="w-3 h-3"/> {camp.audience?.location || camp.targetAudience?.location || (camp.targetAudience && typeof camp.targetAudience ==='string' ? camp.targetAudience.split('.')?.[0] : "Mumbai")}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 items-start text-slate-300">
                                    <span className="font-semibold text-white w-16 shrink-0 mt-0.5">Interests:</span> 
                                    <div className="flex flex-wrap gap-1">
                                      {(camp.audience?.interests || camp.targetAudience?.interests || ["Traditional Sweets", "Gifting", "Desserts"]).map((i: string) => (
                                        <span key={i} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{i}</span>
                                      ))}
                                    </div>
                                  </div>
                               </div>
                             </div>

                             <div>
                               <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2"><IndianRupee className="w-4 h-4"/> Metrics</h4>
                               <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                  <div className="flex justify-between text-sm mb-4">
                                     <span className="text-slate-400">Daily Budget</span>
                                     <span className="font-bold text-white">₹{camp.budget?.daily || camp.budgetRecommendation?.match(/₹?([\d,]+)/)?.[1] || camp.budgetRecommendation || "333"}</span>
                                  </div>
                                  <div className="space-y-1 mb-4">
                                     <div className="flex justify-between text-xs font-medium text-blue-400">
                                        <span>Est. Daily Reach</span>
                                        <span>{camp.budget?.estimatedReach || camp.estimatedReach || "1,500"}</span>
                                     </div>
                                     <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{width: '75%'}}></div>
                                     </div>
                                  </div>
                                  <div className="flex justify-between text-xs text-slate-500 border-t border-slate-800 pt-3">
                                     <span>Avg CPC: <strong className="text-slate-300">₹{camp.budget?.estimatedCPC || camp.estimatedCPC || "12.50"}</strong></span>
                                     <span>Est CTR: <strong className="text-slate-300">{camp.budget?.estimatedCTR || camp.estimatedCTR || "2.5%"}</strong></span>
                                  </div>
                               </div>
                             </div>
                          </div>

                          {/* Ad Copy & Creative */}
                          <div className="space-y-6">
                            <div>
                               <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2"><PenTool className="w-4 h-4"/> Primary Copy</h4>
                               <div className="space-y-3">
                                 {(camp.adCopy?.headlines || camp.headlineOptions || camp.adCopyVariations?.slice(0, 2) || ["Craving authentic sweets?"]).map((h: string, i: number) => (
                                   <div key={i} className="text-sm font-bold text-white bg-slate-950 px-3 py-2 rounded-lg border border-slate-700">"{h}"</div>
                                 ))}
                                 <div className="text-sm text-slate-300 leading-relaxed bg-slate-950 px-3 py-3 rounded-lg border border-slate-800">
                                   {camp.adCopy?.primaryTexts?.[0] || camp.adCopyVariations?.[0] || "Freshly delivered Mumbai mithai at your doorstep."}
                                 </div>
                               </div>
                            </div>

                            <div>
                               <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2"><Camera className="w-4 h-4"/> Creative Brief</h4>
                               <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl text-orange-200 text-sm">
                                 {camp.creativeDirection || camp.visualRecommendation || "A high-quality image of traditional sweets."}
                               </div>
                            </div>

                            <div className="mt-auto">
                               <button onClick={() => alert('Simulated Platform: Export to Meta Ads Manager coming soon.')} className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                                  Push to Ads Manager <ArrowRight className="w-4 h-4"/>
                                </button>
                            </div>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
           </div>

           {/* Right Column (Widget) */}
           <div className="lg:col-span-4 space-y-6">
              
              {/* Budget Simulator Widget */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
                 <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Settings className="w-5 h-5"/> Live Simulator</h2>
                 
                 <div className="space-y-5 mb-8">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                         <span className="font-medium text-slate-300">Daily Ad Budget</span>
                         <span className="text-white font-bold bg-slate-800 px-2 rounded">₹{dailyBudget}</span>
                      </div>
                      <input type="range" min="100" max="10000" step="100" value={dailyBudget} onChange={e => setDailyBudget(e.target.valueAsNumber)} className="w-full accent-indigo-500"/>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                         <span className="font-medium text-slate-300">Campaign Duration</span>
                         <span className="text-white font-bold bg-slate-800 px-2 rounded">{duration} Days</span>
                      </div>
                      <input type="range" min="7" max="90" step="1" value={duration} onChange={e => setDuration(e.target.valueAsNumber)} className="w-full accent-indigo-500"/>
                    </div>
                 </div>

                 <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                       <span className="text-slate-400">Total Spend</span>
                       <span className="font-bold text-white text-base">₹{calc.totalSpend.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-px w-full bg-slate-800 my-2"></div>
                    <div className="flex justify-between">
                       <span className="text-slate-400">Est. Impressions (<abbr title="Cost per 1k views: ₹120">CPM</abbr>)</span>
                       <span className="font-medium text-blue-400">{calc.impressions.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-400">Est. Link Clicks</span>
                       <span className="font-medium text-indigo-400">{calc.clicks.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-400">Est. Leads / Sales</span>
                       <span className="font-bold text-white">{calc.leads.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
                    </div>
                    <div className="h-px w-full bg-slate-800 my-2"></div>
                    <div className="flex justify-between items-center bg-emerald-500/10 p-2 rounded border border-emerald-500/20 -mx-2">
                       <span className="text-emerald-400 font-bold">Projected Revenue</span>
                       <span className="font-black text-emerald-400 text-lg">₹{calc.revenue.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
                    </div>
                    <div className="text-center text-xs text-slate-500 mt-2">Based on Indian SME benchmark CR 15% and AOV ₹2.5k</div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}
