import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface Props {
  currentItem: SharedValue<number>;
  index: number;
}

const OnboardingIndicator = (props: Props) => {
  const { currentItem, index } = props;

  const animStyle = useAnimatedStyle(() => {
    const isActive = currentItem.value === index;
    return {
      width: withTiming(isActive ? 25 : 10, { duration: 800 }),
      backgroundColor: withTiming(
        isActive ? colors.primary : colors.surfaceMuted,
      ),
    };
  });

  return <Animated.View style={[styles.indicator, animStyle]} />;
};

export default OnboardingIndicator;

const styles = StyleSheet.create({
  indicator: {
    height: 10,
    borderRadius: 5,
  },
});
