"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Business = {
  name: string;
  url: string;
  industry: string;
  description: string;
};

const SAMPLE_BUSINESSES: Record<string, Business> = {
  "Mumbai Mithai House": {
    name: "Mumbai Mithai House",
    url: "https://mumbaimithaihouse.in",
    industry: "Food & Beverage",
    description: "Authentic Indian sweets and snacks, specializing in traditional Marathi and Gujarati delicacies.",
  },
  "TechVenture Solutions": {
    name: "TechVenture Solutions",
    url: "https://techventure.io",
    industry: "IT Services",
    description: "Full-stack software development and digital transformation agency for startups.",
  },
  "Priya's Boutique": {
    name: "Priya's Boutique",
    url: "https://priyasboutique.com",
    industry: "Fashion",
    description: "Handcrafted ethnic wear and designer sarees for modern Indian women.",
  },
};

type DemoContextType = {
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
  demoBusiness: string;
  setDemoBusiness: (name: string) => void;
  businessData: Business;
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setDemoMode] = useState(false);
  const [demoBusiness, setDemoBusiness] = useState("Mumbai Mithai House");
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);

  // On mount, check if demo mode was previously enabled
  useEffect(() => {
    const saved = localStorage.getItem("growthOS_demoMode");
    if (saved === "true") setDemoMode(true);
    const savedBiz = localStorage.getItem("growthOS_demoBusiness");
    if (savedBiz) setDemoBusiness(savedBiz);
  }, []);

  useEffect(() => {
    localStorage.setItem("growthOS_demoMode", isDemoMode.toString());
  }, [isDemoMode]);

  useEffect(() => {
    localStorage.setItem("growthOS_demoBusiness", demoBusiness);
    if (isDemoMode) {
      setIsSimulatingLoad(true);
      setTimeout(() => setIsSimulatingLoad(false), 1500);
    }
  }, [demoBusiness, isDemoMode]);

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        setDemoMode,
        demoBusiness,
        setDemoBusiness,
        businessData: SAMPLE_BUSINESSES[demoBusiness],
      }}
    >
      {isSimulatingLoad && <div className="fixed inset-0 z-[999] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
        <div className="p-8 rounded-3xl bg-indigo-950/80 border border-indigo-500/30 flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white font-bold text-sm uppercase tracking-widest">Loading {demoBusiness} Dataset...</p>
        </div>
      </div>}
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used within a DemoProvider");
  return context;
};
