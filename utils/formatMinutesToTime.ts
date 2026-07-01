export const formatDurationFromMilliseconds = (ms: number) => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
}

/**
 * Convert minutes to milliseconds
 */
export const minutesToMilliseconds = (minutes: number): number => {
  return minutes * 60 * 1000
}

/**
 * Convert milliseconds to minutes
 */
export const millisecondsToMinutes = (milliseconds: number): number => {
  return milliseconds / (60 * 1000)
}