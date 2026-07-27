import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useOnboarding } from "@/hooks/use-onboarding";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge: string;
  highlights: { icon: keyof typeof Ionicons.glyphMap; text: string }[];
};

const SLIDES: Slide[] = [
  {
    id: "welcome",
    title: "Welcome to Webcapz Technologies",
    subtitle: "Effortless & Intelligent Tracking",
    description:
      "A modern solution designed for universities, schools, and organizations to handle attendance with total precision.",
    icon: "school-outline",
    badge: "Smart Platform",
    highlights: [
      { icon: "flash-outline", text: "Instant records" },
      { icon: "shield-checkmark-outline", text: "Verified users" },
      { icon: "sync-outline", text: "Real-time sync" },
    ],
  },
  {
    id: "qr-scanning",
    title: "Dynamic QR Code Check-in",
    subtitle: "Scan & Verify in Seconds",
    description:
      "Students present their unique personal QR code, and lecturers or admins scan it instantly to record attendance.",
    icon: "qr-code-outline",
    badge: "Contactless",
    highlights: [
      { icon: "scan-outline", text: "High-speed scanner" },
      { icon: "lock-closed-outline", text: "Secure tokens" },
      { icon: "checkmark-circle-outline", text: "Duplicate detection" },
    ],
  },
  {
    id: "analytics",
    title: "Live Attendance Insights",
    subtitle: "Comprehensive History & Stats",
    description:
      "Monitor daily presence counts, search student history, and inspect detailed records with zero hassle.",
    icon: "bar-chart-outline",
    badge: "Real-time Data",
    highlights: [
      { icon: "time-outline", text: "Full audit log" },
      { icon: "filter-outline", text: "Smart search & filter" },
      { icon: "trending-up-outline", text: "Presence metrics" },
    ],
  },
  {
    id: "roles",
    title: "Role-Based Access",
    subtitle: "Admin, Lecturer & Student Workflows",
    description:
      "Tailored experiences for everyone. Admins manage accounts & scanners, while students view personal check-ins.",
    icon: "people-outline",
    badge: "Multi-Role",
    highlights: [
      { icon: "person-add-outline", text: "Quick user creation" },
      { icon: "key-outline", text: "Authentication" },
      { icon: "sparkles-outline", text: "Intuitive UI" },
    ],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  function triggerHaptic() {
    Haptics.selectionAsync().catch(() => { });
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex && index >= 0 && index < SLIDES.length) {
      setCurrentIndex(index);
      triggerHaptic();
    }
  }

  async function handleFinish() {
    triggerHaptic();
    await completeOnboarding();
    router.replace("/login");
  }

  function handleNext() {
    if (currentIndex < SLIDES.length - 1) {
      triggerHaptic();
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinish();
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      triggerHaptic();
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  }

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-[#0B3D63]">
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 pt-3 pb-2">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#1C7FC4]">
            <Ionicons name="school" size={18} color="#ffffff" />
          </View>
          <Text className="text-sm font-bold tracking-wider text-[#FFF]">
            Webcapz
          </Text>
        </View>

        <Pressable
          onPress={handleFinish}
          hitSlop={12}
          className="flex-row items-center gap-1 rounded-full bg-[#FFF]/15 px-3.5 py-1.5 active:bg-[#FFF]/25"
        >
          <Text className="text-xs font-semibold text-[#FFF]">Skip</Text>
          <Ionicons name="chevron-forward" size={14} color="#B8BCC2" />
        </Pressable>
      </View>

      {/* Main Slides Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View
            style={{ width: SCREEN_WIDTH }}
            className="flex-1 justify-between px-8 py-6"
          >
            {/* Upper Graphic Container */}
            <View className="items-center justify-center py-6">
              <View className="relative items-center justify-center">
                {/* Glow Background Rgb */}
                <View className="h-44 w-44 rounded-full bg-[#1C7FC4]/20" />
                <View className="absolute h-36 w-36 items-center justify-center rounded-3xl bg-[#1C7FC4]/30 border border-[#B8BCC2]/30 shadow-2xl">
                  <View className="h-28 w-28 items-center justify-center rounded-2xl bg-[#1C7FC4] shadow-lg">
                    <Ionicons name={item.icon} size={54} color="#ffffff" />
                  </View>
                </View>
              </View>

              <View className="mt-6 rounded-full bg-[#B8BCC2]/20 px-3.5 py-1 border border-[#B8BCC2]/30">
                <Text className="text-xs font-semibold text-[#B8BCC2]">
                  {item.badge}
                </Text>
              </View>
            </View>

            {/* Slide Content */}
            <Animated.View entering={FadeInDown.duration(400)} className="gap-3">
              <Text className="text-xs font-bold uppercase tracking-widest text-[#B8BCC2]">
                {item.subtitle}
              </Text>
              <Text className="text-3xl font-extrabold text-[#FFF] leading-tight">
                {item.title}
              </Text>
              <Text className="text-base text-[#B8BCC2] leading-relaxed">
                {item.description}
              </Text>

              {/* Highlights Chips */}
              <View className="mt-2 flex-row flex-wrap gap-2">
                {item.highlights.map((h, i) => (
                  <View
                    key={i}
                    className="flex-row items-center gap-1.5 rounded-xl bg-[#FFF]/10 px-3 py-2 border border-[#FFF]/20"
                  >
                    <Ionicons name={h.icon} size={14} color="#FFF" />
                    <Text className="text-xs font-medium text-[#FFF]">
                      {h.text}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          </View>
        )}
      />

      {/* Bottom Controls */}
      <View className="gap-6 px-8 pb-8 pt-2">
        {/* Step Indicator Dots */}
        <View className="flex-row items-center justify-center gap-2">
          {SLIDES.map((_, i) => {
            const isActive = i === currentIndex;
            return (
              <View
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${isActive ? "w-8 bg-[#1C7FC4]" : "w-2 bg-[#B8BCC2]"
                  }`}
              />
            );
          })}
        </View>

        {/* Action Buttons Row */}
        <View className="flex-row items-center justify-between gap-4">
          {currentIndex > 0 ? (
            <Pressable
              onPress={handleBack}
              className="flex-row items-center gap-2 rounded-2xl bg-[#FFF]/10 px-5 py-4 active:bg-[#FFF]/20 border border-[#FFF]/20"
            >
              <Ionicons name="arrow-back" size={18} color="#FFF" />
              <Text className="text-sm font-semibold text-[#FFF]">Back</Text>
            </Pressable>
          ) : (
            <View className="flex-1" />
          )}

          <Pressable
            onPress={handleNext}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-[#1C7FC4] px-6 py-4 active:bg-[#0B3D63] shadow-lg shadow-[#0B3D63]/40"
          >
            <Text className="text-base font-bold text-white">
              {isLastSlide ? "Get Started" : "Next"}
            </Text>
            <Ionicons
              name={isLastSlide ? "checkmark-circle" : "arrow-forward"}
              size={20}
              color="#ffffff"
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
