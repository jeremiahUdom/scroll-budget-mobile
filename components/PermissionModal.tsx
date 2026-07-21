import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import Ionicons from "@react-native-vector-icons/ionicons";
import { openUsagePermissionSettings } from "@sahil_sensei/react-native-app-usage";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface PermissionModalProps {
  visible: boolean;
  onDismiss: () => void;
}

const PermissionModal = ({ visible, onDismiss }: PermissionModalProps) => {
  const handleOpenSettings = async () => {
    await openUsagePermissionSettings();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.overlayPress} onPress={onDismiss} />

        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={50}
              color={colors.iconSecondary}
            />
          </View>

          <Text style={styles.title}>Enable Usage Access</Text>

          <Text style={styles.subtitle}>
            Grant permission to see your app usage stats and stay within your
            daily budget.
          </Text>

          <View style={styles.buttonsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleOpenSettings}
            >
              <Text style={styles.primaryButtonText}>Open Settings</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [pressed && styles.buttonPressed]}
              onPress={onDismiss}
            >
              <Text style={styles.secondaryButtonText}>Maybe Later</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PermissionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  overlayPress: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  modal: {
    backgroundColor: colors.elevated,
    borderRadius: 16,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    width: "85%",
    maxWidth: 320,
  },

  iconContainer: {
    marginBottom: spacing.lg,
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: typography.heading,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },

  subtitle: {
    fontFamily: fonts.regular,
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 24,
  },

  buttonsContainer: {
    width: "100%",
    gap: spacing.md,
  },

  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  primaryButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: typography.body,
    color: colors.surface,
  },

  secondaryButtonText: {
    fontFamily: fonts.medium,
    fontSize: typography.body,
    color: colors.text,
    textAlign: "center",
  },
});
