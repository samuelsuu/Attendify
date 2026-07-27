import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, FONT_SIZE, RADIUS, SPACING } from "@/constants/theme";
import { useOnboarding } from "@/hooks/use-onboarding";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Slide = {
  id: string;
  title: string;
  description: string;
  image: number;
};

const SLIDES: Slide[] = [
  {
    id: "welcome",
    title: "Welcome to Webcapz",
    description: "A simple way for universities to track attendance with total precision.",
    image: require("@/assets/images/onboarding/welcome.png"),
  },
  {
    id: "qr-scanning",
    title: "Scan & Check In",
    description:
      "Every student and lecturer gets a personal QR code. An admin or lecturer scans it to record attendance instantly.",
    image: require("@/assets/images/onboarding/qr-scanning.png"),
  },
  {
    id: "analytics",
    title: "Full Attendance History",
    description: "See daily presence counts and a complete, searchable attendance record.",
    image: require("@/assets/images/onboarding/analytics.png"),
  },
  {
    id: "roles",
    title: "Built for Every Role",
    description: "Admins manage accounts and scan QR codes, while students and lecturers track their own check-ins.",
    image: require("@/assets/images/onboarding/roles.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  function triggerHaptic() {
    Haptics.selectionAsync().catch(() => {});
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
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      handleFinish();
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      triggerHaptic();
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
    }
  }

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>WEBCAPZ</Text>
        <Pressable onPress={handleFinish} hitSlop={12} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

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
          <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <Animated.View entering={FadeInDown.duration(400)} style={styles.textBlock}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </Animated.View>
          </View>
        )}
      />

      <View style={styles.bottomControls}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.actionsRow}>
          {currentIndex > 0 ? (
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
          ) : (
            <View style={styles.flex} />
          )}

          <Pressable onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>{isLastSlide ? "Get Started" : "Next"}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  brand: { fontSize: FONT_SIZE.sm, fontWeight: "700", letterSpacing: 1.5, color: COLORS.primaryDark },
  skipButton: {
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    backgroundColor: COLORS.mutedLight,
  },
  skipText: { fontSize: FONT_SIZE.xs, fontWeight: "600", color: COLORS.textSecondary },
  slide: { flex: 1, alignItems: "center", paddingHorizontal: SPACING.xxl, paddingTop: SPACING.lg },
  image: {
    width: "100%",
    height: 280,
    borderRadius: RADIUS.xxl,
    backgroundColor: COLORS.mutedLight,
  },
  textBlock: { marginTop: SPACING.xxl, gap: SPACING.sm, alignItems: "center" },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: "800", color: COLORS.textPrimary, textAlign: "center" },
  description: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  bottomControls: { gap: SPACING.xl, paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.xxl, paddingTop: SPACING.sm },
  dots: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: SPACING.sm },
  dot: { height: 8, width: 8, borderRadius: 4, backgroundColor: COLORS.muted },
  dotActive: { width: 24, backgroundColor: COLORS.primary },
  actionsRow: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  backButton: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  backButtonText: { fontSize: FONT_SIZE.md, fontWeight: "600", color: COLORS.textSecondary },
  nextButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
  },
  nextButtonText: { fontSize: FONT_SIZE.lg, fontWeight: "700", color: COLORS.white },
});
