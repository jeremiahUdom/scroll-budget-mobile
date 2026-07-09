import { Image, StyleSheet, Switch, Text, View } from 'react-native'
import React from 'react'
import { spacing } from '@/constants/spacing'
import { colors } from '@/constants/colors'
import { fonts } from '@/constants/fonts'
import { typography } from '@/constants/typography'

interface Props {
  onToggle: () => void
  enabled?: boolean
}

const NotificationToggle = ({onToggle, enabled=false}: Props) => {
  const toggleSwitch = () => {
    onToggle()
  }

  return (
    <View style={styles.item}>
      <Text style={styles.text}>Notifications</Text>
      <Switch
        trackColor={{ false: colors.surfaceMuted, true: colors.primary }}
        thumbColor={ enabled ? colors.primaryMuted : colors.darkMuted }
        onValueChange={toggleSwitch}
        value={enabled}
      />
    </View>
  )
}

export default NotificationToggle

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },

  text: {
    fontFamily: fonts.medium,
    fontSize: typography.body,
    color: colors.dark,
  },
})