"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Building2, Globe, Users, Target, Loader2, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { FALLBACK_DATA } from '@/lib/fallback-data';
import { runAutopilot } from '@/lib/autopilot';

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    businessName: '',
    websiteUrl: '',
    skipWebsite: false,
    industry: '',
    businessModel: '',
    location: '',
    monthlyRevenue: '',
    productsServices: '',
    targetAudience: '',
    primaryGoal: '',
    monthlyBudget: '',
    platforms: [] as string[],
    brandTone: '',
    competitors: ['', '', ''],
    specialLaunch: ''
  });

  const loadingMessages = [
    "Business profile ready ✓",
    "Analyzing upcoming festivals...",
    "Building your first content calendar...",
    "Preparing ad recommendations...",
    "Everything is ready for your review!"
  ];

  const handlePlatformChange = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform) 
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const loadSampleBusiness = () => {
    setFormData({
      businessName: "Mumbai Mithai House",
      websiteUrl: "https://mumbaimithaihouse.com",
      skipWebsite: false,
      industry: "Food & Beverage",
      businessModel: "B2C",
      location: "Mumbai, Maharashtra",
      monthlyRevenue: "₹20-50 Lakh",
      productsServices: "Kaju Katli\nMotichoor Ladoo\nCorporate Gift Hampers\nSugar-Free Sweets",
      targetAudience: "Families, corporate gifters, and sweet lovers in Mumbai. Age 25-55.",
      primaryGoal: "Drive Online Sales",
      monthlyBudget: "₹20,000-50,000",
      platforms: ["Instagram", "Facebook"],
      brandTone: "Friendly",
      competitors: ["Bikanerwala", "Haldirams", "Local Mumbai sweet shops"],
      specialLaunch: "Upcoming Diwali Mega Sale"
    });
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.businessName) errs.businessName = 'Business Name is required';
    if (!formData.skipWebsite && !formData.websiteUrl) errs.websiteUrl = 'Website URL is required (or check skip)';
    if (!formData.industry) errs.industry = 'Please select an industry';
    if (!formData.businessModel) errs.businessModel = 'Please select a business model';
    if (!formData.location) errs.location = 'Location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.productsServices) errs.productsServices = 'Please list product/services';
    if (!formData.targetAudience) errs.targetAudience = 'Target audience is required';
    if (!formData.primaryGoal) errs.primaryGoal = 'Primary goal is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!formData.brandTone) errs.brandTone = 'Brand tone is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    if (step === 2) isValid = validateStep2();
    
    if (isValid) {
      setErrors({});
      setStep(s => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const submitForm = async () => {
    if (!validateStep3()) return;
    
    setLoading(true);
    // Cycle messages
    const msgInterval = setInterval(() => {
      setLoadingMessageIdx(prev => (prev + 1) % loadingMessages.length);
    }, 1500);

    try {
      if (formData.businessName === 'Mumbai Mithai House') {
         // FAST PATH FOR DEMO: Simulate processing but use predefined response instantly
         await new Promise(r => setTimeout(r, 4500)); // Sleep just enough to show UI
         const demoData = FALLBACK_DATA.businesses.mumbaiMithai.profile;
         const profile = { ...formData, ...demoData };
         localStorage.setItem('growthOS_businessProfile', JSON.stringify(profile));
         
         await runAutopilot(profile, (task) => {
           // Advance loading message idx based on task type to simulate progress
           setLoadingMessageIdx(prev => Math.min(prev + 1, loadingMessages.length - 1));
         });

         clearInterval(msgInterval);
         setLoading(false);
         setSuccess(true);
         return;
      }

      const response = await fetch('/api/analyze-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteUrl: formData.websiteUrl,
          name: formData.businessName,
          industry: formData.industry,
          businessModel: formData.businessModel,
          targetAudience: formData.targetAudience,
          location: formData.location,
          productsServices: formData.productsServices,
          primaryGoal: formData.primaryGoal,
          monthlyBudget: formData.monthlyBudget
        })
      });

      const { data } = await response.json();
      
      const combinedProfile = { ...formData, ...data };
      localStorage.setItem('growthOS_businessProfile', JSON.stringify(combinedProfile));

      try {
        if (db) {
          await addDoc(collection(db, 'businesses'), {
            ...combinedProfile,
            createdAt: serverTimestamp()
          });
        }
      } catch (err) {
        console.log('Firebase skip: not configured or blocked', err);
      }

      // Run autopilot
      await runAutopilot(combinedProfile, (task) => {
        setLoadingMessageIdx(prev => Math.min(prev + 1, loadingMessages.length - 1));
      });

      clearInterval(msgInterval);
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error('Submission failed', error);
      clearInterval(msgInterval);
      setLoading(false);
      alert('Something went wrong. Please try loading the sample business instead.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-24 h-24 rounded-full bg-brand-teal/20 flex items-center justify-center mb-8 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12 text-brand-teal" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-150">
          Your GrowthOS is ready! 🚀
        </h2>
        
        <div className="flex flex-col gap-3 mb-10 w-full max-w-sm animate-in slide-in-from-bottom-4 duration-500 delay-300">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
            <span className="text-xl">📅</span>
            <span className="font-medium text-white/90">7-day calendar created</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
            <span className="text-xl">🎉</span>
            <span className="font-medium text-white/90">3 festival campaigns prepared</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
            <span className="text-xl">📢</span>
            <span className="font-medium text-white/90">3 ad strategies ready</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 animate-in slide-in-from-bottom-4 duration-500 delay-500">
          <button 
            onClick={() => router.push('/approvals')}
            className="px-8 py-3.5 rounded-xl bg-brand-orange text-white font-bold hover:bg-brand-orange/80 transition-colors shadow-lg shadow-brand-orange/20 flex items-center gap-2 text-lg"
          >
            Review & Approve <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            Go to Dashboard instead
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-gradient-saffron flex items-center justify-center animate-bounce mb-8 shadow-lg shadow-brand-orange/20">
          <span className="font-bold text-white text-3xl">G</span>
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange mb-6" />
        <h2 className="text-2xl font-bold">{loadingMessages[loadingMessageIdx]}</h2>
        <p className="text-slate-400 mt-4 text-center max-w-sm">
          Please wait as our AI constructs your autonomous marketing engine.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] p-4 md:p-8 flex justify-center items-start pt-16 font-sans">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Progress header */}
        <div className="p-6 md:p-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
           <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="font-bold text-white text-sm">G</span>
                </div>
                <span className="font-bold text-white">GrowthOS</span>
              </div>
              <button onClick={loadSampleBusiness} className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 py-1.5 px-3 rounded-full flex items-center gap-1 transition-colors border border-slate-700">
                <Sparkles className="w-3 h-3"/> Load Demo Data
              </button>
           </div>
           
           <div className="relative pt-4">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 rounded-full z-0"></div>
              <div className={`absolute top-1/2 left-0 h-1 bg-indigo-500 -translate-y-1/2 rounded-full transition-all duration-500 z-0`} style={{width: `${(step-1) * 50}%`}}></div>
              
              <div className="relative z-10 flex justify-between">
                 {[1, 2, 3].map(s => (
                   <div key={s} className="flex flex-col items-center gap-2">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                        {s}
                     </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 text-slate-200">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Tell us about your business</h2>
                <p className="text-slate-400">Our AI uses this context to automatically research your competition and industry standard practices.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Business Name <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" placeholder="e.g. Mumbai Mithai House"/>
                  {errors.businessName && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.businessName}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium">Website URL</label>
                    <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                      <input type="checkbox" checked={formData.skipWebsite} onChange={e => setFormData({...formData, skipWebsite: e.target.checked})} className="rounded bg-slate-800 border-slate-700 text-indigo-500"/>
                      Skip if no website
                    </label>
                  </div>
                  <input type="url" disabled={formData.skipWebsite} value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://"/>
                  {errors.websiteUrl && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.websiteUrl}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Industry <span className="text-red-400">*</span></label>
                    <select value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                      <option value="">Select Industry...</option>
                      <option>Retail & E-commerce</option>
                      <option>Food & Beverage</option>
                      <option>Fashion & Apparel</option>
                      <option>Technology & SaaS</option>
                      <option>Health & Wellness</option>
                      <option>Education & EdTech</option>
                      <option>Real Estate</option>
                      <option>Professional Services</option>
                      <option>Other</option>
                    </select>
                    {errors.industry && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.industry}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Monthly Revenue</label>
                    <select value={formData.monthlyRevenue} onChange={e => setFormData({...formData, monthlyRevenue: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                      <option value="">Select Range...</option>
                      <option>Below ₹1 Lakh</option>
                      <option>₹1-5 Lakh</option>
                      <option>₹5-20 Lakh</option>
                      <option>₹20-50 Lakh</option>
                      <option>₹50 Lakh+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Business Model <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['B2C', 'B2B', 'D2C', 'B2B2C'].map(model => (
                      <label key={model} className={`cursor-pointer border rounded-xl p-3 text-center transition-all ${formData.businessModel === model ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800'}`}>
                        <input type="radio" name="model" className="sr-only" checked={formData.businessModel === model} onChange={() => setFormData({...formData, businessModel: model})}/>
                        <span className="font-medium">{model}</span>
                      </label>
                    ))}
                  </div>
                  {errors.businessModel && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.businessModel}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Mumbai, Maharashtra"/>
                  {errors.location && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.location}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Your customers & goals</h2>
                <p className="text-slate-400">Tell us what you sell and who buys it. Be specific—our AI uses this to write your ad copy.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Core Products / Services <span className="text-red-400">*</span></label>
                  <textarea rows={3} value={formData.productsServices} onChange={e => setFormData({...formData, productsServices: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="List your main offerings, one per line."/>
                  {errors.productsServices && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.productsServices}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Target Audience <span className="text-red-400">*</span></label>
                  <textarea rows={3} value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Describe your ideal customer: age, gender, income, interests..." />
                  {errors.targetAudience && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.targetAudience}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Primary Marketing Goal <span className="text-red-400">*</span></label>
                  <div className="flex flex-col gap-2">
                    {['Brand Awareness', 'Generate Leads', 'Drive Online Sales', 'Grow Followers'].map(goal => (
                      <label key={goal} className={`cursor-pointer flex items-center gap-3 border rounded-xl p-4 transition-colors ${formData.primaryGoal === goal ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800'}`}>
                        <input type="radio" className="w-4 h-4 text-indigo-500 bg-slate-900 border-slate-700" checked={formData.primaryGoal === goal} onChange={() => setFormData({...formData, primaryGoal: goal})}/>
                        <span className="font-medium text-slate-200">{goal}</span>
                      </label>
                    ))}
                  </div>
                  {errors.primaryGoal && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.primaryGoal}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Current Active Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    {['Instagram', 'Facebook', 'LinkedIn', 'Twitter/X', 'YouTube', 'WhatsApp Business'].map(platform => (
                      <button key={platform} onClick={() => handlePlatformChange(platform)} className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${formData.platforms.includes(platform) ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:text-slate-200'}`}>
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Almost there! Final details</h2>
                <p className="text-slate-400">Establish your brand's voice and let us know who we need to beat.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Select your Brand Tone <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'Professional', desc: 'Formal, authoritative, trustworthy' },
                      { id: 'Friendly', desc: 'Warm, approachable, conversational' },
                      { id: 'Playful', desc: 'Fun, energetic, emoji-friendly' },
                      { id: 'Inspirational', desc: 'Motivational, aspirational, story-driven' }
                    ].map(tone => (
                      <div key={tone.id} onClick={() => setFormData({...formData, brandTone: tone.id})} className={`p-4 border rounded-xl cursor-pointer transition-all ${formData.brandTone === tone.id ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500' : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800'}`}>
                        <div className="font-bold text-white mb-1">{tone.id}</div>
                        <div className="text-sm text-slate-400">{tone.desc}</div>
                      </div>
                    ))}
                  </div>
                  {errors.brandTone && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.brandTone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Top 3 Competitors <span className="text-slate-500 font-normal">(Optional)</span></label>
                  <div className="space-y-3">
                    {[0, 1, 2].map(idx => (
                      <input key={idx} type="text" value={formData.competitors[idx]} onChange={e => {
                        const newComps = [...formData.competitors];
                        newComps[idx] = e.target.value;
                        setFormData({...formData, competitors: newComps});
                      }} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={`Competitor ${idx + 1}`}/>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Any special upcoming launch? <span className="text-slate-500 font-normal">(Optional)</span></label>
                  <textarea rows={2} value={formData.specialLaunch} onChange={e => setFormData({...formData, specialLaunch: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="e.g. Diwail mega sale dropping on Oct 10th"/>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 md:px-10 md:py-6 border-t border-slate-800 bg-slate-900 flex justify-between items-center rounded-b-3xl">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))} 
            className={`px-6 py-2.5 rounded-xl font-medium text-slate-300 transition-colors ${step === 1 ? 'invisible' : 'hover:bg-slate-800'}`}
          >
            Back
          </button>
          
          {step < 3 ? (
            <button onClick={nextStep} className="px-8 py-2.5 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
              Continue
            </button>
          ) : (
            <button onClick={submitForm} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:from-indigo-400 hover:to-purple-500 transition-colors shadow-lg shadow-indigo-500/30 flex items-center gap-2">
              Generate Growth Strategy <Sparkles className="w-4 h-4"/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
