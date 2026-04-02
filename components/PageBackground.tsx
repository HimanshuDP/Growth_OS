'use client';

import React from 'react';
import Image from 'next/image';

const PageBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#080C14]">
      {/* Hero background image — subtle across all pages */}
      <Image
        src="/hero-bg.png"
        alt=""
        fill
        priority
        className="object-cover object-center opacity-[0.22]"
      />

      {/* 1. Animated Orbs — brand saffron + teal */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full filter blur-[120px] opacity-25 bg-[#FF6B35]" 
        style={{ animation: 'driftOrb1 45s ease-in-out infinite' }}
      />
      <div 
        className="absolute top-[5%] right-[-5%] w-[600px] h-[600px] rounded-full filter blur-[100px] opacity-20 bg-[#00C9A7]" 
        style={{ animation: 'driftOrb1 60s ease-in-out infinite reverse' }}
      />
      <div 
        className="absolute bottom-[-15%] left-[20%] w-[700px] h-[700px] rounded-full filter blur-[110px] opacity-10 bg-[#FF6B35]" 
        style={{ animation: 'driftOrb1 75s ease-in-out infinite' }}
      />

      {/* 2. Indian Geometric Pattern (Rangoli/Mandala) overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L35 25L60 30L35 35L30 60L25 35L0 30L25 25Z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='5' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* 3. Fine Tech Grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 4. Dark vignette edges so content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#080C14_90%)]" />
    </div>
  );
};

export default PageBackground;
