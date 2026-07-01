import { Modal, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { spacing } from '@/constants/spacing'
import { colors } from '@/constants/colors'
import Ionicons from '@react-native-vector-icons/ionicons'
import { typography } from '@/constants/typography'
import { fonts } from '@/constants/fonts'

interface Props {
  modalVisible: boolean
  onCloseModal: () => void
  message: string
}

const MessageModal = ({modalVisible = false, onCloseModal, message}: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onCloseModal}
    >
      <View style={styles.modalView}>
        <Pressable style={styles.buttonClose} onPress={onCloseModal}>
          <Ionicons name="close" size={30} color={colors.danger} />
        </Pressable>

        <Text style={styles.text}>{message}</Text>
      </View>
    </Modal>
  )
}

export default MessageModal

const styles = StyleSheet.create({
  modalView: {
    margin: spacing.lg,
    marginTop: StatusBar.currentHeight,
    backgroundColor: colors.surface,
    borderRadius: 15,
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: spacing.md
  },

  buttonClose: {
    alignSelf: "flex-end",
    marginBottom: spacing.md,
  },

  text: {
    fontSize: typography.modalText,
    fontFamily: fonts.regular,
    color: colors.dark,
    textAlign: "left",
    lineHeight: 22,
  }
})