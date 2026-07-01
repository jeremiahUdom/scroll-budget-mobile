import React, { createContext, useState, useEffect, useContext } from 'react'
import { createUserWithEmailAndPassword, FirebaseAuthTypes, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "@react-native-firebase/auth"
import { UserProfile } from '@/types/UserProfile'
import { createProfile, fetchProfile } from '@/app/api/user.api'
import { setScrollBudget } from '@/utils/userPreference'

type AuthContextType = {
  firebaseUser: FirebaseAuthTypes.User | null
  userProfile: UserProfile | null
  isInitialising: boolean
  signup: ({email, password}: {email: string, password: string}) => Promise<{success: boolean, message: string}>
  login: ({email, password}: {email: string, password: string}) => Promise<{success: boolean}>
  signout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type Props = {
  children: React.ReactNode
}

// Use this hook to access the user info.
export const useAuth = () => {
  const value = useContext(AuthContext)

  if (!value) {
    throw new Error("useAuth must be wrapped in an <AuthProvider />")
  }

  return value
}

export const AuthProvider = ({ children }: Props) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthTypes.User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isInitialising, setIsInitialising] = useState(true)

  const signup = async ({ email, password }: any) => {
    try {
      // create a new user on firebase
      const userCredential = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password
      )

      // get user auth token
      await getAuth().currentUser?.getIdToken(true)
      let profile: UserProfile | null = null

      try {
        // create a profile for the new user in the db
        profile = await createProfile()

        // store user profile in the context
        setUserProfile(profile)
      } catch (error) {
        console.log("Profile creation failed:", error);

        // rollback firebase user creation if user profile creation fails
        try {
          await userCredential.user.delete();
        } catch (deleteError) {
          console.log("Failed to rollback Firebase user:", deleteError);
        }

        throw new Error("Account creation failed. Please try again.");
      }
      
      // send a verification link to the newly created user
      await userCredential.user.sendEmailVerification()

      return {
        success: true,
        message: `An email verification link has been sent to ${email}. Please click the link to verify your email`,
      }
    } catch (error) {
      const err = error as { code?: string }

      if (err.code === "auth/email-already-in-use") {
        throw new Error("The email address is already in use by another account")
      }

      throw new Error("Unable to create account. Please try again.")
    }
  }

  const login = async ({email, password}: {email: string, password: string}) => {
    try {
      // sign in the user with their email and password
      await signInWithEmailAndPassword(getAuth(), email, password)

      // get the users access token
      await getAuth().currentUser?.getIdToken(true)

      return {
        success: true
      }
    } catch (error) {
      const err = error as { code?: string }

      if (err.code === "auth/invalid-credential") {
        throw new Error("Incorrect email or password")
      }

      throw new Error("Unable to login. Please try again.")
    }
  }

  const signout = async () => {
    try {
      await signOut(getAuth())

      return
    } catch (error) {
      console.log(error)
      throw new Error("Unable to signout user. Please try again.")
    }
  }

  useEffect(() => {
    const handleAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
      setFirebaseUser(user)

      if (!user) {
        setFirebaseUser(null)
        setUserProfile(null)
        setIsInitialising(false)
        return
      }

      try {
        const userProfile = await fetchProfile()
        await setScrollBudget(userProfile.scrollBudgetInMs)
        setUserProfile(userProfile)
      } catch (error) {
        console.error(error)
      } finally {
        setIsInitialising(false)
      }
    }

    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged)
    return subscriber // unsubscribe on unmount
  }, [])

  return (
    <AuthContext.Provider
      value={{ firebaseUser, isInitialising, userProfile, signup, login, signout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
