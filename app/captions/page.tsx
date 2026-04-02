"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PenTool, Camera, Users, Briefcase, MessageSquare, Sparkles, 
  Copy, RotateCw, AlertTriangle, PartyPopper, Tag, Info, ChevronDown, ChevronUp, Loader2
} from 'lucide-react';
import { FALLBACK_DATA } from '@/lib/fallback-data';
import dynamic from 'next/dynamic';

import JSZip from 'jszip';
import { buildAIImagePrompt, buildVariationUrls, downloadPollinationsImage, SOCIAL_FORMATS } from '@/lib/pollinations';
import { ImageIcon, Download } from 'lucide-react';
const EngagementScore = dynamic(() => import('@/components/ml/EngagementScore'), { ssr: false });
const HashtagAnalyzer = dynamic(() => import('@/components/ml/HashtagAnalyzer'), { ssr: false });

export default function CaptionsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [productDescription, setProductDescription] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [includeOffer, setIncludeOffer] = useState(false);
  const [offerText, setOfferText] = useState('');
  const [festivalHook, setFestivalHook] = useState(false);
  const [captions, setCaptions] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  // Track live textarea values for ML scoring
  const [liveTexts, setLiveTexts] = useState<string[]>([]);

  // Studio states for captions
  const [generatingVisualFor, setGeneratingVisualFor] = useState<number | null>(null);
  const [generatedVisualsMap, setGeneratedVisualsMap] = useState<Record<number, string[]>>({});
  const [selectedVisualMap, setSelectedVisualMap] = useState<Record<number, string | null>>({});
  const [zippingFor, setZippingFor] = useState<number | null>(null);

  useEffect(() => {
    const rawProfile = localStorage.getItem('growthOS_businessProfile');
    if (!rawProfile) {
      router.push('/onboard');
      return;
    }
    setProfile(JSON.parse(rawProfile));
    
    const storedHistory = localStorage.getItem('growthOS_captionsHistory');
    if (storedHistory) setHistory(JSON.parse(storedHistory));

    const pendingContext = localStorage.getItem('growthOS_captionContext');
    if (pendingContext) {
      setProductDescription(pendingContext);
      localStorage.removeItem('growthOS_captionContext');
    }
  }, [router]);

  const generateCaptions = async () => {
    if (!productDescription.trim() || !profile) return;
    setLoading(true);
    
    let finalDescription = productDescription;
    if (includeOffer && offerText) finalDescription += ` [Include this special offer: ${offerText}]`;
    if (festivalHook) finalDescription += ` [Tie this naturally to upcoming Indian festivals]`;

    try {
      if (profile.name === 'Mumbai Mithai House') {
         await new Promise(r => setTimeout(r, 1500));
         const c = FALLBACK_DATA.businesses.mumbaiMithai.captions;
         setCaptions(c);
         setLiveTexts(c.map((v: any) => v.caption + '\n\n' + (v.hashtags?.join(' ') || '')));
         saveToHistory(finalDescription, c);
      } else {
        const res = await fetch('/api/generate-captions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productDescription: finalDescription, businessProfile: profile, platform })
        });
        const data = await res.json();
        setCaptions(data.data);
        setLiveTexts(data.data.map((v: any) => v.caption + '\n\n' + (v.hashtags?.join(' ') || '')));
        saveToHistory(finalDescription, data.data);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to generate captions.');
    }
    setLoading(false);
    // Reset visual map
    setGeneratedVisualsMap({});
    setSelectedVisualMap({});
  };

  const saveToHistory = (desc: string, generatedCaptions: any[]) => {
     const newRecord = { id: Date.now(), timestamp: new Date().toISOString(), description: desc, captions: generatedCaptions, platform };
     const newHistory = [newRecord, ...history].slice(0, 5);
     setHistory(newHistory);
     localStorage.setItem('growthOS_captionsHistory', JSON.stringify(newHistory));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const PlatformIcon = ({ p, active }: { p: string, active: boolean }) => {
    const props = { className: `w-5 h-5 ${active ? 'text-indigo-400' : 'text-slate-500'}` };
    if (p === 'Instagram') return <Camera {...props}/>;
    if (p === 'LinkedIn') return <Briefcase {...props}/>;
    if (p === 'Facebook') return <Users {...props}/>;
    if (p === 'Twitter') return <MessageSquare {...props}/>;
    return null;
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-6 py-4">
         <div className="flex items-center gap-3 max-w-7xl mx-auto">
           <PenTool className="w-6 h-6 text-emerald-400"/> 
           <h1 className="text-2xl font-bold text-white">AI Caption Generator</h1>
           <span className="hidden md:inline-block ml-4 px-3 py-1 bg-slate-800 border border-slate-700 text-xs rounded-full font-medium text-slate-400">
             Tone: {profile.brandTone}
           </span>
         </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
         
         {/* LEFT PANEL: Inputs */}
         <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
               <h2 className="text-lg font-bold text-white mb-4">What's the post about?</h2>
               
               <div className="mb-6">
                 <textarea 
                   rows={5} 
                   value={productDescription}
                   onChange={e => setProductDescription(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 resize-none text-sm placeholder:text-slate-600" 
                   placeholder="e.g. Our new Kaju Katli gift box, priced at ₹599, made with premium cashews, perfect for Diwali gifting..."
                 />
                 <div className="text-right mt-1 text-xs text-slate-500 font-medium">Be as specific as possible (Pricing, ingredients, feelings)</div>
               </div>

               <div className="mb-6">
                 <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wide">Platform Optimization</label>
                 <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-lg">
                    {['Instagram', 'LinkedIn', 'Facebook', 'Twitter'].map(p => (
                      <button key={p} onClick={() => setPlatform(p)} className={`flex-1 flex justify-center py-2 rounded-md transition-colors ${platform === p ? 'bg-slate-800 shadow shadow-black/50' : 'hover:bg-slate-900'}`}>
                         <PlatformIcon p={p} active={platform === p}/>
                      </button>
                    ))}
                 </div>
               </div>

               <div className="space-y-4 mb-8">
                 <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors">
                   <div className="flex items-center gap-3">
                     <PartyPopper className="w-5 h-5 text-orange-400"/>
                     <span className="font-medium text-sm">Tie to upcoming Festival</span>
                   </div>
                   <input type="checkbox" checked={festivalHook} onChange={e => setFestivalHook(e.target.checked)} className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-500"/>
                 </label>

                 <div className={`p-3 bg-slate-950 border border-slate-800 rounded-lg transition-colors ${includeOffer ? 'border-indigo-500/50' : 'hover:border-slate-700'}`}>
                   <label className="flex items-center justify-between cursor-pointer mb-2">
                     <div className="flex items-center gap-3">
                       <Tag className="w-5 h-5 text-emerald-400"/>
                       <span className="font-medium text-sm">Include Specific Offer / CTA</span>
                     </div>
                     <input type="checkbox" checked={includeOffer} onChange={e => setIncludeOffer(e.target.checked)} className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-500"/>
                   </label>
                   {includeOffer && (
                     <input type="text" value={offerText} onChange={e => setOfferText(e.target.value)} placeholder="e.g. Use code DIWALI20 for 20% off" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-300 mt-2 outline-none focus:border-indigo-500"/>
                   )}
                 </div>
               </div>

               <button 
                 onClick={generateCaptions} 
                 disabled={loading || !productDescription.trim()}
                 className="w-full py-4 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
               >
                 {loading ? <Loader2 className="w-6 h-6 animate-spin"/> : <Sparkles className="w-6 h-6"/>}
                 {loading ? 'Writing beautifully...' : 'Generate 3 Variations'}
               </button>
            </div>

            {/* History Accordion */}
            {history.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                 <button onClick={() => setShowHistory(!showHistory)} className="w-full p-4 flex justify-between items-center text-sm font-bold bg-slate-800/50 hover:bg-slate-800 transition-colors">
                   <span>History ({history.length} recent)</span>
                   {showHistory ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                 </button>
                 {showHistory && (
                   <div className="divide-y divide-slate-800">
                     {history.map((h, i) => (
                       <div key={i} className="p-4 flex justify-between items-center group cursor-pointer hover:bg-slate-950/50 transition-colors" onClick={() => {setProductDescription(h.description); setCaptions(h.captions); setLiveTexts(h.captions.map((v: any) => v.caption + '\n\n' + (v.hashtags?.join(' ') || ''))); setPlatform(h.platform || 'Instagram')}}>
                         <div className="truncate pr-4 flex-1">
                           <div className="text-xs text-slate-500 mb-1">{new Date(h.timestamp).toLocaleDateString()} • {h.platform}</div>
                           <div className="text-sm text-slate-300 truncate">{h.description}</div>
                         </div>
                         <RotateCw className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 shrink-0"/>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            )}
         </div>

         {/* RIGHT PANEL: Outputs */}
         <div className="lg:col-span-7 space-y-6">
            {loading ? (
              <div className="bg-slate-900 border border-slate-800 border-dashed rounded-2xl h-[600px] flex flex-col items-center justify-center">
                 <div className="grid grid-cols-2 gap-4 w-64 mb-8">
                   <div className="h-2 bg-indigo-500/20 rounded-full animate-pulse"></div>
                   <div className="h-2 bg-indigo-500/20 rounded-full animate-pulse delay-75"></div>
                   <div className="h-2 bg-indigo-500/20 rounded-full animate-pulse delay-150 col-span-2"></div>
                 </div>
                 <div className="text-slate-400 font-medium">Channeling creative juices...</div>
              </div>
            ) : captions.length > 0 ? (
              <>
                <div className="flex justify-between items-center px-2">
                   <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">Ready to post.</h2>
                   <div className="text-sm font-medium text-slate-500 flex items-center gap-1"><Info className="w-4 h-4"/> Optimized for {platform}</div>
                </div>
                
                <div className="space-y-6">
                  {captions.map((variation, idx) => {
                    const liveText = liveTexts[idx] || (variation.caption + '\n\n' + (variation.hashtags?.join(' ') || ''));
                    const captionOnlyText = variation.caption || '';
                    const hashtagsArr: string[] = variation.hashtags || [];

                    return (
                      <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-colors">
                        {/* Card Header */}
                        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center group">
                           <div className="font-bold text-white flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-indigo-400 border border-slate-700">{idx+1}</span>
                              {variation.tone}
                           </div>
                           <div className="flex items-center gap-3">
                             {(platform === 'Twitter' && variation.characterCount > 280) && (
                               <div className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                                 <AlertTriangle className="w-3 h-3"/> Too long
                               </div>
                             )}
                             {/* ═══ ML MODULE 2: ENGAGEMENT SCORE ═══ */}
                             <EngagementScore caption={liveText} platform={platform} />
                           </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6">
                           <div className="mb-4">
                             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Editable Caption</div>
                             <textarea 
                               className="w-full bg-slate-950 border border-transparent hover:border-slate-800 p-4 rounded-xl text-sm leading-relaxed text-slate-300 resize-y focus:outline-none focus:border-indigo-500/50 min-h-[120px]"
                               defaultValue={variation.caption + '\n\n' + (variation.hashtags?.join(' ') || '')}
                               onChange={e => {
                                 const newTexts = [...liveTexts];
                                 newTexts[idx] = e.target.value;
                                 setLiveTexts(newTexts);
                               }}
                             />
                           </div>

                           <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3 text-xs text-indigo-200 flex items-start gap-2 mb-4">
                              <Sparkles className="w-4 h-4 shrink-0 mt-0.5"/>
                              <p><strong>Why this works:</strong> {variation.whyItWorks}</p>
                           </div>

                           {/* ═══ ML MODULE 3: HASHTAG ANALYZER ═══ */}
                           {hashtagsArr.length > 0 && (
                             <HashtagAnalyzer
                               hashtags={hashtagsArr}
                               captionText={captionOnlyText}
                               industry={profile?.industry || 'retail'}
                             />
                           )}

                           <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800 mt-4">
                             <button onClick={(e) => {
                               const el = e.currentTarget.parentElement?.parentElement?.querySelector('textarea');
                               if(el) copyToClipboard((el as HTMLTextAreaElement).value);
                             }} className="px-4 py-2 bg-white text-slate-900 font-bold text-sm rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2">
                               <Copy className="w-4 h-4"/> Copy
                             </button>
                             <button 
                               onClick={async () => {
                                  setGeneratingVisualFor(idx);
                                  try {
                                    const prompt = await buildAIImagePrompt(
                                      profile.name, profile.industry, liveText.substring(0, 50), profile.brandTone, null, 'photorealistic'
                                    );
                                    const format = SOCIAL_FORMATS.find(f => f.name === 'instagram_post')!;
                                    const urls = buildVariationUrls(prompt, format, 4, 'flux');
                                    setGeneratedVisualsMap(prev => ({...prev, [idx]: urls}));
                                  } catch (err) {
                                    alert("Failed to generate visuals");
                                  } finally {
                                    setGeneratingVisualFor(null);
                                  }
                               }}
                               className="px-4 py-2 bg-brand-orange text-white font-bold text-sm rounded-lg hover:bg-brand-orange/80 transition-colors flex items-center gap-2 shadow-lg shadow-brand-orange/20"
                             >
                               {generatingVisualFor === idx ? <Loader2 className="w-4 h-4 animate-spin"/> : <ImageIcon className="w-4 h-4"/>}
                               Generate Matching Image
                             </button>
                           </div>

                           {/* Inline Visual Studio for this caption */}
                           {generatedVisualsMap[idx] && generatedVisualsMap[idx].length > 0 && (
                              <div className="mt-4 p-4 bg-black/40 border border-slate-800 rounded-xl space-y-4">
                                 <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                                    <Sparkles size={14} className="text-brand-orange" /> Pick an Image
                                 </h4>
                                 
                                 {!selectedVisualMap[idx] ? (
                                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                      {generatedVisualsMap[idx].map((url, imgIdx) => (
                                         <div key={imgIdx} onClick={() => setSelectedVisualMap(prev => ({...prev, [idx]: url}))} className="aspect-square bg-slate-900 rounded-lg overflow-hidden relative cursor-pointer border border-transparent hover:border-brand-orange transition-all group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img referrerPolicy="no-referrer" src={url} alt="Variation" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                         </div>
                                      ))}
                                   </div>
                                 ) : (
                                   <div className="flex flex-col md:flex-row gap-4 items-center">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img referrerPolicy="no-referrer" src={selectedVisualMap[idx]!} alt="Selected" className="w-32 h-32 object-cover rounded-lg border border-brand-orange" />
                                      <div className="flex-1 space-y-2">
                                         <button 
                                           onClick={async () => {
                                             setZippingFor(idx);
                                             try {
                                               const zip = new JSZip();
                                               zip.file("caption.txt", liveText);
                                               
                                               // Download main image (1x1)
                                               const blobSq = await downloadPollinationsImage(selectedVisualMap[idx]!);
                                               zip.file("image_1080x1080.jpg", blobSq);

                                               // Bonus: Download story version (9x16) of the SAME SEED logic (simplified: we just fetch another with a story format)
                                               // In a perfect world, we'd reconstruct the pollinations URL with new dimensions but same seed.
                                               const urlObj = new URL(selectedVisualMap[idx]!);
                                               urlObj.searchParams.set("width", "1080");
                                               urlObj.searchParams.set("height", "1920");
                                               const blobStory = await downloadPollinationsImage(urlObj.toString());
                                               zip.file("image_1080x1920.jpg", blobStory);

                                               const content = await zip.generateAsync({type:"blob"});
                                               const link = document.createElement('a');
                                               link.href = URL.createObjectURL(content);
                                               link.download = `GrowthOS_PostSet_${Date.now()}.zip`;
                                               link.click();
                                             } catch(e) {
                                               alert("ZIP export failed");
                                             } finally {
                                               setZippingFor(null);
                                             }
                                           }}
                                           disabled={zippingFor === idx}
                                           className="w-full py-2 bg-white text-black font-bold text-sm rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                         >
                                            {zippingFor === idx ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                            Download Caption + Image Set (ZIP)
                                         </button>
                                         <button onClick={() => setSelectedVisualMap(prev => ({...prev, [idx]: null}))} className="w-full py-2 bg-slate-800 text-white font-bold text-sm rounded-lg hover:bg-slate-700 transition-colors">
                                           Choose Different Image
                                         </button>
                                      </div>
                                   </div>
                                 )}
                              </div>
                           )}

                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="bg-slate-900 border border-slate-800 border-dashed rounded-2xl h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center">
                 <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6"><PenTool className="w-10 h-10 text-emerald-400 ml-1"/></div>
                 <h2 className="text-2xl font-bold text-white mb-3">Copywriter on standby</h2>
                 <p className="text-slate-400 max-w-sm">Use the panel on the left to describe your product. I'll read your business profile and generate three perfectly angled hooks ready to disrupt the timeline.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
