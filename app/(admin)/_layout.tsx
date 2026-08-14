import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { COLORS } from "@/constants/theme";

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Students"
        options={{
          title: "Students",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Lecturers"
        options={{
          title: "Lecturers",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen name="create-user" options={{ href: null }} />
      <Tabs.Screen name="user/[id]" options={{ href: null }} />
    </Tabs>
  );
}
