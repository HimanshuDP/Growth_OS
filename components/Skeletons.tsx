import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-white/10 rounded-xl", className)} />
);

export const CalendarSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
    {[...Array(7)].map((_, i) => (
      <div key={i} className="flex flex-col gap-3">
        <Skeleton className="h-6 w-24" />
        <div className="p-4 rounded-2xl border border-white/5 bg-white/5 flex flex-col gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    ))}
  </div>
);

export const CaptionSkeleton = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    ))}
  </div>
);

export const FestivalSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="w-full h-80 p-6 rounded-2xl border border-white/5 bg-white/5 space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
    <div className="h-56 w-full flex items-end gap-2 pb-2">
      {[...Array(12)].map((_, i) => (
        <Skeleton key={i} className={`flex-1 h-[${Math.random() * 80 + 20}%]`} />
      ))}
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-12">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
    <Skeleton className="h-64 w-full rounded-2xl" />
  </div>
);
