import { HAS_ONBOARDED_KEY } from "./localStorage"
import { getData, saveData } from "../storage"

export const setHasOnboardedValue = async (value: boolean) => 
  await saveData(HAS_ONBOARDED_KEY, value)

export const getHasOnboarded = async (): Promise<boolean> => {
  const hasOnboarded = await getData<boolean>(HAS_ONBOARDED_KEY)
  return hasOnboarded ?? false
}