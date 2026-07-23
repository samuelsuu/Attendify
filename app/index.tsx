import { Redirect } from "expo-router";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/use-auth";
import { useOnboarding } from "@/hooks/use-onboarding";

export default function Index() {
  const { session, profile, isLoading } = useAuth();
  const { hasCompletedOnboarding } = useOnboarding();

  if (isLoading || hasCompletedOnboarding === null) {
    return <LoadingSpinner />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  if (profile?.role === "admin") {
    return <Redirect href="/(admin)" />;
  }

  return <Redirect href="/(member)" />;
}
