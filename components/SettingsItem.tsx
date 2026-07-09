import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons, { IoniconsIconName } from '@react-native-vector-icons/ionicons'
import { colors } from '@/constants/colors'
import { fonts } from '@/constants/fonts'
import { spacing } from '@/constants/spacing'
import { typography } from '@/constants/typography'

interface Props {
  icon?: IoniconsIconName
  onItemSelected: () => void
  label: string
  description?: string
}


const SettingsItem = ({icon = "settings-outline", onItemSelected, label, description}: Props) => {

  return (
    <Pressable onPress={onItemSelected} style={styles.item}>
      <View style={styles.row}>
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={15} color={colors.primary}  />
        </View>
        <View>
          <Text style={styles.label}>{label}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.darkMuted} />
    </Pressable>
  )
}

export default SettingsItem

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },

  row: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },

  iconWrapper: {
    width: 35,
    height: 35,
    backgroundColor: colors.primaryMuted,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  label: {
    color: colors.dark,
    fontFamily: fonts.medium,
    fontSize: typography.body,
  },

  description: {
    color: colors.darkMuted,
    fontFamily: fonts.regular,
    fontSize: typography.small,
  },

})