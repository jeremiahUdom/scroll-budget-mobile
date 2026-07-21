import AppButton from "@/components/AppButton";
import ErrorModal from "@/components/ErrorModal";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useUserPreference } from "@/context/UserPreferenceContext";
import { AppError } from "@/types/AppError";
import { minutesToMilliseconds } from "@/utils/formatMinutesToTime";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Item = {
  id: string;
  label: string;
  value: number;
  type: "hours" | "minutes";
};

const PRESET: Item[] = [
  {
    id: "15",
    label: "15 min",
    value: 15,
    type: "minutes",
  },

  {
    id: "30",
    label: "30 min",
    value: 30,
    type: "minutes",
  },

  {
    id: "60",
    label: "1 hr",
    value: 60,
    type: "hours",
  },

  {
    id: "120",
    label: "2 hrs",
    value: 120,
    type: "hours",
  },

  {
    id: "0",
    label: "Custom",
    value: 0,
    type: "minutes",
  },
];

const SetDailyBudget = () => {
  const router = useRouter();
  const { updateScrollBudget } = useUserPreference();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [error, setError] = useState<AppError | null>(null);

  const handleSelected = (item: Item) => {
    if (item.id === "0") {
      router.push("/(onboarding)/SetCustomTime");
      return;
    }

    setSelectedItem(item);
    return;
  };

  const handleContinue = async () => {
    if (!selectedItem) {
      setError({
        visible: true,
        title: "No budget selected",
        message: "Please choose a daily scroll budget before continuing.",
      });
      return;
    }

    setLoading(true);

    try {
      // updates the scroll budget in the context
      const budgetInMilliseconds = minutesToMilliseconds(selectedItem.value);

      await updateScrollBudget(budgetInMilliseconds);

      router.replace("/(onboarding)/GetNotified");

      setLoading(false);

      return;
    } catch (error) {
      console.error("An error occured while saving your daily budget", error);
      setError({
        visible: true,
        title: "Couldn't save your selection",
        message:
          "An error occurred while saving your budget. Please try again.",
      });
      setLoading(false);
      return;
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.progress}>
        <View style={styles.steps}>
          <Text style={styles.stepText}>Step 2 of 3</Text>
        </View>

        <Link style={styles.skipText} href={"/SelectApps"} push>
          Skip
        </Link>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.heading}>
          How much time do you want to spend on the apps you selected each day?
        </Text>
        <Text style={styles.supportingText}>
          This will be your shared daily budget across all the apps you
          selected. You can change your budget once per day.
        </Text>

        <FlatList
          data={PRESET}
          keyExtractor={(item, _idx) => _idx.toString()}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => handleSelected(item)}
              style={[
                styles.listItem,
                selectedItem?.id === item.id && styles.itemSelected,
              ]}
            >
              <Ionicons
                name={index === PRESET.length - 1 ? "add" : "time-outline"}
                size={20}
                color={colors.primary}
              />
              <Text style={styles.text}>{item.label}</Text>
            </Pressable>
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <AppButton isLoading={loading} onButtonPressed={handleContinue}>
        Continue
      </AppButton>

      <ErrorModal
        visible={error?.visible ?? false}
        onClose={() => setError(null)}
        title={error?.title ?? ""}
        message={error?.message ?? ""}
      />
    </SafeAreaView>
  );
};

export default SetDailyBudget;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  backBtn: {
    marginBottom: spacing.md,
  },

  progress: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  steps: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: 30,
  },

  stepText: {
    fontSize: typography.caption,
    fontFamily: fonts.medium,
    color: colors.primary,
  },

  skipText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontFamily: fonts.medium,
    textAlign: "center",
  },

  mainContent: {
    flex: 1,
  },

  heading: {
    fontSize: typography.heading,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  supportingText: {
    fontSize: typography.body,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },

  list: {
    flex: 1,
  },

  listContent: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },

  listItem: {
    height: 55,
    width: "100%",
    borderWidth: 1.5,
    borderColor: colors.elevated,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 15,
  },

  text: {
    fontFamily: fonts.medium,
    fontSize: typography.body,
    color: colors.text,
  },

  itemSelected: {
    backgroundColor: colors.surface,
  },
});
