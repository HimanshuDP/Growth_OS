'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ImageGeneratorTab from '@/components/studio/ImageGeneratorTab';
import VideoCreatorTab from '@/components/studio/VideoCreatorTab';
import PostTemplatesTab from '@/components/studio/PostTemplatesTab';
import { Image as ImageIcon, Video, LayoutTemplate, Library } from 'lucide-react';

export default function CreativeStudioPage() {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'template'>('image');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="bg-gradient-saffron text-transparent bg-clip-text">Creative</span> Studio
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Free, limitless AI visual generation. Powered by Pollinations.ai.
          </p>
        </div>
        
        <Link 
          href="/studio/library"
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white transition-all shadow-lg"
        >
          <Library size={16} className="text-brand-teal" />
          My Library
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 border border-slate-700/50 p-1.5 rounded-2xl overflow-x-auto hide-scrollbar">
         {[
           { id: 'image', label: 'Image Generator', icon: <ImageIcon size={16} />, desc: 'AI Prompts' },
           { id: 'video', label: 'Video Creator', icon: <Video size={16} />, desc: 'Reels & Shorts' },
           { id: 'template', label: 'Post Templates', icon: <LayoutTemplate size={16} />, desc: 'Canvas Editor' }
         ].map(t => (
           <button
             key={t.id}
             onClick={() => setActiveTab(t.id as any)}
             className={`flex flex-col sm:flex-row sm:items-center p-3 sm:px-6 sm:py-3 rounded-xl gap-2 sm:gap-3 flex-1 min-w-[140px] transition-all duration-300 ${activeTab === t.id ? 'bg-slate-800 text-white shadow-md border border-slate-700' : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'}`}
           >
              <div className={activeTab === t.id ? 'text-brand-orange' : ''}>{t.icon}</div>
              <div className="text-left">
                 <p className="text-sm font-bold leading-tight">{t.label}</p>
                 <p className="text-[10px] hidden sm:block opacity-60 mt-0.5">{t.desc}</p>
              </div>
           </button>
         ))}
      </div>

      {/* Content Area */}
      <div className="mt-6 bg-slate-950 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl">
        {activeTab === 'image' && <ImageGeneratorTab />}
        {activeTab === 'video' && <VideoCreatorTab />}
        {activeTab === 'template' && <PostTemplatesTab />}
      </div>

    </div>
  );
}
