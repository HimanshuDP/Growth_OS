"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, BrainCircuit, Rocket, Zap, Search } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LoadingOverlayProps {
  messages?: string[];
  isLoading: boolean;
}

const DEFAULT_MESSAGES = [
  "Analyzing your core business strengths...",
  "Scanning regional Indian market trends...",
  "Drafting human-centric content strategies...",
  "Calculating performance optimization hooks...",
  "Generating multi-platform campaign variants...",
  "Refining AI models for maximum engagement...",
  "Finalizing your growth roadmap..."
];

export default function LoadingOverlay({
  messages = DEFAULT_MESSAGES,
  isLoading,
}: LoadingOverlayProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // Hold at 95% until done
        return prev + 0.5;
      });
    }, 50); // Slower, more realistic progress

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading, messages.length]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 backdrop-blur-xl bg-black/60 animate-in fade-in duration-500">
      <div className="relative w-full max-w-md bg-indigo-950/80 border border-indigo-500/30 rounded-3xl p-10 shadow-3xl shadow-indigo-500/20 text-center overflow-hidden">
        {/* Animated Glow Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full animate-pulse" />

        <div className="relative z-10 space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 animate-pulse" />
              <div className="relative p-5 rounded-2xl bg-indigo-600 border border-indigo-400 shadow-xl animate-bounce duration-1000">
                <BrainCircuit size={42} className="text-white" />
              </div>
            </div>
          </div>

          <div className="px-6 space-y-4">
            <h2 className="text-2xl font-black text-white tracking-tight">
              GrowthOS is Thinking
            </h2>
            <div className="h-6 flex items-center justify-center">
              <p className="text-indigo-200 font-medium animate-in slide-in-from-bottom-2 duration-300">
                {messages[currentMessageIndex]}
              </p>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="px-4 space-y-2">
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
              <span>Optimizing Model</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-2">
            {[Zap, Search, Sparkles, Rocket].map((Icon, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-2 rounded-lg transition-all duration-500",
                  currentMessageIndex === idx ? "bg-indigo-500 text-white scale-110" : "bg-white/5 text-white/20"
                )}
              >
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
