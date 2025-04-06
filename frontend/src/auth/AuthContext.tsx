"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
import { toast, Toaster } from "sonner"

// ========== Types ==========
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

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

// ========== Create Context ==========
const AuthContext = createContext<AuthContextType | undefined>(undefined)
const API_URL = "http://localhost:3000/api/v1/user"

// ========== Provider ==========
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already logged in (on page load)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/getprofile`, {
          withCredentials: true,
        })
        if (res.data.success) setUser(res.data.user)
      } catch {
        console.log("User not authenticated")
      } finally {
        setLoading(false)
      }
    }
    checkAuthStatus()
  }, [])

  // ========== Login ==========
  const login = async (username: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.post(`${API_URL}/login`, { username, password }, { withCredentials: true })
      if (res.data.success) {
        setUser(res.data.user)
        toast.success("Login successful", { description: res.data.message })
      } else {
        throw new Error(res.data.message || "Login failed")
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "An error occurred during login"
      setError(msg)
      toast.error("Login failed", { description: msg })
    } finally {
      setLoading(false)
    }
  }

  // ========== Register ==========
  const register = async (userData: RegisterData) => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.post(`${API_URL}/register`, userData, { withCredentials: true })
      if (res.data.success) {
        toast.success("Registration successful", { description: "Account created successfully." })
      } else {
        throw new Error(res.data.message || "Registration failed")
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "An error occurred during registration"
      setError(msg)
      toast.error("Registration failed", { description: msg })
    } finally {
      setLoading(false)
    }
  }

  // ========== Logout ==========
  const logout = async () => {
    try {
      setLoading(true)
      await axios.get(`${API_URL}/logout`, { withCredentials: true })
      setUser(null)
      toast.success("Logout successful", { description: "You have been logged out." })
    } catch (err: any) {
      const msg = err.response?.data?.message || "An error occurred during logout"
      setError(msg)
      toast.error("Logout failed", { description: msg })
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
      <Toaster />
    </AuthContext.Provider>
  )
}

// ========== Hook ==========
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

