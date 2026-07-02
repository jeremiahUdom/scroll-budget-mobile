import handleError from "@/utils/handleErrors"
import { getAuth } from "@react-native-firebase/auth"
import { create } from "axios"

// Base URL for the API
// const BASE_URL = process.env.EXPO_PUBLIC_SERVER_API_URL
const BASE_URL = `http://10.201.130.117:3000/v1`

// axios instance for public API requests
export const publicApi = create({
  baseURL: BASE_URL,
})

// axios instance for authenticated API requests
export const authApi = create({
  baseURL: BASE_URL,
})

// Add an interceptor to attach the Firebase ID token to the Authorization header for authenticated requests
authApi.interceptors.request.use(async (config) => {
  const auth = getAuth()
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add an interceptor to handle errors for both public and authenticated API requests
authApi.interceptors.response.use((res) => res, handleError)
publicApi.interceptors.response.use((res) => res, handleError)