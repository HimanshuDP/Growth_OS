'use client';

import Link from 'next/link';
import { 
  DollarSign, Clock, Calendar, Brain, CalendarDays, 
  PenTool, PartyPopper, Target, BarChart3, Star, CheckCircle, ArrowRight 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Global CSS for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes text-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-text-gradient {
          background-size: 200% auto;
          animation: text-gradient 4s linear infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}} />

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="font-bold text-white text-xl">G</span>
          </div>
          <span className="text-xl font-bold tracking-tight">GrowthOS</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#testimonials" className="hover:text-white transition-colors">Wall of Love</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        <Link href="/onboard" className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/5">
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          GrowthOS 2.0 is now live for Indian SMEs
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Your AI Marketing Team. <br className="hidden md:block"/>
          <span className="animate-text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Zero Humans Required.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          GrowthOS replaces your ₹50,000/month social media agency with an autonomous AI system that plans, creates, schedules, and optimizes — while you focus on running your business.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/onboard" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-900 font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
            Start Free — No Card Needed <ArrowRight className="w-4 h-4"/>
          </Link>
          <button onClick={() => { localStorage.setItem('demoMode', 'true'); window.location.href='/onboard'; }} className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors border border-slate-700">
            See Live Demo
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400"/> 100% Free Forever Plan</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400"/> Powered by Gemini 1.5</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400"/> Built for Indian SMEs</div>
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-24 relative mx-auto max-w-5xl animate-float">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
            <div className="rounded-xl overflow-hidden bg-slate-950 aspect-[16/9] border border-slate-800 flex flex-col">
              {/* Mock Mac Header */}
              <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              {/* Mock Dashboard Body */}
              <div className="flex-1 p-8 flex gap-6">
                <div className="w-48 hidden md:flex flex-col gap-4">
                  <div className="h-8 bg-slate-800 rounded-lg w-full"></div>
                  <div className="h-8 bg-indigo-500/20 border border-indigo-500/30 rounded-lg w-full"></div>
                  <div className="h-8 bg-slate-800 rounded-lg w-full"></div>
                  <div className="h-8 bg-slate-800 rounded-lg w-full"></div>
                </div>
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex justify-between gap-4">
                    <div className="h-24 bg-slate-800 rounded-xl flex-1 border border-slate-700/50 p-4">
                       <div className="w-8 h-8 rounded-full bg-emerald-500/20 mb-2"></div>
                       <div className="h-2 bg-slate-700 rounded w-1/2 mt-4"></div>
                    </div>
                    <div className="h-24 bg-slate-800 rounded-xl flex-1 border border-slate-700/50 p-4">
                       <div className="w-8 h-8 rounded-full bg-blue-500/20 mb-2"></div>
                       <div className="h-2 bg-slate-700 rounded w-1/2 mt-4"></div>
                    </div>
                    <div className="h-24 bg-slate-800 rounded-xl flex-1 border border-slate-700/50 p-4">
                       <div className="w-8 h-8 rounded-full bg-purple-500/20 mb-2"></div>
                       <div className="h-2 bg-slate-700 rounded w-1/2 mt-4"></div>
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700/50 p-6 flex flex-col gap-4">
                     <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                     <div className="flex-1 border-b border-slate-700/50 relative">
                        {/* Mock Chart Line */}
                        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none"><path d="M0,100 C20,90 40,110 60,60 C80,20 100,0 120,50 L120,120 L0,120 Z" fill="rgba(99, 102, 241, 0.1)" stroke="rgb(99, 102, 241)" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-slate-900/50 py-24 border-y border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16">
            Small businesses are losing <span className="text-red-400">₹2-20 Lakh</span> annually to inefficient marketing
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-2xl text-left">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 border border-red-500/20">
                <DollarSign className="w-6 h-6 text-red-400"/>
              </div>
              <h3 className="text-xl font-bold text-red-200 mb-3">₹50K+/month agencies</h3>
              <p className="text-red-200/60 leading-relaxed">Paying exorbitant retainer fees to standard agencies who often use generic templates that don't convert for your niche.</p>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/20 p-8 rounded-2xl text-left">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 border border-orange-500/20">
                <Clock className="w-6 h-6 text-orange-400"/>
              </div>
              <h3 className="text-xl font-bold text-orange-200 mb-3">3-5 hours/week wasted</h3>
              <p className="text-orange-200/60 leading-relaxed">Founders spending their Sundays writing captions and designing posts instead of focusing on actual business operations.</p>
            </div>
            <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-2xl text-left">
              <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-6 border border-rose-500/20">
                <Calendar className="w-6 h-6 text-rose-400"/>
              </div>
              <h3 className="text-xl font-bold text-rose-200 mb-3">Missed festival campaigns</h3>
              <p className="text-rose-200/60 leading-relaxed">Forgetting to plan for high-revenue events like Diwali or Raksha Bandhan until the last minute, losing massive sales spikes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to grow on autopilot</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">GrowthOS operates like a senior marketing strategist, copywriter, and media buyer combined into one platform.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-colors">
              <Brain className="w-10 h-10 text-indigo-400 mb-6"/>
              <h3 className="text-xl font-bold mb-3">Business Intelligence</h3>
              <p className="text-slate-400 leading-relaxed">AI analyzes your business URL and builds a complete, highly accurate marketing profile and demographic targeting in exactly 2 minutes.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-colors">
              <CalendarDays className="w-10 h-10 text-pink-400 mb-6"/>
              <h3 className="text-xl font-bold mb-3">Weekly AI Planner</h3>
              <p className="text-slate-400 leading-relaxed">A perfectly balanced 7-day content calendar generated automatically every week. From educational posts to pure sales drivers.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-colors">
              <PenTool className="w-10 h-10 text-emerald-400 mb-6"/>
              <h3 className="text-xl font-bold mb-3">Caption Generator</h3>
              <p className="text-slate-400 leading-relaxed">3 human-sounding, culturally relevant caption variations per product (Emotional, Direct, Playful). Ready to copy-paste instantly.</p>
            </div>
            {/* Feature 4 */}
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-colors">
              <PartyPopper className="w-10 h-10 text-yellow-400 mb-6"/>
              <h3 className="text-xl font-bold mb-3">Festival Detector</h3>
              <p className="text-slate-400 leading-relaxed">Never miss a Diwali, Holi, or Eid campaign again. Get 30-day advance alerts with completely written campaign strategies.</p>
            </div>
            {/* Feature 5 */}
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-colors">
              <Target className="w-10 h-10 text-blue-400 mb-6"/>
              <h3 className="text-xl font-bold mb-3">Ad Optimizer</h3>
              <p className="text-slate-400 leading-relaxed">AI recommends specific Meta and Google Ad campaign structures, precise audiences, and budgets based entirely on your revenue goals.</p>
            </div>
            {/* Feature 6 */}
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-colors">
              <BarChart3 className="w-10 h-10 text-purple-400 mb-6"/>
              <h3 className="text-xl font-bold mb-3">Performance AI</h3>
              <p className="text-slate-400 leading-relaxed">Real-time metrics tracking with translated insights in plain English. No complicated marketing jargon—just clear advice on what to scale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="testimonials" className="py-24 bg-slate-900 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Join 10,000+ growing brands</h2>
            <p className="text-slate-400 text-lg">Indian SMEs are taking back control of their marketing budgets.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400"/>)}
              </div>
              <p className="text-lg text-slate-300 leading-relaxed italic mb-8">"GrowthOS created our entire Diwali campaign in 3 minutes. We saved ₹40,000 on agency fees and doubled our sweet box corporate orders."</p>
              <div>
                <div className="font-bold text-white">Rajesh Sharma</div>
                <div className="text-sm text-slate-500">Owner, Mumbai Mithai House • Mumbai</div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400"/>)}
              </div>
              <p className="text-lg text-slate-300 leading-relaxed italic mb-8">"The LinkedIn content calendar alone is worth it. Our inbound b2b leads increased 3x in just 6 weeks without hiring a dedicated writer."</p>
              <div>
                <div className="font-bold text-white">Ananya Iyer</div>
                <div className="text-sm text-slate-500">Founder, TechVenture Solutions • Bangalore</div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400"/>)}
              </div>
              <p className="text-lg text-slate-300 leading-relaxed italic mb-8">"I used to spend 4 hours every Sunday planning my Instagram content. Now GrowthOS does it in 15 seconds. It perfectly understands my brand voice."</p>
              <div>
                <div className="font-bold text-white">Priya Mehta</div>
                <div className="text-sm text-slate-500">Founder, Priya's Boutique • Jaipur</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">Ready to launch your growth?</h2>
          <Link href="/onboard" className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-white text-slate-900 font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] mb-6">
            Get Started Free <ArrowRight className="w-5 h-5"/>
          </Link>
          <p className="text-slate-400 font-medium tracking-wide">No credit card. No agency fees. Just growth.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="font-bold text-white text-xl">G</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">GrowthOS</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-400">
              <Link href="#" className="hover:text-white transition-colors">Product</Link>
              <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="#" className="hover:text-white transition-colors">Blog</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="text-center text-slate-500 text-sm flex flex-col items-center gap-2">
            <p>Built at NMIMS INNOVATHON 2026 🚀</p>
            <p>&copy; 2026 GrowthOS Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
