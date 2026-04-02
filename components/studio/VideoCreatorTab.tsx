'use client';

import React, { useState, useRef } from 'react';
import { generatePollinationsVideo } from '@/lib/pollinations';
import { Loader2, Video as VideoIcon, Download, Sparkles, RefreshCw, Smartphone } from 'lucide-react';

export default function VideoCreatorTab() {
  const [mode, setMode] = useState<'ai' | 'animator'>('ai');
  
  // Mode A State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Mode B State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [animTemplate, setAnimTemplate] = useState('festival');
  const [animConfig, setAnimConfig] = useState({
    headline: 'Diwali Mega Sale',
    subtext: 'Flat 50% Off Today',
    primaryColor: '#FF6B35',
    secondaryColor: '#FFD166',
  });

  // --- Mode A: AI Video ---
  const handleGenerateAIVideo = async () => {
    if (!videoPrompt) return;
    setIsGenerating(true);
    setGenerationError(null);
    setVideoUrl(null);
    try {
      // Basic AI bridge for video prompt
      const res = await fetch('/api/generate-video-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: "My Business",
          industry: "Retail",
          videoPurpose: videoPrompt,
          platform: "Instagram Reel"
        })
      });
      let finalPrompt = videoPrompt;
      if (res.ok) {
         const data = await res.json();
         if (data.videoPrompt) finalPrompt = data.videoPrompt;
      }

      const url = await generatePollinationsVideo(finalPrompt);
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      setGenerationError("AI video generation failed. Traffic might be high. Please try the Animated Post Creator (Mode B).");
      setMode('animator');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  // --- Mode B: Canvas Animator ---
  const previewAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let frame = 0;
    const totalFrames = 150; // 5 seconds at 30fps

    const render = () => {
       if (frame > totalFrames) return;
       ctx.clearRect(0, 0, 1080, 1920);

       // Background
       ctx.fillStyle = '#1A0E06';
       ctx.fillRect(0, 0, 1080, 1920);

       // Decor
       const progress = frame / totalFrames;
       
       for (let i = 0; i < 30; i++) {
         const x = (Math.sin(frame * 0.05 + i) * 600) + 540;
         const y = (Math.cos(frame * 0.05 + i * 0.7) * 800) + 960;
         const size = Math.abs(Math.sin(frame * 0.1 + i)) * 12 + 2;
         ctx.fillStyle = animConfig.secondaryColor;
         ctx.beginPath();
         ctx.arc(x, y, size, 0, Math.PI * 2);
         ctx.fill();
       }

       // Text
       const textOpacity = Math.min(1, (frame - 20) / 30);
       ctx.globalAlpha = Math.max(0, textOpacity);
       
       ctx.fillStyle = '#FFFFFF';
       ctx.font = 'bold 96px Inter, sans-serif';
       ctx.textAlign = 'center';
       ctx.fillText(animConfig.headline, 540, 800);

       const subtextOpacity = Math.min(1, (frame - 50) / 30);
       ctx.globalAlpha = Math.max(0, subtextOpacity);
       ctx.fillStyle = animConfig.primaryColor;
       ctx.font = 'bold 64px Inter, sans-serif';
       ctx.fillText(animConfig.subtext, 540, 950);
       
       ctx.globalAlpha = 1;

       // Bottom Gradient
       const gradient = ctx.createLinearGradient(0, 1600, 0, 1920);
       gradient.addColorStop(0, 'transparent');
       gradient.addColorStop(1, animConfig.primaryColor);
       ctx.fillStyle = gradient;
       ctx.fillRect(0, 1600, 1080, 320);

       frame++;
       requestAnimationFrame(render);
    };
    
    render();
  };

  const recordAnimation = async () => {
    if (!window.MediaRecorder) {
       alert("MediaRecorder not supported in this browser. Try Chrome.");
       return;
    }
    
    setIsRecording(true);
    setRecordedBlob(null);
    previewAnimation(); // start drawing
    
    const canvas = canvasRef.current!;
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    const chunks: Blob[] = [];
    
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
       const blob = new Blob(chunks, { type: 'video/webm' });
       setRecordedBlob(blob);
       setIsRecording(false);
    };
    
    recorder.start();
    setTimeout(() => recorder.stop(), 5000); // Record exactly 5s
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[800px]">
       
       {/* LEFT PANEL */}
       <div className="lg:w-[40%] space-y-6 pr-4 border-r border-white/5">
          <div className="flex bg-slate-900 border border-slate-700/50 rounded-xl p-1 mb-6">
            <button 
              onClick={() => setMode('ai')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${mode === 'ai' ? 'bg-brand-orange text-white' : 'text-white/50 hover:text-white'}`}
            >
              🪄 AI Video Generator
            </button>
            <button 
              onClick={() => setMode('animator')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${mode === 'animator' ? 'bg-brand-orange text-white' : 'text-white/50 hover:text-white'}`}
            >
              🎨 Animated Post Creator
            </button>
          </div>

          {mode === 'ai' && (
            <div className="space-y-6 animate-in slide-in-from-left-4">
               <div>
                 <label className="block text-sm font-bold text-white mb-2">Video Concept (5 seconds)</label>
                 <textarea 
                   value={videoPrompt}
                   onChange={e => setVideoPrompt(e.target.value)}
                   className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-orange outline-none resize-none"
                   placeholder="e.g. Slow motion pour of Indian chai into a cutting glass, rising steam, warm morning light, photorealistic"
                 />
                 <p className="text-xs text-white/40 mt-2">Powered by Wan-I2V (Fast). Generates a 5-second MP4, perfect for Reels/Stories.</p>
               </div>

               <button 
                 onClick={handleGenerateAIVideo}
                 disabled={!videoPrompt || isGenerating}
                 className="w-full py-4 rounded-xl bg-brand-orange text-white font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                 {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <VideoIcon size={24} />}
                 {isGenerating ? "Generating ~30-60s..." : "Generate AI Video"}
               </button>

               {generationError && (
                 <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                   {generationError}
                 </div>
               )}
            </div>
          )}

          {mode === 'animator' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <div className="p-4 bg-brand-teal/10 border border-brand-teal/20 rounded-xl text-brand-teal text-xs">
                  This tool creates videos directly in your browser. It never fails and works completely offline!
               </div>
               
               <div>
                 <label className="block text-sm font-bold text-white mb-2">Headline Text</label>
                 <input 
                   type="text"
                   value={animConfig.headline}
                   onChange={e => setAnimConfig({...animConfig, headline: e.target.value})}
                   className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                 />
               </div>

               <div>
                 <label className="block text-sm font-bold text-white mb-2">Subtext / Offer</label>
                 <input 
                   type="text"
                   value={animConfig.subtext}
                   onChange={e => setAnimConfig({...animConfig, subtext: e.target.value})}
                   className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-white/60 mb-1">Primary Color</label>
                   <div className="flex items-center gap-2">
                     <input type="color" value={animConfig.primaryColor} onChange={e => setAnimConfig({...animConfig, primaryColor: e.target.value})} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                     <span className="text-xs text-white/50">{animConfig.primaryColor}</span>
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-white/60 mb-1">Secondary Color</label>
                   <div className="flex items-center gap-2">
                     <input type="color" value={animConfig.secondaryColor} onChange={e => setAnimConfig({...animConfig, secondaryColor: e.target.value})} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                     <span className="text-xs text-white/50">{animConfig.secondaryColor}</span>
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-3 pt-4">
                  <button onClick={previewAnimation} className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                     Preview
                  </button>
                  <button onClick={recordAnimation} disabled={isRecording} className="py-3 bg-brand-teal hover:bg-brand-teal/80 text-black font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                     {isRecording ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                     {isRecording ? "Recording..." : "Record & Download"}
                  </button>
               </div>
            </div>
          )}
       </div>

       {/* RIGHT PANEL - Viewer */}
       <div className="lg:w-[60%] flex flex-col items-center justify-center bg-black/40 rounded-3xl border border-white/5 overflow-hidden p-6 relative min-h-[500px]">
           {mode === 'ai' && (
              <>
                {!videoUrl && !isGenerating && (
                  <div className="flex flex-col items-center opacity-30 text-center max-w-sm">
                    <VideoIcon size={64} className="mb-4" />
                    <p>Enter a prompt to generate a 5-second cinematic video reel.</p>
                  </div>
                )}
                
                {isGenerating && (
                  <div className="flex flex-col items-center">
                    <div className="w-64 h-[400px] bg-slate-800 rounded-xl animate-pulse border border-slate-700 flex items-center justify-center">
                       <Loader2 size={32} className="animate-spin text-brand-orange" />
                    </div>
                    <p className="text-sm font-bold text-white mt-6 animate-pulse">Generating your video...</p>
                    <p className="text-xs text-white/40 mt-2">Takes approximately 30-90 seconds</p>
                  </div>
                )}

                {videoUrl && !isGenerating && (
                  <div className="flex flex-col items-center w-full max-w-md animate-in zoom-in-95">
                    <video src={videoUrl} controls autoPlay loop className="w-full rounded-2xl border border-slate-700 shadow-2xl" />
                    <button onClick={() => downloadVideo(videoUrl, 'growthos_ai_video.mp4')} className="mt-6 w-full py-4 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange/80 flex items-center justify-center gap-2">
                       <Download size={20} /> Download MP4
                    </button>
                  </div>
                )}
              </>
           )}

           {mode === 'animator' && (
              <div className="flex flex-col items-center w-full max-w-sm">
                 <div className="relative w-full aspect-[9/16] bg-black rounded-2xl border border-slate-700 shadow-2xl overflow-hidden shadow-brand-teal/10">
                    <canvas ref={canvasRef} width={1080} height={1920} className="w-full h-full object-cover" />
                    {isRecording && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-red-500/30">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold text-red-500">REC</span>
                      </div>
                    )}
                 </div>

                 {recordedBlob && (
                    <button 
                      onClick={() => downloadVideo(URL.createObjectURL(recordedBlob), 'growthos_animated.webm')} 
                      className="mt-6 w-full py-4 bg-brand-teal text-black font-bold rounded-xl hover:bg-brand-teal/80 flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2"
                    >
                       <Download size={20} /> Save Video (WebM)
                    </button>
                 )}
              </div>
           )}
       </div>
    </div>
  );
}
