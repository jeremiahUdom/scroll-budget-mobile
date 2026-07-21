import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { typography } from "@/constants/typography";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  index: number;
  currentItem: SharedValue<number>;
  children: ReactNode;
}

const OnboardingText = (props: Props) => {
  const { index, currentItem, children } = props;
  const display = useSharedValue<"flex" | "none">(
    index === 0 ? "flex" : "none",
  );

  const animStyle = useAnimatedStyle(() => {
    const isActive = currentItem.value === index;

    if (isActive) {
      display.value = "flex"; // show immediately before fading in
    }

    return {
      opacity: withTiming(isActive ? 1 : 0, { duration: 800 }, (finished) => {
        if (finished && !isActive) {
          display.value = "none"; // hide only after fade-out completes
        }
      }),
      display: display.value,
    };
  });
  return (
    <Animated.Text style={[styles.text, animStyle]}>{children}</Animated.Text>
  );
};

export default OnboardingText;

const styles = StyleSheet.create({
  text: {
    fontSize: typography.body,
    lineHeight: 24,
    color: colors.textSecondary,
    position: "absolute",
    fontFamily: fonts.regular,
  },
});
