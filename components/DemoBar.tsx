"use client";

import React from "react";
import { useDemo } from "@/context/DemoContext";
import { Shield, Database, ChevronDown, Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DemoBar() {
  const { isDemoMode, setDemoMode, demoBusiness, setDemoBusiness } = useDemo();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-12 bg-indigo-950 border-b border-indigo-500/30 flex items-center px-6 justify-between animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
            <Shield size={16} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-indigo-100">
            GrowthOS Demo Engine
          </span>
        </div>

        <div className="h-4 w-px bg-indigo-500/30" />

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDemoMode(!isDemoMode)}
            className={cn(
              "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
              isDemoMode ? "bg-emerald-500" : "bg-indigo-800"
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
          <div className="flex items-center gap-2">
            <Database size={14} className="text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-200">Pre-seeded Cluster:</span>
          </div>
          
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-all">
              {demoBusiness}
              <ChevronDown size={14} className="opacity-50" />
            </button>
            
            <div className="absolute right-0 top-full mt-1 w-56 bg-indigo-900 border border-indigo-400/20 rounded-xl shadow-2xl p-1 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all origin-top-right z-[110]">
              {["Mumbai Mithai House", "TechVenture Solutions", "Priya's Boutique"].map((biz) => (
                <button
                  key={biz}
                  onClick={() => setDemoBusiness(biz)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors",
                    demoBusiness === biz 
                      ? "bg-indigo-500 text-white" 
                      : "text-indigo-200 hover:bg-white/5"
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
