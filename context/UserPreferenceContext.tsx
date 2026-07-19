import { App } from "@/types/App";
import {
  getHasOnboarded,
  setHasOnboardedValue,
} from "@/utils/localDataManager/hasOnboardedStorage";
import {
  getScrollBudget,
  setScrollBudget,
} from "@/utils/localDataManager/scrollBudgetStorage";
import {
  getTrackedApps,
  setTrackedApps,
} from "@/utils/localDataManager/trackedAppsStorage";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserPreferenceContextType = {
  scrollBudgetInMs: number;
  myTrackedApps: App[];
  updateTrackedApps: (apps: App[]) => Promise<void>;
  updateScrollBudget: (budgetInMs: number) => Promise<void>;
  isInitialising: boolean;
  hasOnboarded: boolean;
  updateHasOnboarded: (value: boolean) => Promise<void>;
};

const UserPreferenceContext = createContext<
  UserPreferenceContextType | undefined
>(undefined);

type Props = {
  children: React.ReactNode;
};

// Use this hook to access the user info.
export const useUserPreference = () => {
  const value = useContext(UserPreferenceContext);

  if (!value) {
    throw new Error(
      "useUserPreference must be wrapped in an <UserPreferenceProvider />",
    );
  }

  return value;
};

export const UserPreferenceProvider = ({ children }: Props) => {
  const [myTrackedApps, setMyTrackedApps] = useState<App[]>([]);
  const [scrollBudgetInMs, setScrollBudgetInMs] = useState(0);
  const [isInitialising, setIsInitialising] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  const updateTrackedApps = async (apps: App[]) => {
    try {
      setMyTrackedApps(apps);
      await setTrackedApps(apps.map((app) => app));

      return;
    } catch (error) {
      console.error("Failed to update tracked apps", error);
      throw new Error("Failed to update tracked apps. Please try again.");
    }
  };

  const updateScrollBudget = async (budgetInMs: number) => {
    try {
      setScrollBudgetInMs(budgetInMs);
      await setScrollBudget(budgetInMs);

      return;
    } catch (error) {
      console.error("Failed to update scroll budget", error);
      throw new Error("Failed to update scroll budget. Please try again.");
    }
  };

  const updateHasOnboarded = async (value: boolean) => {
    try {
      setHasOnboarded(value);
      await setHasOnboardedValue(value);
    } catch (error) {
      console.error("Failed to update onboarding status", error);
      throw new Error("Failed to update onboarding status. Please try again.");
    }
  };

  useEffect(() => {
    const initialiseApp = async () => {
      try {
        // get 'hasOnboarded' from async storage, if true, user has onboarded before, if false, user hasn't meaning, the user is a new user
        const hasOnboarded = await getHasOnboarded();
        if (!hasOnboarded) {
          setHasOnboarded(false);
          setIsInitialising(false);
          return;
        }
        setHasOnboarded(true);

        // get users budget from async storage
        const budget = await getScrollBudget();
        setScrollBudgetInMs(budget);

        // get tracked apps from async storage
        const trackedApps = await getTrackedApps();
        setMyTrackedApps(trackedApps);

        return;
      } catch (error) {
        console.error("App initialisation failed", error);
      } finally {
        setIsInitialising(false);
      }
    };

    initialiseApp();
  }, []);

  return (
    <UserPreferenceContext.Provider
      value={{
        myTrackedApps,
        scrollBudgetInMs,
        updateTrackedApps,
        updateScrollBudget,
        isInitialising,
        hasOnboarded,
        updateHasOnboarded,
      }}
    >
      {children}
    </UserPreferenceContext.Provider>
  );
};

export default UserPreferenceContext;
