export interface TimeSlot {
  hour: number;
  day: string;
  platform: string;
  predictedEngagementScore: number;
  reasoning: string;
  isOptimal: boolean;
  tier: 'prime' | 'good' | 'average' | 'poor';
}

// Indian audience activity patterns (IST timezone, based on published studies)
const INDIAN_ACTIVITY_BASELINE: Record<number, number> = {
  0: 10, 1: 5, 2: 3, 3: 3, 4: 5, 5: 12,
  6: 25, 7: 55, 8: 65, 9: 50, 10: 40, 11: 45,
  12: 60, 13: 65, 14: 50, 15: 45, 16: 50, 17: 60,
  18: 80, 19: 95, 20: 100, 21: 90, 22: 70, 23: 40,
};

const PLATFORM_MODIFIERS: Record<string, Record<number, number>> = {
  instagram: { 7: 1.2, 8: 1.1, 12: 1.1, 19: 1.3, 20: 1.4, 21: 1.3 },
  linkedin: { 8: 1.4, 9: 1.3, 10: 1.2, 12: 1.1, 17: 1.2, 18: 1.1 },
  facebook: { 12: 1.2, 13: 1.2, 19: 1.2, 20: 1.3, 21: 1.1 },
  twitter: { 8: 1.2, 12: 1.1, 17: 1.2, 19: 1.3, 20: 1.2 },
};

const DAY_MODIFIERS: Record<string, number> = {
  Monday: 0.85,
  Tuesday: 1.0,
  Wednesday: 1.05,
  Thursday: 1.1,
  Friday: 1.05,
  Saturday: 1.15,
  Sunday: 1.2,
};

const CONTENT_TYPE_MODIFIERS: Record<string, Record<number, number>> = {
  carousel: { 8: 1.2, 12: 1.1, 19: 1.3, 20: 1.2 },
  reel: { 19: 1.4, 20: 1.5, 21: 1.3, 12: 1.1 },
  static: { 8: 1.1, 19: 1.2, 20: 1.2 },
  story: { 7: 1.2, 8: 1.1, 12: 1.0, 20: 1.2, 21: 1.1 },
};

export function predictOptimalTimes(
  platform: string,
  contentType: string,
  industry: string,
  topN: number = 5
): TimeSlot[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const allSlots: TimeSlot[] = [];
  const ptf = platform.toLowerCase();
  const ctf = contentType.toLowerCase();

  for (const day of days) {
    for (let hour = 6; hour <= 22; hour++) {
      let score = INDIAN_ACTIVITY_BASELINE[hour] || 30;
      score *= PLATFORM_MODIFIERS[ptf]?.[hour] || 1.0;
      score *= DAY_MODIFIERS[day] || 1.0;
      score *= CONTENT_TYPE_MODIFIERS[ctf]?.[hour] || 1.0;

      // Industry-specific boosts
      if (industry.toLowerCase().includes('food') && [12, 13, 19, 20].includes(hour))
        score *= 1.2;
      if (industry.toLowerCase().includes('fashion') && [19, 20, 21].includes(hour))
        score *= 1.15;
      if (
        (industry.toLowerCase().includes('tech') || industry.toLowerCase().includes('saas')) &&
        [9, 10, 11].includes(hour) &&
        ['Tuesday', 'Wednesday', 'Thursday'].includes(day)
      )
        score *= 1.3;

      const normalizedScore = Math.min(100, Math.round(score));
      const tier =
        normalizedScore >= 80
          ? 'prime'
          : normalizedScore >= 65
          ? 'good'
          : normalizedScore >= 45
          ? 'average'
          : 'poor';

      allSlots.push({
        hour,
        day,
        platform,
        predictedEngagementScore: normalizedScore,
        reasoning: generateReasoning(hour, day, platform, normalizedScore),
        isOptimal: normalizedScore >= 80,
        tier,
      });
    }
  }

  return allSlots
    .sort((a, b) => b.predictedEngagementScore - a.predictedEngagementScore)
    .slice(0, topN);
}

function generateReasoning(
  hour: number,
  day: string,
  platform: string,
  score: number
): string {
  if (hour >= 19 && hour <= 21)
    return 'Prime evening window — Indian audience peak activity after work/dinner';
  if (hour >= 7 && hour <= 9)
    return 'Morning commute window — high mobile usage while traveling';
  if (hour >= 12 && hour <= 13)
    return 'Lunch break scroll — users active during midday break';
  if (day === 'Sunday' && hour >= 19)
    return 'Sunday evening prime time — highest leisure scrolling of the week';
  if (day === 'Saturday')
    return 'Weekend activity spike — more free leisure browsing time';
  return score >= 65
    ? 'Good activity window for target audience'
    : 'Lower activity period — consider a different time slot';
}

export function generateWeeklyHeatmapData(
  platform: string,
  contentType: string,
  industry: string
) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = [7, 8, 9, 10, 12, 13, 15, 17, 18, 19, 20, 21];
  const fullDayMap: Record<string, string> = {
    Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
    Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
  };
  const ptf = platform.toLowerCase();
  const ctf = contentType.toLowerCase();

  return days.map((day) => ({
    day,
    slots: hours.map((hour) => {
      const fullDay = fullDayMap[day]!;
      let score = INDIAN_ACTIVITY_BASELINE[hour] || 30;
      score *= PLATFORM_MODIFIERS[ptf]?.[hour] || 1.0;
      score *= DAY_MODIFIERS[fullDay] || 1.0;
      score *= CONTENT_TYPE_MODIFIERS[ctf]?.[hour] || 1.0;

      if (industry.toLowerCase().includes('food') && [12, 13, 19, 20].includes(hour))
        score *= 1.2;
      if (industry.toLowerCase().includes('fashion') && [19, 20, 21].includes(hour))
        score *= 1.15;

      return {
        hour: `${hour}:00`,
        score: Math.min(100, Math.round(score)),
        reasoning: generateReasoning(hour, fullDay, platform, Math.min(100, Math.round(score))),
      };
    }),
  }));
}
