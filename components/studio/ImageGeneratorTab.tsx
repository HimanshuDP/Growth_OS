'use client';

import React, { useState, useEffect } from 'react';
import { SOCIAL_FORMATS, SocialFormat, ImageModel, buildVariationUrls, downloadPollinationsImage, saveImageToDevice, buildAIImagePrompt, getProxiedImageUrl } from '@/lib/pollinations';
import { Loader2, Sparkles, Image as ImageIcon, Download, Copy, RefreshCw, Layout, Smartphone, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PostToSocialModal from '@/components/social/PostToSocialModal';

export default function ImageGeneratorTab() {
  const router = useRouter();
  const [brief, setBrief] = useState('');
  const [style, setStyle] = useState<'photorealistic' | 'illustration' | 'vibrant' | 'minimal'>('photorealistic');
  const [format, setFormat] = useState<SocialFormat>(SOCIAL_FORMATS[0]);
  const [model, setModel] = useState<ImageModel>('flux');
  const [enhance, setEnhance] = useState(true);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrls, setGeneratedUrls] = useState<string[]>([]);
  const [aiPromptObj, setAiPromptObj] = useState<any>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [showSocialModal, setShowSocialModal] = useState(false);

  const handleGenerate = async () => {
    if (!brief) return;
    setIsGenerating(true);
    setGeneratedUrls([]);
    setAiPromptObj(null);
    setLoadedImages({});
    setSelectedImg(null);

    let finalPrompt = brief;
    let palette = null;
    let suggestedModel = model;

    if (enhance) {
       try {
         const profileStr = localStorage.getItem('growthOS_businessProfile');
         let businessName = "Business", industry = "Retail", tone = "Professional";
         if (profileStr) {
           const profile = JSON.parse(profileStr);
           businessName = profile.businessName || profile.name || "Business";
           industry = profile.industry || "Retail";
           tone = profile.brandTone || "Professional";
         }

         const res = await fetch('/api/generate-image-prompt', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             businessName, industry, captionTheme: brief, brandTone: tone, festivalHook: null, style
           })
         });
         
         const data = await res.json();
         finalPrompt = data.imagePrompt;
         palette = data.colorPalette;
         if (data.suggestedModel) suggestedModel = data.suggestedModel.includes('realism') ? 'flux-realism' : data.suggestedModel.includes('turbo') ? 'turbo' : 'flux';
         
         setAiPromptObj(data);
       } catch (err) {
         console.error(err);
       }
    }

    const urls = buildVariationUrls(finalPrompt, format, 4, suggestedModel);
    setGeneratedUrls(urls);
  };

  const handleDownload = async (url: string) => {
    try {
      const blob = await downloadPollinationsImage(url);
      saveImageToDevice(blob, `growthos_${Date.now()}.png`);
    } catch {
      alert("Failed to download");
    }
  };

  const saveToLibraryAndUse = (url: string) => {
    const assets = JSON.parse(localStorage.getItem('growthOS_library') || '[]');
    assets.push({
      id: `img_${Date.now()}`,
      type: 'image',
      pollinationsUrl: url,
      prompt: brief,
      aiPrompt: aiPromptObj?.imagePrompt || brief,
      format,
      model,
      createdAt: new Date().toISOString(),
      tags: ['studio_image']
    });
    localStorage.setItem('growthOS_library', JSON.stringify(assets));
    router.push('/captions'); // Navigates to captions to pair with
  };

  return (
    <>
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[800px]">
      {/* LEFT PANEL */}
      <div className="lg:w-[40%] space-y-8 pr-4">
        
        <section>
          <label className="block text-sm font-bold text-white mb-2">What to create</label>
          <textarea 
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            className="w-full h-24 bg-slate-900 border border-slate-700/50 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-orange outline-none resize-none"
            placeholder="e.g. A Diwali gift hamper with golden diyas and sweets, warm festive lighting"
          />
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => {
                const cal = JSON.parse(localStorage.getItem('growthOS_calendar') || '{}');
                const today = cal.posts?.[0]?.theme || "Our main product offering";
                setBrief(today);
              }}
              className="text-[10px] bg-brand-orange/10 text-brand-orange px-2 py-1 rounded hover:bg-brand-orange/20 transition-colors"
            >
               Use Today's Calendar Theme
            </button>
          </div>
        </section>

        <section>
          <label className="block text-sm font-bold text-white mb-3">Style</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'photorealistic', label: '📸 Photorealistic' },
              { id: 'illustration', label: '🎨 Illustrated' },
              { id: 'vibrant', label: '✨ Vibrant & Bold' },
              { id: 'minimal', label: '🎯 Minimal & Clean' }
            ].map(s => (
              <button 
                key={s.id}
                onClick={() => setStyle(s.id as any)}
                className={`p-3 rounded-xl border text-left text-sm transition-all ${style === s.id ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'bg-slate-900/50 border-slate-800 text-white/70 hover:border-slate-700'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-sm font-bold text-white mb-3">Format</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
             {SOCIAL_FORMATS.slice(0, 4).map(f => (
               <button 
                 key={f.name}
                 onClick={() => setFormat(f)}
                 className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${format.name === f.name ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' : 'bg-slate-900/50 border-slate-800 text-white/70 hover:border-slate-700'}`}
               >
                 {f.aspectRatio === '1:1' ? <Layout size={20}/> : <Smartphone size={20} />}
                 <span className="text-[10px] text-center font-semibold">{f.label}</span>
               </button>
             ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-white">AI Enhancement</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={enhance} onChange={e => setEnhance(e.target.checked)} className="accent-brand-orange w-4 h-4" />
              <span className="text-xs text-white/70">Let AI optimize prompt</span>
            </label>
          </div>
        </section>

        <button 
          onClick={handleGenerate}
          disabled={!brief || isGenerating}
          className="w-full py-4 rounded-xl bg-gradient-saffron text-white font-bold text-lg hover:shadow-lg hover:shadow-brand-orange/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
          {isGenerating ? "Generating Variations..." : "Generate Images"}
        </button>

      </div>

      {/* RIGHT PANEL */}
      <div className="lg:w-[60%] bg-slate-900/30 rounded-3xl border border-slate-800 p-6 relative flex flex-col overflow-y-auto">
         {generatedUrls.length === 0 && !isGenerating && (
           <div className="flex-1 flex flex-col items-center justify-center opacity-30">
               <ImageIcon size={64} className="mb-4" />
               <p>Your generated images will appear here</p>
           </div>
         )}

         {(isGenerating || generatedUrls.length > 0) && (
           <div className="space-y-6">
              
              {!selectedImg && (
                <div className="grid grid-cols-2 gap-4">
                  {generatedUrls.map((url, i) => (
                    <div key={url} className="relative aspect-square sm:aspect-auto rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group">
                      {!loadedImages[i] && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800">
                           <Loader2 size={24} className="animate-spin text-brand-orange opacity-50" />
                        </div>
                      )}
                      
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        referrerPolicy="no-referrer"
                        src={getProxiedImageUrl(url)} 
                        alt="Generation" 
                        onLoad={() => setLoadedImages(prev => ({...prev, [i]: true}))}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${loadedImages[i] ? 'opacity-100' : 'opacity-0'}`}
                      />

                      {loadedImages[i] && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                          <button onClick={() => setSelectedImg(url)} className="w-full py-2 bg-brand-orange text-white text-sm font-bold rounded-lg hover:bg-brand-orange/80">
                            Select Image
                          </button>
                          <button onClick={() => handleDownload(url)} className="w-full py-2 bg-white/20 text-white text-sm font-bold rounded-lg hover:bg-white/30 flex justify-center items-center gap-2">
                            <Download size={16} /> Download
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {isGenerating && generatedUrls.length === 0 && [1,2,3,4].map(i => (
                     <div key={i} className="aspect-square rounded-xl bg-slate-800 animate-pulse border border-slate-700"></div>
                  ))}
                </div>
              )}

              {selectedImg && (
                 <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img referrerPolicy="no-referrer" src={getProxiedImageUrl(selectedImg)} alt="Selected" className="max-h-[500px] rounded-xl shadow-2xl border border-slate-700" />
                    
                    <div className="mt-6 flex flex-wrap gap-3 justify-center w-full">
                        <button onClick={() => setShowSocialModal(true)} className="flex-1 min-w-[200px] py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2">
                           <Share2 size={18} /> Post to Social
                        </button>
                        <button onClick={() => saveToLibraryAndUse(selectedImg)} className="flex-1 min-w-[200px] py-3 bg-brand-orange/20 border border-brand-orange/30 text-brand-orange font-bold rounded-xl hover:bg-brand-orange/30 flex items-center justify-center gap-2">
                           <Sparkles size={18} /> Pair with Caption
                        </button>
                        <button onClick={() => handleDownload(selectedImg)} className="flex-1 min-w-[150px] py-3 bg-slate-800 border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-700 flex items-center justify-center gap-2">
                           <Download size={18} /> Download
                        </button>
                        <button onClick={() => setSelectedImg(null)} className="w-full mt-2 py-2 text-sm text-white/50 hover:text-white">
                           ← Back to variations
                        </button>
                    </div>
                 </div>
              )}

              {aiPromptObj && !isGenerating && (
                <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-4">
                   <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">AI Optimized Prompt</p>
                   <p className="text-sm text-white/80 font-mono bg-black/30 p-3 rounded-lg border border-white/5">
                     {aiPromptObj.imagePrompt}
                   </p>
                </div>
              )}

           </div>
         )}
      </div>
    </div>

    <PostToSocialModal
      isOpen={showSocialModal}
      onClose={() => setShowSocialModal(false)}
      imageUrl={selectedImg || undefined}
      mediaType="image"
      initialCaption={aiPromptObj?.captionText || `✨ Fresh content from our studio! ${brief}`}
      initialHashtags={aiPromptObj?.hashtags || ['GrowthOS', 'IndianBusiness', 'DigitalMarketing']}
    />
    </>
  );
}
