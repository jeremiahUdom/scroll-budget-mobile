import { StyleSheet, Text, TextInput, View, TextInputProps, Pressable } from 'react-native'
import React, { useState } from 'react'
import { colors } from '@/constants/colors'
import { fonts } from '@/constants/fonts'
import { typography } from '@/constants/typography'
import { spacing } from '@/constants/spacing'
import Ionicons from '@react-native-vector-icons/ionicons'

interface Props extends TextInputProps {
  label?: string
  value: string
  onChangeText: (text: string) => void
  secureTextEntry?: boolean
  showPassword?: boolean
}

const AppInput = ({
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  ...props
}: Props) => {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev)
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />

        {secureTextEntry && (
          <Pressable onPress={togglePasswordVisibility}>
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color={colors.darkMuted}
            />
          </Pressable>
        )}
      </View>
    </View>
  )
}
export default AppInput

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 60,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
  },

  input: {
    flex: 1,
    fontSize: typography.body,
    fontFamily: fonts.regular,
    color: colors.dark,
  },

  label: {
    fontFamily: fonts.medium,
    fontSize: typography.body,
    marginBottom: spacing.xs,
  }
})