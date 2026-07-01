// services/storage.ts (or utils/storage.ts)
import AsyncStorage from '@react-native-async-storage/async-storage'

// Generic save/get/delete functions
export const saveData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key}:`, error)
    throw error
  }
}

export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await AsyncStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error(`Error getting ${key}:`, error)
    return null
  }
}

export const deleteData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error(`Error deleting ${key}:`, error)
    throw error
  }
}

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear()
  } catch (error) {
    console.error('Error clearing storage:', error)
    throw error
  }
}