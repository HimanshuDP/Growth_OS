'use client';
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  runAutopilot,
  getAutopilotState,
  saveAutopilotState,
  AutopilotState,
  AutopilotTask,
} from '@/lib/autopilot';

interface AutopilotContextType {
  state: AutopilotState;
  isRunning: boolean;
  currentTask: string | null;
  pendingApprovalCount: number;
  toggleAutopilot: () => void;
  approveItem: (id: string) => void;
  skipItem: (id: string) => void;
  triggerManualRun: () => void;
}

const AutopilotContext = createContext<AutopilotContextType | null>(null);

export function AutopilotProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AutopilotState>(getAutopilotState());
  const [isRunning, setIsRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const profileRaw = localStorage.getItem('growthOS_businessProfile');
    if (!profileRaw || hasRun.current) return;
    hasRun.current = true;

    let businessProfile: any;
    try {
      businessProfile = JSON.parse(profileRaw);
    } catch {
      return;
    }

    setIsRunning(true);

    const taskLabels: Record<string, string> = {
      generate_calendar: 'Generating your weekly content calendar…',
      detect_festivals: 'Scanning upcoming festivals…',
      refresh_ad_recommendations: 'Refreshing ad recommendations…',
      generate_daily_tip: 'Preparing your daily marketing tip…',
    };

    runAutopilot(businessProfile, (task: AutopilotTask, newState: AutopilotState) => {
      setCurrentTask(taskLabels[task.type] ?? 'Working…');
      setState({ ...newState });
    }).finally(() => {
      setIsRunning(false);
      setCurrentTask(null);
      setState(getAutopilotState());
    });
  }, []);

  const toggleAutopilot = () => {
    const newState = { ...state, isEnabled: !state.isEnabled };
    saveAutopilotState(newState);
    setState(newState);
  };

  const approveItem = (id: string) => {
    const newState = {
      ...state,
      pendingApprovals: state.pendingApprovals.map(a =>
        a.id === id ? { ...a, status: 'approved' as const } : a
      ),
    };
    saveAutopilotState(newState);
    setState(newState);
    const item = state.pendingApprovals.find(a => a.id === id);
    if (item?.type === 'calendar' && item.data) {
      localStorage.setItem('growthOS_calendar', JSON.stringify(item.data));
    }
  };

  const skipItem = (id: string) => {
    const newState = {
      ...state,
      pendingApprovals: state.pendingApprovals.map(a =>
        a.id === id ? { ...a, status: 'skipped' as const } : a
      ),
    };
    saveAutopilotState(newState);
    setState(newState);
  };

  const approveAll = () => {
    const newState = {
      ...state,
      pendingApprovals: state.pendingApprovals.map(a =>
        a.status === 'pending' ? { ...a, status: 'approved' as const } : a
      ),
    };
    saveAutopilotState(newState);
    setState(newState);
    // Save calendar if present
    const calItem = state.pendingApprovals.find(a => a.type === 'calendar' && a.status === 'pending');
    if (calItem?.data) {
      localStorage.setItem('growthOS_calendar', JSON.stringify(calItem.data));
    }
  };

  const triggerManualRun = () => {
    const resetState = { ...state, weeklyCalendarGenerated: false };
    saveAutopilotState(resetState);
    setState(resetState);
    hasRun.current = false;
    window.location.reload();
  };

  return (
    <AutopilotContext.Provider
      value={{
        state,
        isRunning,
        currentTask,
        pendingApprovalCount: state.pendingApprovals.filter(a => a.status === 'pending').length,
        toggleAutopilot,
        approveItem,
        skipItem,
        triggerManualRun,
      }}
    >
      {children}
    </AutopilotContext.Provider>
  );
}

export const useAutopilot = () => {
  const ctx = useContext(AutopilotContext);
  if (!ctx) throw new Error('useAutopilot must be used within AutopilotProvider');
  return ctx;
};
