'use client';

import { AlertTriangle, X, RefreshCw, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ErrorBannerProps {
  message: string;
  description?: string;
  dismissible?: boolean;
  onRetry?: () => void;
  usedFallback?: boolean;
  className?: string;
}

export default function ErrorBanner({
  message,
  description,
  dismissible = true,
  onRetry,
  usedFallback = false,
  className,
}: ErrorBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div 
      className={cn(
        "relative flex items-start gap-4 p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300",
        usedFallback 
          ? "bg-amber-500/10 border-amber-500/20 text-amber-200 shadow-lg shadow-amber-500/5 animate-in fade-in slide-in-from-top-2" 
          : "bg-red-500/10 border-red-500/20 text-red-200 shadow-lg shadow-red-500/5 animate-in fade-in slide-in-from-top-2",
        className
      )}
    >
      <div className={cn(
        "flex-shrink-0 p-2 rounded-xl",
        usedFallback ? "bg-amber-500/20" : "bg-red-500/20"
      )}>
        {usedFallback ? (
          <Zap size={20} className="text-amber-400" />
        ) : (
          <AlertTriangle size={20} className="text-red-400" />
        )}
      </div>
      
      <div className="flex-1">
        <p className="text-base font-semibold leading-relaxed">
          {usedFallback 
            ? "⚡ Using cached data — AI is taking a quick break" 
            : message || "Something went wrong. Please try again."}
        </p>
        {description && !usedFallback && (
          <p className="text-sm text-red-300/70 mt-1 font-medium italic opacity-80">{description}</p>
        )}
        
        {onRetry && (
          <button
            onClick={onRetry}
            className={cn(
              "mt-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95",
              usedFallback ? "text-amber-400 hover:text-amber-300" : "text-red-400 hover:text-red-300"
            )}
          >
            <RefreshCw size={14} />
            Try again
          </button>
        )}
      </div>
      
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className={cn(
            "flex-shrink-0 p-1.5 rounded-lg transition-colors mt-0.5",
            usedFallback ? "hover:bg-amber-500/20" : "hover:bg-red-500/20"
          )}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
