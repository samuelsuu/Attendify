import { KeyboardProvider } from "react-native-keyboard-controller";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/query-client";

SplashScreen.preventAutoHideAsync().catch(() => { });

function RootNavigator() {
  const { session, profile, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Protected guard={!session}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={!!session && profile?.role === "admin"}>
        <Stack.Screen name="(admin)" />
      </Stack.Protected>
      <Stack.Protected
        guard={!!session && !!profile && profile.role !== "admin"}
      >
        <Stack.Screen name="(member)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <RootNavigator />
              <StatusBar style="dark" />
            </AuthProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
