import { colors } from "@/constants/colors"
import { fonts } from "@/constants/fonts"
import { spacing } from "@/constants/spacing"
import { typography } from "@/constants/typography"
import Ionicons from "@react-native-vector-icons/ionicons"
import { openUsagePermissionSettings } from "@sahil_sensei/react-native-app-usage"
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"

interface PermissionModalProps {
  visible: boolean
  onOpenSettings: () => void
  onDismiss: () => void
}

const PermissionModal = ({
  visible,
  onOpenSettings,
  onDismiss,
}: PermissionModalProps) => {
  const handleOpenSettings = async () => {
    onOpenSettings()
    await openUsagePermissionSettings()
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      {/* Dark overlay */}
      <View style={styles.overlay}>
        {/* Pressable overlay to dismiss */}
        <Pressable style={styles.overlayPress} onPress={onDismiss} />

        {/* Modal card */}
        <View style={styles.modal}>
          {/* Lock icon */}
          <View style={styles.iconContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={50}
              color={colors.darkMuted}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Enable Usage Access</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Grant permission to see your app usage stats and stay within your
            daily budget.
          </Text>

          {/* Buttons container */}
          <View style={styles.buttonsContainer}>
            {/* Open Settings button */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleOpenSettings}
            >
              <Text style={styles.primaryButtonText}>Open Settings</Text>
            </Pressable>

            {/* Maybe Later button */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onDismiss}
            >
              <Text style={styles.secondaryButtonText}>Maybe Later</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default PermissionModal

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
    backgroundColor: colors.surfaceLight,
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
    color: colors.dark,
    marginBottom: spacing.sm,
    textAlign: "center",
  },

  subtitle: {
    fontFamily: fonts.regular,
    fontSize: typography.body,
    color: colors.darkMuted,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 24,
  },

  buttonsContainer: {
    width: "100%",
    gap: spacing.sm,
  },

  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButton: {
    backgroundColor: colors.primary,
  },

  secondaryButton: {
    backgroundColor: colors.surfaceMuted,
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
    color: colors.darkMuted,
  },
})
