import AppButton from "@/components/AppButton";
import GoBackBtn from "@/components/GoBackBtn";
import ErrorModal from "@/components/ValidationError";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useUserPreference } from "@/context/UserPreferenceContext";
import { minutesToMilliseconds } from "@/utils/formatMinutesToTime";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const hoursSchema = z.object({
  hours: z
    .number()
    .min(0, "Hours can only be between 0 and 24")
    .max(24, "Hours can only be between 0 and 24"),
});

const minutesSchema = z.object({
  minutes: z
    .number()
    .min(0, "Minutes can only be between 0 and 60")
    .max(60, "Minutes can only be between 0 and 60"),
});

const budgetInMsSchema = z.object({
  budget: z
    .number()
    .int("Must be a whole number")
    .min(1, "Scroll budget must be atleast 1 minute")
    .max(TWENTY_FOUR_HOURS_IN_MS, "Scroll budget cannot exceed 24 hours"),
});

const UpdateScrollBudget = () => {
  const router = useRouter();
  const { updateScrollBudget } = useUserPreference();
  const [loading, setLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [showUpdateError, setShowUpdateError] = useState(false);
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [inputError, setInputError] = useState("");
  const [showInputError, setShowInputError] = useState(false);

  const increaseHourCounter = () => {
    const userInput = parseInt(hours);

    const validation = hoursSchema.safeParse({ hours: userInput });

    if (!validation.success) {
      const error = validation.error.issues[0].message;
      setInputError(error);
      setShowInputError(true);
      return;
    }

    setHours(clamp(userInput + 1, 0, 24).toString());
    return;
  };

  const decreaseHourCounter = () => {
    const userInput = parseInt(hours);
    const validation = hoursSchema.safeParse({ hours: userInput });

    if (!validation.success) {
      const error = validation.error.issues[0].message;
      setInputError(error);
      setShowInputError(true);
      return;
    }
    setHours(clamp(userInput - 1, 0, 24).toString());
  };

  const increaseMinuteCounter = () => {
    const userInput = parseInt(minutes);
    const validation = minutesSchema.safeParse({ minutes: userInput });

    if (!validation.success) {
      const error = validation.error.issues[0].message;
      setInputError(error);
      setShowInputError(true);
      return;
    }

    setMinutes(clamp(userInput + 1, 0, 60).toString());
    return;
  };

  const decreaseMinuteCounter = () => {
    const userInput = parseInt(minutes);
    const validation = minutesSchema.safeParse({ minutes: userInput });

    if (!validation.success) {
      const error = validation.error.issues[0].message;
      setInputError(error);
      setShowInputError(true);
      return;
    }

    setMinutes(clamp(userInput - 1, 0, 60).toString());
    return;
  };

  const handleHourInputChange = (text: string) => {
    if (text.trim() === "") {
      setHours("");
      return;
    }

    const parsed = parseInt(text, 10);
    const validation = hoursSchema.safeParse({ hours: parsed });

    if (!validation.success) {
      const error = validation.error.issues[0].message;
      setInputError(error);
      setShowInputError(true);
      return;
    }

    setHours(clamp(parsed, 0, 24).toString());
  };

  const handleMinuteInputChange = (text: string) => {
    if (text.trim() === "") {
      setMinutes("");
      return;
    }

    const parsed = parseInt(text, 10);

    const validation = minutesSchema.safeParse({ minutes: parsed });

    if (!validation.success) {
      const error = validation.error.issues[0].message;
      setInputError(error);
      setShowInputError(true);
      return;
    }

    if (parsed === 60 && parsed <= 60) {
      const userInput = parseInt(hours);
      setHours(clamp(userInput + 1, 0, 24).toString());
      setMinutes("");
      return;
    }

    setMinutes(clamp(parsed, 0, 60).toString());
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      // convert the hours and minutes to total minutes
      const budgetInMinutes = parseInt(hours) * 60 + parseInt(minutes);

      const validation = budgetInMsSchema.safeParse({
        budget: budgetInMinutes,
      });

      if (!validation.success) {
        setUpdateError(
          "Budget must be atleast 1 minute and must not exceed 24hrs",
        );
        setShowUpdateError(true);
        return;
      }

      // updates the scroll budget in the context
      await updateScrollBudget(minutesToMilliseconds(budgetInMinutes));

      router.replace("/(tabs)/Settings");

      setLoading(false);

      return;
    } catch (error) {
      console.error(
        "An error occured while updating your daily budget. Please try again",
        error,
      );
      setUpdateError(
        "An error occured while updating your daily budget. Please try again",
      );
      setShowUpdateError(true);
      setLoading(false);
      return;
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.backBtn}>
        <GoBackBtn onButtonPressed={() => router.replace("/(tabs)/Settings")} />
      </View>

      <View style={styles.form}>
        <Text style={styles.heading}>Set your daily limit</Text>
        <Text style={styles.supportingText}>
          This will be your shared daily budget across all apps.
        </Text>

        <View style={styles.inputs}>
          <View style={styles.item}>
            <Pressable style={styles.control} onPress={increaseHourCounter}>
              <Ionicons name="chevron-up" size={20} color={colors.iconMuted} />
            </Pressable>

            <TextInput
              style={styles.input}
              value={hours}
              onChangeText={handleHourInputChange}
              keyboardType="number-pad"
            />

            <Pressable style={styles.control} onPress={decreaseHourCounter}>
              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.iconMuted}
              />
            </Pressable>

            <Text style={styles.label}>Hours</Text>
          </View>

          <View style={styles.colons}>
            <View style={styles.colon} />
            <View style={styles.colon} />
          </View>

          <View style={styles.item}>
            <Pressable style={styles.control} onPress={increaseMinuteCounter}>
              <Ionicons name="chevron-up" size={20} color={colors.iconMuted} />
            </Pressable>

            <TextInput
              style={styles.input}
              value={minutes}
              onChangeText={handleMinuteInputChange}
              keyboardType="number-pad"
            />

            <Pressable style={styles.control} onPress={decreaseMinuteCounter}>
              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.iconMuted}
              />
            </Pressable>

            <Text style={styles.label}>Minutes</Text>
          </View>
        </View>
      </View>

      <AppButton isLoading={loading} onButtonPressed={handleContinue}>
        Continue
      </AppButton>

      <ErrorModal
        modalVisible={showUpdateError}
        onCloseModal={() => {
          setShowUpdateError(false);
          setUpdateError("");
        }}
        error={updateError}
      />

      <ErrorModal
        modalVisible={showInputError}
        onCloseModal={() => setShowInputError(false)}
        error={inputError}
      />
    </SafeAreaView>
  );
};

export default UpdateScrollBudget;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  backBtn: {
    marginBottom: spacing.md,
  },

  form: {
    flex: 1,
  },

  heading: {
    fontSize: typography.heading,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },

  supportingText: {
    fontSize: typography.body,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },

  inputs: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  item: {
    borderRadius: 15,
    alignItems: "center",
    gap: spacing.md,
  },

  control: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: colors.surfaceMuted,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    height: 60,
    width: 80,
    alignItems: "center",
    fontSize: typography.body,
    fontFamily: fonts.semiBold,
    textAlign: "center",
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 10,
  },

  colons: {
    gap: spacing.md,
    alignItems: "center",
  },

  colon: {
    width: 10,
    height: 10,
    backgroundColor: colors.surfaceMuted,
  },

  label: {
    fontFamily: fonts.medium,
    fontSize: typography.label,
    color: colors.textMuted,
  },
});
