'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, LayoutTemplate, Palette, Type, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { buildPollinationsImageUrl, SOCIAL_FORMATS } from '@/lib/pollinations';

const TEMPLATES = [
  { id: 'product_hero', name: 'Product Hero', tag: 'Instagram Post' },
  { id: 'festival_special', name: 'Festival Special', tag: 'High Engagement' },
  { id: 'offer_blast', name: 'Offer Blast', tag: 'Promotional' },
  { id: 'testimonial', name: 'Testimonial', tag: 'Social Proof' },
];

export default function PostTemplatesTab() {
  const [selectedTemp, setSelectedTemp] = useState(TEMPLATES[0].id);
  const [isExporting, setIsExporting] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  // Template Data
  const [content, setContent] = useState({
    headline: 'New Launch Collection',
    subtext: 'Discover the magic of authentic craftsmanship.',
    offer: '50% OFF',
    brandName: 'GrowthOS Boutique',
    primaryColor: '#FF6B35',
    bgImageUrl: '',
    bgPrompt: 'abstract gradient background, aesthetic, minimal',
  });

  const [isGeneratingBg, setIsGeneratingBg] = useState(false);

  const generateBgImage = () => {
    setIsGeneratingBg(true);
    // Force a new seed
    const url = buildPollinationsImageUrl(
      content.bgPrompt, 
      SOCIAL_FORMATS.find(f => f.name === 'instagram_post')!, 
      'flux', 
      Math.floor(Math.random() * 10000)
    );
    setContent({ ...content, bgImageUrl: url });
    // Simulate loading delay for UX
    setTimeout(() => setIsGeneratingBg(false), 2000);
  };

  const exportAsPng = async () => {
    if (!templateRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(templateRef.current, {
        useCORS: true, 
        scale: 2,
        backgroundColor: null
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `growthos_template_${selectedTemp}.png`;
      a.click();
    } catch(e) {
      console.error(e);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const renderTemplate = () => {
    const bgStyle = content.bgImageUrl ? { backgroundImage: `url(${content.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: '#1E293B' };

    switch (selectedTemp) {
      case 'product_hero':
        return (
          <div ref={templateRef} className="w-[400px] h-[400px] relative overflow-hidden flex flex-col justify-end p-8" style={bgStyle}>
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
             <div className="relative z-10">
                <p className="text-[10px] font-black tracking-[0.2em] text-white/70 uppercase mb-2">{content.brandName}</p>
                <h2 className="text-4xl font-black text-white leading-tight mb-2" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)'}}>
                  {content.headline}
                </h2>
                <div className="mt-4 inline-block px-4 py-2 rounded-full font-bold text-sm" style={{ backgroundColor: content.primaryColor, color: '#fff' }}>
                  Shop Now
                </div>
             </div>
          </div>
        );
      case 'festival_special':
        return (
          <div ref={templateRef} className="w-[400px] h-[400px] relative overflow-hidden flex items-center justify-center p-8 text-center" style={bgStyle}>
             <div className="absolute inset-0" style={{ border: `16px solid ${content.primaryColor}`, opacity: 0.8 }}></div>
             <div className="absolute inset-4 border border-white/20"></div>
             <div className="relative z-10 bg-black/40 backdrop-blur-sm p-6 border border-white/10 rounded-xl">
                <Sparkles size={24} className="mx-auto mb-3" style={{ color: content.primaryColor }} />
                <h2 className="text-3xl font-bold text-white mb-2">{content.headline}</h2>
                <p className="text-sm text-white/80">{content.subtext}</p>
             </div>
          </div>
        );
      case 'offer_blast':
        return (
           <div ref={templateRef} className="w-[400px] h-[400px] relative overflow-hidden flex flex-col items-center justify-center p-8" style={bgStyle}>
              <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply"></div>
              <div className="relative z-10 flex flex-col items-center transform -rotate-3 hover:rotate-0 transition-transform">
                 <div className="bg-white text-black font-black text-6xl px-6 py-2 shadow-[8px_8px_0px_rgba(0,0,0,1)] uppercase">
                   {content.offer}
                 </div>
                 <div className="bg-black text-white font-bold text-xl px-4 py-2 mt-4 shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
                   {content.headline}
                 </div>
              </div>
           </div>
        );
      case 'testimonial':
        return (
          <div ref={templateRef} className="w-[400px] h-[400px] relative overflow-hidden bg-slate-900 p-8 flex flex-col justify-center">
             <div className="text-[120px] font-serif leading-none opacity-20 absolute top-4 left-4" style={{ color: content.primaryColor }}>"</div>
             <p className="relative z-10 text-xl font-medium text-white leading-relaxed italic mt-12 mb-6">
               "{content.subtext}"
             </p>
             <div className="flex items-center gap-1 mb-2">
               {[1,2,3,4,5].map(i => <Sparkles key={i} size={14} style={{ color: content.primaryColor }} className="fill-current" />)}
             </div>
             <p className="text-sm font-bold text-white">{content.headline}</p>
             <p className="text-xs text-white/50">{content.brandName}</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[800px]">
      
      {/* LEFT PANEL */}
      <div className="lg:w-[40%] space-y-6 pr-4 border-r border-white/5 overflow-y-auto">
         <div>
            <label className="block text-sm font-bold text-white mb-3">Select Template</label>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemp(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${selectedTemp === t.id ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'bg-slate-900/50 border-slate-800 text-white hover:border-slate-700'}`}
                >
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-[10px] opacity-60 mt-1">{t.tag}</p>
                </button>
              ))}
            </div>
         </div>

         <div className="pt-4 border-t border-white/5 space-y-4">
            <label className="block text-sm font-bold text-white">Customize Content</label>
            
            <div>
              <label className="block text-[10px] font-bold text-white/50 uppercase mb-1">Headline</label>
              <input type="text" value={content.headline} onChange={e => setContent({...content, headline: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-white/50 uppercase mb-1">Subtext / Quote</label>
              <textarea value={content.subtext} onChange={e => setContent({...content, subtext: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white resize-none" rows={3}></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase mb-1">Offer Text</label>
                <input type="text" value={content.offer} onChange={e => setContent({...content, offer: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase mb-1">Accent Color</label>
                <input type="color" value={content.primaryColor} onChange={e => setContent({...content, primaryColor: e.target.value})} className="w-full h-[42px] cursor-pointer bg-slate-900 border border-slate-700 rounded-lg p-1" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
               <label className="block text-[10px] font-bold text-white/50 uppercase mb-2 flex items-center gap-1"><ImageIcon size={12}/> AI Background</label>
               <div className="flex gap-2">
                 <input type="text" value={content.bgPrompt} onChange={e => setContent({...content, bgPrompt: e.target.value})} className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white" placeholder="Describe background..." />
                 <button onClick={generateBgImage} disabled={isGeneratingBg} className="px-3 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/80 transition-colors disabled:opacity-50">
                   {isGeneratingBg ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                 </button>
               </div>
            </div>
         </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="lg:w-[60%] flex flex-col items-center justify-center bg-black/40 rounded-3xl border border-white/5 p-8 relative">
         <div className="transform scale-90 sm:scale-100 shadow-2xl ring-1 ring-white/10 rounded-xl overflow-hidden bg-slate-900">
           {renderTemplate()}
         </div>

         <div className="w-full max-w-[400px] mt-8 flex flex-col gap-3">
            <button 
              onClick={exportAsPng} 
              disabled={isExporting}
              className="w-full py-4 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange/80 shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isExporting ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
              {isExporting ? "Rendering Image..." : "Export as PNG"}
            </button>
         </div>
         <p className="text-[10px] text-white/30 text-center mt-6 max-w-[400px]">
            Templates are generated securely in your browser using standard HTML/CSS rendering. Best exported using Chrome or Firefox.
         </p>
      </div>

    </div>
  );
}
