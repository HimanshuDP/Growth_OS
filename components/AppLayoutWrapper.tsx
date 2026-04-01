"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DemoBar from '@/components/DemoBar';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Public-facing pages (Landing, Onboard, etc.)
  const isLandingPage = pathname === '/';
  const isPublicPage = isLandingPage || pathname === '/onboard' || pathname === '/pricing';

  // Demo bar is always present but shifts the content down
  if (isPublicPage) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950">
        <DemoBar />
        <main className="flex-1 mt-12 overflow-x-hidden">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    );
  }

  // Dashboard layout
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950">
      <DemoBar />
      <div className="flex flex-1 mt-12 overflow-hidden relative">
        <Sidebar className="hidden md:flex" />
        <div className="flex-1 flex flex-col min-w-0 md:ml-[260px] transition-all duration-300 relative z-10 w-full overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-[#0F172A] p-4 md:p-6">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  );
}
