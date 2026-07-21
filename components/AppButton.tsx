import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { typography } from "@/constants/typography";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface Props extends TouchableNativeFeedbackProps {
  children: ReactNode;
  onButtonPressed: () => void;
  isLoading?: boolean;
  customStyle?: StyleProp<ViewStyle>;
}

const AppButton = ({
  children,
  onButtonPressed,
  isLoading,
  customStyle,
  ...props
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onButtonPressed}
      style={[styles.button, customStyle]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size={"large"} color={colors.surface} />
      ) : (
        <Text style={styles.text}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: typography.button,
    color: colors.surface,
    fontFamily: fonts.bold,
  },
});
