"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
import { toast, Toaster } from "sonner"

// Define types
interface User {
  _id: string
  fullName: string
  email: string
  username: string
  phoneNumber: number
  city: string
  skills: string[]
  role: "candidate" | "recruiter"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

interface RegisterData {
  fullName: string
  email: string
  username: string
  phoneNumber: number
  password: string
  city: string
  skills: string[]
  role: "candidate" | "recruiter"
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// API base URL
const API_URL = "http://localhost:3000/api/v1/user"

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/getprofile`, {
          withCredentials: true,
        })

        if (response.data.success) {
          setUser(response.data.user)
        }
      } catch (err) {
        // User is not logged in, that's okay
        console.log("User not authenticated")
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post(`${API_URL}/login`, { username, password }, { withCredentials: true })

      if (response.data.success) {
        setUser(response.data.user)
        toast.success("Login successful", {
          description: response.data.message,
        })
      } else {
        setError(response.data.message || "Login failed")
        toast.error("Login failed", {
          description: response.data.message || "An error occurred during login",
        })
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An error occurred during login"
      setError(errorMessage)
      toast.error("Login failed", {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post(`${API_URL}/register`, userData, { withCredentials: true })

      if (response.data.success) {
        toast.success("Registration successful", {
          description: "Your account has been created successfully.",
        })
      } else {
        setError(response.data.message || "Registration failed")
        toast.error("Registration failed", {
          description: response.data.message || "An error occurred during registration",
        })
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An error occurred during registration"
      setError(errorMessage)
      toast.error("Registration failed", {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      setLoading(true)

      await axios.get(`${API_URL}/logout`, {
        withCredentials: true,
      })

      setUser(null)
      toast.success("Logout successful", {
        description: "You have been logged out successfully.",
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An error occurred during logout"
      setError(errorMessage)
      toast.error("Logout failed", {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  // Clear error
  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
      <Toaster />
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

