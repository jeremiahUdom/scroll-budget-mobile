import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { spacing } from '@/constants/spacing'
import { colors } from '@/constants/colors'
import Ionicons from '@react-native-vector-icons/ionicons'
import { typography } from '@/constants/typography'
import { fonts } from '@/constants/fonts'
import { Link, useRouter } from 'expo-router'
import AppButton from '@/components/AppButton'
import AppInput from '@/components/AppInput'
import * as z from "zod"
import { useAuth } from '@/context/AuthContext'
import ErrorModal from '@/components/ErrorModal'
import { useUserPreference } from '@/context/UserPreferenceContext'

const dataSchema = z.object({
  email: z.email(),
  password: z.string()
    .min(8, "Password must be atleast 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
      "Password must contain an uppercase letter, lowercase letter, number, and special character"
    )
})

const Login = () => {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [inputValidationErrors, setInputValidationErrors] = useState({
    email: "",
    password: "",
  })
  const [loginError, setLoginError] = useState("")
  const [showError, setShowError] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      // validate email and password
      const validation = dataSchema.safeParse({ email, password })

      // handle validation errors
      if (!validation.success) {
        const errors = {
          email: "",
          password: "",
        };

        validation.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof typeof errors;

          // Only keep the first error for each field
          if (!errors[field]) {
            errors[field] = issue.message;
          }
        });

        setInputValidationErrors(errors);
        return;
      }

      setInputValidationErrors({
        email: "",
        password: "",
      });

      // login user
      await login({email: validation.data.email, password: validation.data.password})

      router.replace("/(tabs)")

      return;
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message)
        setShowError(true)
        return
      }

      setLoginError("An error occured while creating your account. Please try again")
      setShowError(true)
      return
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.view}>
        <View style={styles.view}>
          <View style={styles.logo}>
            <Ionicons name="time-outline" size={50} color={colors.surface} />
          </View>

          <View style={styles.view}>
            <Text style={styles.title}>Scroll Budget</Text>
            <Text style={styles.body}>Time well spent starts with knowing where it goes.</Text>
          </View>
        </View>

        <View style={styles.view}>
          <View>
            <AppInput 
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.darkMuted}
              label="Email"
            />
            {inputValidationErrors.email !== "" && <Text style={styles.error}>{inputValidationErrors.email}</Text>}
          </View>

          <View>
            <AppInput 
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.darkMuted}
              label="Password"
              secureTextEntry
            />
            {inputValidationErrors.password !== "" && <Text style={styles.error}>{inputValidationErrors.password}</Text>}
          </View>
        </View>
      </View>

      <View style={styles.view}>
        <View style={styles.view}>
          <AppButton isLoading={loading} onButtonPressed={handleLogin}>Login</AppButton>
        </View>

        <Text style={styles.body}>Don&apos;t have an account? <Link style={styles.link} href={"/(auth)"}>Create Account</Link></Text>
      </View>

      <ErrorModal
        modalVisible={showError}
        onCloseModal={() => setShowError(false)}
        error={loginError}
      />
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    justifyContent: "space-between",
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: typography.heading,
    fontFamily: fonts.bold,
    textAlign: "center",
    color: colors.dark,
  },

  body: {
    fontSize: typography.body,
    fontFamily: fonts.regular,
    textAlign: "center",
    color: colors.darkMuted,
    lineHeight: 24,
  },

  view: {
    gap: spacing.sm
  },

  authBtn: {
    width: "100%",
    height: 60,
    backgroundColor: colors.surface,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
  },

  authText: {
    fontSize: typography.body,
    fontFamily: fonts.medium,
    textAlign: "center",
    color: colors.dark,
  },

  link:{
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    color: colors.primary,
  },

  agreement: {
    fontSize: typography.caption,
    fontFamily: fonts.regular,
    textAlign: "center",
    color: colors.darkMuted,
    lineHeight: 24,
  },

  forgotPassword: {
    alignSelf: "flex-end",
  },

  error: {
    fontSize: typography.caption,
    fontFamily: fonts.regular,
    color: colors.danger,
    lineHeight: 24,  
  },
})