"use client";

import React from "react";
import { useDemo } from "@/context/DemoContext";
import { Shield, Database, ChevronDown, Check, Zap } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { FALLBACK_DATA } from "@/lib/fallback-data";
import { runAutopilot } from "@/lib/autopilot";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DemoBar() {
  const { isDemoMode, setDemoMode, demoBusiness, setDemoBusiness } = useDemo();
  const router = useRouter();

  const handleZeroTouchDemo = async () => {
    // 1. Clear state
    localStorage.removeItem('growthOS_businessProfile');
    localStorage.removeItem('growthOS_autopilot_state');
    
    // 2. Load Mumbai Mithai House
    const demoData = FALLBACK_DATA.businesses.mumbaiMithai.profile;
    const profile = { businessName: 'Mumbai Mithai House', ...demoData };
    localStorage.setItem('growthOS_businessProfile', JSON.stringify(profile));
    
    // 3. Trigger Autopilot run silently
    await runAutopilot(profile, () => {});
    
    // 4. Redirect to approvals
    router.push('/approvals');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-12 bg-[#1A0E06] border-b border-brand-orange/30 flex items-center px-6 justify-between animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-brand-orange/20 text-brand-orange">
            <Shield size={16} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-orange/90">
            GrowthOS Demo Engine
          </span>
        </div>

        <div className="h-4 w-px bg-brand-orange/30" />

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDemoMode(!isDemoMode)}
            className={cn(
              "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
              isDemoMode ? "bg-emerald-500" : "bg-white/10"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                isDemoMode ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
          <span className="text-xs font-bold text-white/90">
            Demo Mode {isDemoMode ? "Active" : "Off"}
          </span>
        </div>
      </div>

      {isDemoMode && (
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <button 
            onClick={handleZeroTouchDemo}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-saffron hover:bg-brand-orange/80 rounded-lg text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-orange/20 transition-all border border-brand-orange/50"
          >
            <Zap size={14} className="fill-white" />
            Zero-Touch Autopilot Demo
          </button>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <Database size={14} className="text-brand-orange/70" />
            <span className="text-xs font-semibold text-white/70">Pre-seeded Cluster:</span>
          </div>
          
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 border border-brand-orange/20 rounded-lg text-xs font-bold text-white transition-all">
              {demoBusiness}
              <ChevronDown size={14} className="opacity-50" />
            </button>
            
            <div className="absolute right-0 top-full mt-1 w-56 bg-[#1A0E06] border border-brand-orange/20 rounded-xl shadow-2xl shadow-black/50 p-1 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all origin-top-right z-[110]">
              {["Mumbai Mithai House", "TechVenture Solutions", "Priya's Boutique"].map((biz) => (
                <button
                  key={biz}
                  onClick={() => setDemoBusiness(biz)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors",
                    demoBusiness === biz 
                      ? "bg-brand-orange text-white" 
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {biz}
                  {demoBusiness === biz && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
