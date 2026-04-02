export interface AutopilotTask {
  id: string;
  type: 'generate_calendar' | 'detect_festivals' | 'refresh_ad_recommendations'
    | 'generate_daily_tip' | 'check_performance' | 'festival_campaign_alert' | 'generate_weekly_visuals';
  status: 'pending' | 'running' | 'completed' | 'failed';
  scheduledFor: string;
  lastRunAt: string | null;
  result: any | null;
  requiresApproval: boolean;
}

export interface AutopilotState {
  isEnabled: boolean;
  lastFullRunAt: string | null;
  tasks: AutopilotTask[];
  pendingApprovals: ApprovalItem[];
  weeklyCalendarGenerated: boolean;
  calendarWeekOf: string | null;
}

export interface ApprovalItem {
  id: string;
  type: 'calendar' | 'caption' | 'festival_campaign' | 'ad_recommendation';
  title: string;
  preview: string;
  generatedAt: string;
  data: any;
  status: 'pending' | 'approved' | 'edited' | 'skipped';
}

const STORAGE_KEY = 'growthOS_autopilot';

export function getAutopilotState(): AutopilotState {
  try {
    if (typeof window === 'undefined') return defaultState();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultState();
}

function defaultState(): AutopilotState {
  return {
    isEnabled: true,
    lastFullRunAt: null,
    tasks: [],
    pendingApprovals: [],
    weeklyCalendarGenerated: false,
    calendarWeekOf: null,
  };
}

export function saveAutopilotState(state: AutopilotState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getPendingTasks(state: AutopilotState, _businessProfile: any): AutopilotTask[] {
  const now = new Date();
  const currentWeekMonday = getWeekMonday(now).toISOString().split('T')[0];
  const pending: AutopilotTask[] = [];

  // Task 1: Weekly calendar
  if (!state.weeklyCalendarGenerated || state.calendarWeekOf !== currentWeekMonday) {
    pending.push({
      id: 'weekly_calendar_' + currentWeekMonday,
      type: 'generate_calendar',
      status: 'pending',
      scheduledFor: now.toISOString(),
      lastRunAt: null,
      result: null,
      requiresApproval: true,
    });
  }

  // Task 2: Festival detection (daily)
  const lastFestivalCheck = state.tasks.find(t => t.type === 'detect_festivals')?.lastRunAt;
  if (!lastFestivalCheck || daysSince(lastFestivalCheck) >= 1) {
    pending.push({
      id: 'festival_check_' + now.toDateString(),
      type: 'detect_festivals',
      status: 'pending',
      scheduledFor: now.toISOString(),
      lastRunAt: null,
      result: null,
      requiresApproval: false,
    });
  }

  // Task 3: Ad recommendations (weekly)
  const lastAdRefresh = state.tasks.find(t => t.type === 'refresh_ad_recommendations')?.lastRunAt;
  if (!lastAdRefresh || daysSince(lastAdRefresh) >= 7) {
    pending.push({
      id: 'ad_refresh_' + currentWeekMonday,
      type: 'refresh_ad_recommendations',
      status: 'pending',
      scheduledFor: now.toISOString(),
      lastRunAt: null,
      result: null,
      requiresApproval: false,
    });
  }

  // Task 4: Daily tip
  const lastTip = state.tasks.find(t => t.type === 'generate_daily_tip')?.lastRunAt;
  if (!lastTip || daysSince(lastTip) >= 1) {
    pending.push({
      id: 'daily_tip_' + now.toDateString(),
      type: 'generate_daily_tip',
      status: 'pending',
      scheduledFor: now.toISOString(),
      lastRunAt: null,
      result: null,
      requiresApproval: false,
    });
  }

  // Task 5: Generate generic visuals for the week's approved calendar
  const lastVisualCheck = state.tasks.find(t => t.type === 'generate_weekly_visuals')?.lastRunAt;
  // If calendar generated and we haven't generated visuals for it yet, queue the visual task
  if (state.weeklyCalendarGenerated && (!lastVisualCheck || daysSince(lastVisualCheck) >= 7)) {
    pending.push({
      id: 'generate_visuals_' + currentWeekMonday,
      type: 'generate_weekly_visuals',
      status: 'pending',
      scheduledFor: now.toISOString(),
      lastRunAt: null,
      result: null,
      requiresApproval: false,
    });
  }

  return pending;
}

export async function runAutopilot(
  businessProfile: any,
  onTaskComplete: (task: AutopilotTask, state: AutopilotState) => void
): Promise<void> {
  const state = getAutopilotState();
  if (!state.isEnabled || !businessProfile) return;

  const tasks = getPendingTasks(state, businessProfile);
  if (tasks.length === 0) return;

  for (const task of tasks) {
    task.status = 'running';
    state.tasks = [...state.tasks.filter(t => t.id !== task.id), task];
    saveAutopilotState(state);

    try {
      if (task.type === 'generate_calendar') {
        const res = await fetch('/api/generate-calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessProfile, weekStartDate: new Date().toISOString() }),
        });
        const data = await res.json();
        task.result = data;
        task.status = 'completed';
        task.lastRunAt = new Date().toISOString();
        state.weeklyCalendarGenerated = true;
        state.calendarWeekOf = getWeekMonday(new Date()).toISOString().split('T')[0];

        if (task.requiresApproval) {
          state.pendingApprovals.push({
            id: 'approval_' + task.id,
            type: 'calendar',
            title: 'Your Weekly Content Calendar is Ready',
            preview: `7-day plan generated for w/c ${state.calendarWeekOf}. Click to review and approve.`,
            generatedAt: new Date().toISOString(),
            data: data,
            status: 'pending',
          });
        }
      }

      if (task.type === 'detect_festivals') {
        const res = await fetch('/api/detect-festivals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessProfile, lookAheadDays: 30 }),
        });
        task.result = await res.json();
        task.status = 'completed';
        task.lastRunAt = new Date().toISOString();

        const urgent = task.result?.festivals?.filter((f: any) => f.daysUntil <= 7);
        if (urgent?.length > 0) {
          state.pendingApprovals.push({
            id: 'festival_alert_' + urgent[0].festival,
            type: 'festival_campaign',
            title: `🎉 ${urgent[0].festival} is in ${urgent[0].daysUntil} days!`,
            preview: `Auto-generated campaign idea ready. Review and post before it's too late.`,
            generatedAt: new Date().toISOString(),
            data: urgent[0],
            status: 'pending',
          });
        }
      }

      if (task.type === 'generate_daily_tip') {
        const res = await fetch('/api/generate-captions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productDescription: 'daily marketing tip for ' + businessProfile.industry,
            businessProfile,
            platform: 'all',
            tipMode: true,
          }),
        });
        task.result = await res.json();
        task.status = 'completed';
        task.lastRunAt = new Date().toISOString();
        localStorage.setItem('growthOS_dailyTip', JSON.stringify({
          tip: task.result,
          date: new Date().toDateString(),
        }));
      }

      if (task.type === 'refresh_ad_recommendations') {
        const res = await fetch('/api/ad-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessProfile }),
        });
        task.result = await res.json();
        task.status = 'completed';
        task.lastRunAt = new Date().toISOString();
        localStorage.setItem('growthOS_adRecs', JSON.stringify(task.result));
      }

      if (task.type === 'generate_weekly_visuals') {
        const calData = localStorage.getItem('growthOS_calendar');
        if (calData) {
           const calendar = JSON.parse(calData);
           let updated = false;
           // Find a day without an image and generate one (Mocking loop for demo)
           for (const day of calendar) {
             if (day.imageKeyword && !day.pollinationsImg) {
               // Generate visual
               try {
                 const { buildAIImagePrompt, buildVariationUrls, SOCIAL_FORMATS } = await import('@/lib/pollinations');
                 const prompt = await buildAIImagePrompt(businessProfile.name, businessProfile.industry, day.theme, businessProfile.brandTone || 'Professional', day.festivalHook || null, 'vibrant');
                 const urls = buildVariationUrls(prompt, SOCIAL_FORMATS.find(f => f.name === 'instagram_post')!, 1, 'flux');
                 day.pollinationsImg = urls[0];
                 updated = true;
               } catch(e) { console.error(e) }
             }
           }
           if (updated) {
               localStorage.setItem('growthOS_calendar', JSON.stringify(calendar));
           }
        }
        task.status = 'completed';
        task.lastRunAt = new Date().toISOString();
      }
    } catch {
      task.status = 'failed';
      task.lastRunAt = new Date().toISOString();
    }

    state.tasks = [...state.tasks.filter(t => t.id !== task.id), task];
    state.lastFullRunAt = new Date().toISOString();
    saveAutopilotState(state);
    onTaskComplete(task, { ...state });
  }
}

function getWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
}

function daysSince(isoString: string): number {
  return (Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60 * 24);
}
