export interface WeeklyAnalyticsResponse {
  startDate: Date;
  endDate: Date;

  totalScreenTimeInMs: number;
  dailyAverageInMs: number;

  daysOnTrack: number;

  weeklyTrend: {
    percentage: number;
    direction: "up" | "down" | "same";
  };

  dailyUsage: DailyUsage[];

  mostUsedApp: MostUsedApp | null;
}

export interface DailyUsage {
  date: Date;
  totalScreenTimeInMs: number;
  scrollBudgetInMs: number;
  onTrack: boolean;
}

export interface MostUsedApp {
  packageName: string;
  totalScreenTimeInMs: number;
}