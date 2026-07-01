import { Pressable } from 'react-native'
import React from 'react'
import Ionicons from '@react-native-vector-icons/ionicons'
import { colors } from '@/constants/colors'

const GoBackBtn = ({ onButtonPressed }: { onButtonPressed: () => void }) => {
  return (
    <Pressable onPress={onButtonPressed}>
      <Ionicons name="chevron-back" size={25} color={colors.dark} />
    </Pressable>
  )
}

export default GoBackBtn
