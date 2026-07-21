import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import {
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const ValidationModal = ({
  visible = false,
  onClose,
  message,
  title,
}: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <Ionicons
          name="alert-circle-outline"
          color={colors.textDanger}
          size={20}
          style={styles.icon}
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{message}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.buttonClose} onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={18} color={colors.textDanger} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ValidationModal;

const styles = StyleSheet.create({
  modalView: {
    marginTop: StatusBar.currentHeight,
    backgroundColor: colors.errorSurface,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },

  icon: {
    marginTop: 2,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: typography.modalText,
    fontFamily: fonts.medium,
    color: colors.textDanger,
    marginBottom: 2,
  },

  text: {
    fontSize: typography.modalText - 1,
    fontFamily: fonts.regular,
    color: colors.textDanger,
    textAlign: "left",
    lineHeight: 18,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexShrink: 0,
  },

  retryText: {
    fontSize: typography.modalText - 1,
    fontFamily: fonts.medium,
    color: colors.textDanger,
  },

  buttonClose: {
    padding: 2,
  },
});
