import { StyleSheet, Text } from 'react-native'
import Animated, { Easing, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { colors } from '@/constants/colors'
import Ionicons from "@react-native-vector-icons/ionicons"
import { typography } from '@/constants/typography'
import { spacing } from '@/constants/spacing'
import { OnboardingItem } from '@/app/(onboarding)/Onboarding'
import { fonts } from '@/constants/fonts'

interface Props {
  index: number
  currentItem: SharedValue<number>
  content: OnboardingItem,
}

const OnboardingIllustration = (props: Props) => {
  const {currentItem, index, content} = props
  const display = useSharedValue<"flex" | "none">(index === 0 ? "flex" : "none")

  const animStyle = useAnimatedStyle(() => {
    const isActive = currentItem.value === index

    if (isActive) {
      display.value = "flex"
    }

    return {
      opacity: withTiming(isActive ? 1 : 0, { duration: 800, easing: Easing.inOut(Easing.quad) }, (finished) => {
        if (finished && !isActive) {
          display.value = "none"
        }
      }),
      transform: [{ translateY: withTiming(isActive ? 0 : -40, { duration: 1000, easing: Easing.inOut(Easing.quad) }) }],
      backgroundColor: withTiming(isActive ? content.color : colors.surfaceMuted, { duration: 500 }),
      display: display.value,
    }
  })

  return (
    <Animated.View style={[styles.illustration, animStyle]}>
      <Ionicons name={content.icon} size={80} color={content.iconColor}/>
      <Text style={styles.text}>{content.title}</Text>
    </Animated.View>
  )
}

export default OnboardingIllustration

const styles = StyleSheet.create({
  illustration: {
    height: "100%",
    width: "100%",
    borderRadius: 15,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.md
  },

  text: {
    fontSize: typography.heading,
    textAlign: "center",
    color: colors.surface,
    fontFamily: fonts.bold,
  }
})