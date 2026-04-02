'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { getProxiedImageUrl } from '@/lib/pollinations';
import { useRouter } from 'next/navigation';

export default function StudioQuickAccess() {
  const router = useRouter();
  const [recentAssets, setRecentAssets] = useState<any[]>([]);
  const [concept, setConcept] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('growthOS_library');
    if (raw) {
      const items = JSON.parse(raw).filter((a: any) => a.type === 'image' && a.pollinationsUrl);
      setRecentAssets(items.slice(0, 3));
    }
  }, []);

  const handleQuickCreate = () => {
     if (concept) {
       // A cheap way to pass initial state — just save briefly to localstorage or pass via URL params.
       // Easiest is just sending them to /studio for now as this is a quick action panel. 
       // In a real app we'd pass state via context or query params.
       router.push(`/studio`);
     }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
       <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-[50px] -mr-10 -mt-10 transition-opacity"></div>
       
       <div className="flex items-center justify-between mb-4 relative z-10">
         <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-orange/20 text-brand-orange rounded-lg">
              <Sparkles size={16} />
            </div>
            <h3 className="text-lg font-bold text-white">Creative Studio</h3>
         </div>
         <span className="text-[10px] font-black tracking-wider text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded uppercase">NEW</span>
       </div>

       <p className="text-sm text-white/50 mb-4 relative z-10">Generate stunning post images instantly with AI.</p>

       <div className="space-y-3 relative z-10">
          <input 
            type="text" 
            placeholder="What would you like to create?"
            value={concept}
            onChange={e => setConcept(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-brand-orange outline-none"
          />
          
          <div className="flex gap-2">
             <button className="flex-1 py-1.5 text-xs bg-slate-800 text-white/70 hover:text-white rounded-lg border border-slate-700">Post (1:1)</button>
             <button className="flex-1 py-1.5 text-xs bg-slate-800 text-white/70 hover:text-white rounded-lg border border-slate-700">Story (9:16)</button>
             <button className="flex-1 py-1.5 text-xs bg-slate-800 text-white/70 hover:text-white rounded-lg border border-slate-700">Banner</button>
          </div>

          <button 
            onClick={handleQuickCreate}
            className="w-full py-3 mt-2 bg-gradient-saffron text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all flex justify-center items-center gap-2"
          >
             Generate Now <ArrowRight size={14} />
          </button>
       </div>

       {recentAssets.length > 0 && (
         <div className="mt-6 pt-4 border-t border-slate-800 relative z-10">
            <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold text-white/50">Recent History</span>
               <Link href="/studio/library" className="text-xs text-brand-orange hover:underline">View All</Link>
            </div>
            <div className="flex gap-2">
               {recentAssets.map(asset => (
                 <div key={asset.id} className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 relative group/img cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img referrerPolicy="no-referrer" src={getProxiedImageUrl(asset.pollinationsUrl)} alt="recent" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                       <ImageIcon size={12} className="text-white" />
                    </div>
                 </div>
               ))}
               <div className="flex-1 flex flex-col justify-center pl-2">
                 <p className="text-xs font-bold text-brand-teal">{recentAssets.length}+</p>
                 <p className="text-[10px] text-white/40 leading-tight">images generated<br/>this week</p>
               </div>
            </div>
         </div>
       )}
    </div>
  );
}
