export interface App {
  name: string;
  packageName: string;
  icon: string;
}

export interface TrackedAppUsageStat extends App {
  totalTimeInForeground: number;
}
