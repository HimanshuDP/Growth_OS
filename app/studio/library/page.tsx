'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Download, RefreshCw, Filter, Copy } from 'lucide-react';


export default function StudioLibraryPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = () => {
    const raw = localStorage.getItem('growthOS_library');
    if (raw) setAssets(JSON.parse(raw));
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear your local library history?")) {
      localStorage.removeItem('growthOS_library');
      setAssets([]);
    }
  };

  const deleteAsset = (id: string) => {
    const fresh = assets.filter(a => a.id !== id);
    localStorage.setItem('growthOS_library', JSON.stringify(fresh));
    setAssets(fresh);
  };

  const filteredAssets = assets.filter(a => filter === 'all' || a.type === filter).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/studio" className="p-2 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">My Library</h1>
            <p className="text-xs text-white/50 mt-1">Historically generated AI assets stored locally.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-slate-900 border border-slate-700 text-sm text-white rounded-lg px-3 py-2 outline-none">
             <option value="all">All Media</option>
             <option value="image">Images</option>
             <option value="video">Videos</option>
             <option value="template">Templates</option>
           </select>
           <button onClick={clearAll} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-bold hover:bg-red-500/20 flex items-center gap-2">
             <Trash2 size={16} /> Clear All
           </button>
        </div>
      </div>

      {/* Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-24 bg-slate-900/30 border border-white/5 rounded-3xl">
           <p className="text-white/40">Your library is currently empty.</p>
           <Link href="/studio" className="inline-block mt-4 text-brand-orange hover:text-brand-orange/80 font-bold underline underline-offset-4">Go to Creative Studio</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {filteredAssets.map(asset => (
             <div key={asset.id} className="relative group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden aspect-[4/5] flex flex-col justify-between p-2">
                {asset.type === 'image' && asset.pollinationsUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={asset.pollinationsUrl} alt="Library Item" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-lg" loading="lazy" />
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                     <button onClick={() => deleteAsset(asset.id)} className="p-1.5 bg-red-500 rounded text-white shadow"><Trash2 size={14}/></button>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] text-white/70 line-clamp-2 leading-tight">{asset.prompt}</p>
                     <div className="flex gap-2">
                        {asset.pollinationsUrl && (
                          <a href={asset.pollinationsUrl} download className="flex-1 py-1.5 bg-brand-orange text-white text-xs font-bold rounded text-center">DL</a>
                        )}
                        <Link href="/captions" className="flex-1 py-1.5 bg-white/20 text-white text-xs font-bold rounded flex items-center justify-center">Pair</Link>
                     </div>
                  </div>
                </div>
                
                <div className="absolute top-4 left-4">
                   <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-black/60 text-white border border-white/20 backdrop-blur-sm">
                     {asset.format?.label || asset.type}
                   </span>
                </div>
             </div>
           ))}
        </div>
      )}

    </div>
  );
}
