'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  DollarSign, Clock, Calendar, Brain, CalendarDays, 
  PenTool, PartyPopper, Target, BarChart3, Star, Sparkles, ArrowRight 
} from 'lucide-react';

export default function LandingPage() {

  return (
    <div className="min-h-screen font-sans selection:bg-brand-orange/30 page-enter">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#080C14]/70 border-b border-white/5 h-[70px] flex items-center">
        <div className="container mx-auto px-6 mt-1 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-saffron flex items-center justify-center shadow-lg shadow-brand-orange/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF6B35] to-[#FFD166] bg-clip-text text-transparent">
              GrowthOS
            </span>
          </div>
          <div className="hidden md:flex gap-10 text-[13px] font-bold text-text-muted uppercase tracking-widest">
            <Link href="#features" className="hover:text-brand-orange transition-colors">Features</Link>
            <Link href="#testimonials" className="hover:text-brand-orange transition-colors">Wall of Love</Link>
            <Link href="/onboard" className="hover:text-brand-orange transition-colors">Login</Link>
          </div>
          <Link href="/onboard" className="btn-primary flex items-center gap-2 !py-2 !px-6 text-sm">
            Launch Engine <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden min-h-screen flex flex-col items-center">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="AI neural network background"
            fill
            priority
            className="object-cover object-center opacity-40"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080C14]/60 via-[#080C14]/30 to-[#080C14]/90" />
          {/* Radial glow center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#080C14_80%)]" />
        </div>
        <div className="container mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-widest mb-10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-orange"></span>
            </span>
            Powered by Gemini 1.5 AI
          </div>
          
          <h1 className="text-5xl md:text-[80px] font-extrabold tracking-tighter mb-8 leading-[0.95] text-text-primary">
            Your AI Marketing Team. <br />
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Zero Humans Required.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
            Replace your ₹50,000/month agency with a zero-touch autonomous marketing engine. Built specifically for Indian founders who value growth over jargon.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link href="/onboard" className="btn-primary text-lg !py-4 !px-10 flex items-center gap-3 group shadow-primary/40">
              Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </Link>
            <button 
              onClick={() => { localStorage.setItem('demoMode', 'true'); window.location.href='/onboard'; }} 
              className="btn-secondary text-lg !py-4 !px-10"
            >
              View Live Demo
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-10 text-[11px] font-bold text-brand-teal uppercase tracking-[0.2em] opacity-80">
            <div className="flex items-center gap-2">✓ 100% Free Plan</div>
            <div className="flex items-center gap-2">✓ No Agency Fees</div>
            <div className="flex items-center gap-2">✓ Built for India</div>
          </div>

          {/* Hero Visual - Floating Dashboard Card */}
          <div className="mt-32 relative mx-auto max-w-3xl animate-float">
            <div className="absolute -inset-2 bg-brand-orange/20 rounded-[22px] blur-3xl"></div>
            <div className="card-premium p-1 relative z-10 overflow-hidden bg-bg-card shadow-primary/10">
              <div className="bg-bg-surface rounded-xl overflow-hidden border border-white/5 aspect-[16/9] md:aspect-[2/1] p-4 md:p-8 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#FF5757]/80"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFD166]/80"></div>
                    <div className="w-3 h-3 rounded-full bg-[#00C9A7]/80"></div>
                    <div className="ml-4 h-4 w-32 bg-white/5 rounded-full"></div>
                  </div>
                  <div className="h-4 w-10 bg-brand-orange/20 rounded-full"></div>
                </div>

                <div className="grid grid-cols-4 gap-4 h-full pb-4">
                  {[
                    { day: 'Mon', color: 'bg-brand-orange', task: 'Festival Post' },
                    { day: 'Tue', color: 'bg-brand-teal', task: 'Edu Thread' },
                    { day: 'Wed', color: 'bg-brand-gold', task: 'Promo Ad' },
                    { day: 'Thu', color: 'bg-[#5B8DEF]', task: 'Reels Hook' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-bg-card rounded-xl border border-white/5 p-4 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{item.day}</span>
                        <div className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_8px_rgba(255,107,53,0.4)]`}></div>
                      </div>
                      <div className="flex-1 flex flex-col gap-2 justify-center">
                        <div className="h-2 w-full bg-white/5 rounded-full"></div>
                        <div className="h-2 w-2/3 bg-white/5 rounded-full"></div>
                      </div>
                      <div className={`text-[9px] font-bold py-1 px-2 rounded-md ${item.color}/10 ${item.color.replace('bg-', 'text-')} text-center`}>
                        {item.task}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-32 bg-[#0F1629]/90 border-t border-brand-orange/20 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-[40px] md:text-6xl font-extrabold mb-20 tracking-tight leading-tight text-text-primary">
            Small businesses are losing <br className="hidden md:block" />
            <span className="text-brand-orange">₹2-20 Lakh</span> to bad marketing
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-8 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/5 text-left group hover:bg-white/[0.05] transition-all">
              <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-8 border border-brand-orange/20">
                <DollarSign className="w-7 h-7 text-brand-orange"/>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">₹50K+ Monthly Fees</h3>
              <p className="text-text-secondary leading-relaxed">
                Standard agencies use generic templates that don't convert for Indian niches. You're paying for their offices, not your results.
              </p>
              <div className="mt-6 text-2xl font-black text-brand-orange opacity-20 group-hover:opacity-100 transition-opacity">₹50K+</div>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/5 text-left group hover:bg-white/[0.05] transition-all">
              <div className="w-14 h-14 bg-brand-teal/10 rounded-2xl flex items-center justify-center mb-8 border border-brand-teal/20">
                <Clock className="w-7 h-7 text-brand-teal"/>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">5 Hours Wasted</h3>
              <p className="text-text-secondary leading-relaxed">
                Founders spending Sundays writing captions and designing posts. Your time is worth ₹10,000/hr — spend it on product, not posts.
              </p>
              <div className="mt-6 text-2xl font-black text-brand-teal opacity-20 group-hover:opacity-100 transition-opacity">3-5 HRS</div>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/5 text-left group hover:bg-white/[0.05] transition-all">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-8 border border-brand-gold/20">
                <Calendar className="w-7 h-7 text-brand-gold"/>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">Missed Festivals</h3>
              <p className="text-text-secondary leading-relaxed">
                Forgetting to plan for Diwali or Akshaya Tritiya until it's too late. Festivals drive 60% of annual revenue for Indian SMEs.
              </p>
              <div className="mt-6 text-2xl font-black text-brand-gold opacity-20 group-hover:opacity-100 transition-opacity">0 SALES</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-text-primary">Marketing on purely Autopilot</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto font-medium">GrowthOS operates like a senior marketing strategist, copywriter, and media buyer — combined into one AI engine.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 */}
            <div className="card-premium p-8 group">
              <div className="w-14 h-14 bg-gradient-saffron rounded-full flex items-center justify-center mb-8 shadow-lg shadow-brand-orange/20">
                <Brain className="w-7 h-7 text-white"/>
              </div>
              <h3 className="text-2xl font-bold mb-4">Business Intelligence</h3>
              <p className="text-text-secondary leading-relaxed">AI analyzes your business DNA and builds a high-accuracy marketing profile in exactly 2 minutes. No manual onboarding.</p>
            </div>
            
            {/* Feature 2 - Featured */}
            <div className="card-premium p-8 group relative border-brand-orange/40 ring-1 ring-brand-orange/30 shadow-primary/20">
              <div className="absolute -top-3 right-8 bg-brand-orange text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-lg">Most Popular</div>
              <div className="w-14 h-14 bg-gradient-teal rounded-full flex items-center justify-center mb-8 shadow-lg shadow-brand-teal/20">
                <CalendarDays className="w-7 h-7 text-white"/>
              </div>
              <h3 className="text-2xl font-bold mb-4">Weekly AI Planner</h3>
              <p className="text-text-secondary leading-relaxed">A perfectly balanced 7-day content calendar generated automatically. From educational threads to hard-hitting sales drivers.</p>
            </div>

            {/* Feature 3 */}
            <div className="card-premium p-8 group">
              <div className="w-14 h-14 bg-gradient-saffron rounded-full flex items-center justify-center mb-8 shadow-lg shadow-brand-orange/20">
                <PenTool className="w-7 h-7 text-white"/>
              </div>
              <h3 className="text-2xl font-bold mb-4">Caption Generator</h3>
              <p className="text-text-secondary leading-relaxed">3 human-sounding caption variations per product (Emotional, Direct, Playful). Crafted for Indian audience nuances.</p>
            </div>

            {/* Feature 4 */}
            <div className="card-premium p-8 group">
              <div className="w-14 h-14 bg-gradient-teal rounded-full flex items-center justify-center mb-8 shadow-lg shadow-brand-teal/20">
                <PartyPopper className="w-7 h-7 text-white"/>
              </div>
              <h3 className="text-2xl font-bold mb-4">Festival Detector</h3>
              <p className="text-text-secondary leading-relaxed">Never miss a Diwali or Eid again. Get 30-day advance alerts with pre-written campaign strategies and creative briefs.</p>
            </div>

            {/* Feature 5 */}
            <div className="card-premium p-8 group">
              <div className="w-14 h-14 bg-gradient-saffron rounded-full flex items-center justify-center mb-8 shadow-lg shadow-brand-orange/20">
                <Target className="w-7 h-7 text-white"/>
              </div>
              <h3 className="text-2xl font-bold mb-4">Ad Recommendations</h3>
              <p className="text-text-secondary leading-relaxed">AI recommends precise Meta audiences and budget allocation structures based entirely on your revenue goals.</p>
            </div>

            {/* Feature 6 */}
            <div className="card-premium p-8 group">
              <div className="w-14 h-14 bg-gradient-teal rounded-full flex items-center justify-center mb-8 shadow-lg shadow-brand-teal/20">
                <BarChart3 className="w-7 h-7 text-white"/>
              </div>
              <h3 className="text-2xl font-bold mb-4">Performance AI</h3>
              <p className="text-text-secondary leading-relaxed">Real-time tracking with insights in plain English. No complicated marketing jargon—just clear advice on what to scale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="testimonials" className="py-32 bg-[#0A0E1A] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-text-primary">Used by 1,200+ Indian Brands</h2>
            <p className="text-text-secondary text-lg">GrowthOS is the secret engine behind India's fastest scaling SMEs.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { 
                name: 'Rajesh Sharma', 
                biz: 'Mumbai Mithai House', 
                quote: 'GrowthOS created our entire Diwali campaign in 3 minutes. Doubled our sweet box orders without an agency fee.',
                location: 'Mumbai'
              },
              { 
                name: 'Ananya Iyer', 
                biz: 'TechVenture Solutions', 
                quote: 'The AI content calendar is genius. Our inbound B2B leads increased 3x in just 6 weeks. No writers needed.',
                location: 'Bangalore'
              },
              { 
                name: 'Priya Mehta', 
                biz: 'Priya\'s Boutique', 
                quote: 'I used to spend 4 hours every Sunday planning my Instagram. Now it takes 15 seconds. It perfectly gets my brand voice.',
                location: 'Jaipur'
              }
            ].map((t, idx) => (
              <div key={idx} className="p-10 rounded-[32px] bg-[#162040]/80 border border-white/5 relative flex flex-col h-full hover:border-brand-orange/30 transition-all group">
                <div className="absolute top-6 left-8 text-6xl text-brand-orange/10 font-serif group-hover:text-brand-orange/20 transition-colors">"</div>
                <div className="flex gap-1 mb-8 relative z-10">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-brand-gold text-brand-gold"/>)}
                </div>
                <p className="text-xl text-text-primary leading-[1.6] relative z-10 font-medium mb-10 flex-1">
                  {t.quote}
                </p>
                <div className="border-t border-white/5 pt-6 relative z-10">
                  <div className="font-bold text-lg text-text-primary">{t.name}</div>
                  <div className="text-sm font-bold text-brand-teal uppercase tracking-widest mt-1">Founder, {t.biz}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 text-center relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-[80px] font-extrabold mb-10 tracking-tighter leading-none text-text-primary">
            Ready to hire your <br />
            <span className="text-brand-orange">AI Marketing Team?</span>
          </h2>
          <Link href="/onboard" className="btn-primary text-xl !py-6 !px-16 inline-flex items-center gap-4 group">
            Get Started For Free <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform"/>
          </Link>
          <p className="text-text-muted font-bold tracking-[0.2em] uppercase mt-10">No card required. Cancel 50K agency fees today.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#080C14] pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-saffron flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
                GrowthOS
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">
              <Link href="#" className="hover:text-text-primary transition-colors">The Product</Link>
              <Link href="#" className="hover:text-text-primary transition-colors">Pricing</Link>
              <Link href="#" className="hover:text-text-primary transition-colors">Case Studies</Link>
              <Link href="#" className="hover:text-text-primary transition-colors">Team</Link>
            </div>
          </div>
          <div className="text-center font-bold text-[10px] text-text-muted/50 uppercase tracking-[0.3em] flex flex-col items-center gap-4">
            <p>Built for the NMIMS INNOVATHON 2026 🚀</p>
            <p>© 2026 GrowthOS AI — Zero Humans Required.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
