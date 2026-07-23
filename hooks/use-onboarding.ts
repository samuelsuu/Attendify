import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const ONBOARDING_KEY = "@attendance_onboarding_completed";

export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadOnboardingStatus() {
      try {
        const stored = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasCompletedOnboarding(stored === "true");
      } catch (err) {
        console.error("Failed to load onboarding state", err);
        setHasCompletedOnboarding(false);
      }
    }

    loadOnboardingStatus();
  }, []);

  async function completeOnboarding() {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      setHasCompletedOnboarding(true);
    } catch (err) {
      console.error("Failed to save onboarding state", err);
    }
  }

  async function resetOnboarding() {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      setHasCompletedOnboarding(false);
    } catch (err) {
      console.error("Failed to reset onboarding state", err);
    }
  }

  return {
    hasCompletedOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
}
