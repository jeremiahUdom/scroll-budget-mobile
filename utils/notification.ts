import AsyncStorage from "@react-native-async-storage/async-storage"

const STORAGE_KEY_PREFIX = "notifiedThresholds"

export type NotifiedThresholds = {
  80: boolean
  90: boolean
  100: boolean
}

const DEFAULT_THRESHOLDS: NotifiedThresholds = {
  80: false,
  90: false,
  100: false,
}

// e.g. "2026-07-08" - using local date, not UTC, so the reset happens
// at local midnight rather than UTC midnight.
const getTodayDateKey = (): string =>  {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getStorageKey = ( ): string =>  {
  return `${STORAGE_KEY_PREFIX}:${getTodayDateKey()}`
}

export const getNotifiedThresholdsForToday = async (): Promise<NotifiedThresholds> => {
  try {
    const raw = await AsyncStorage.getItem(getStorageKey())

    if (!raw) {
      return DEFAULT_THRESHOLDS
    }

    return JSON.parse(raw) as NotifiedThresholds
  } catch (error) {
    // If storage read fails or data is corrupted, fail safe by treating
    // today as "not yet notified" rather than crashing the background task.
    console.error("Failed to read notified thresholds:", error)
    return DEFAULT_THRESHOLDS
  }
}

export const setNotifiedThresholdsForToday = async (
  thresholds: NotifiedThresholds
): Promise<void> => {
  try {
    await AsyncStorage.setItem(getStorageKey(), JSON.stringify(thresholds))
  } catch (error) {
    console.error("Failed to save notified thresholds:", error)
  }
}