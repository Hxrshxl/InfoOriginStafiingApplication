"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { User, AuthState, LoginCredentials, RegisterCredentials } from "../lib/types"
import { loginUser, logoutUser, registerUser, getCurrentUser } from "../lib/api"
import { useNavigate } from "react-router-dom"

// Define action types
type AuthAction =
  | { type: "LOGIN_REQUEST" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "REGISTER_REQUEST" }
  | { type: "REGISTER_SUCCESS" }
  | { type: "REGISTER_FAILURE"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "UPDATE_USER"; payload: User }

// Define context type
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  setUserData: (user: User) => void
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_REQUEST":
    case "REGISTER_REQUEST":
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      }
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      }
    case "REGISTER_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      }
    default:
      return state
  }
}

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const navigate = useNavigate()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          dispatch({ type: "LOGIN_SUCCESS", payload: user })
        } else {
          dispatch({ type: "LOGOUT" })
        }
      } catch (error) {
        dispatch({ type: "LOGOUT" })
      } finally {
        // Set loading to false regardless of outcome
        dispatch({ type: "LOGIN_FAILURE", payload: "" })
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "LOGIN_REQUEST" })
    try {
      const response = await loginUser(credentials)
      if (response.success && response.user) {
        dispatch({ type: "LOGIN_SUCCESS", payload: response.user })

        // Redirect based on role
        if (response.user.role === "candidate") {
          navigate("/candidate-dashboard")
        } else {
          navigate("/recruiter-dashboard")
        }
      } else {
        dispatch({ type: "LOGIN_FAILURE", payload: response.message })
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error instanceof Error ? error.message : "Login failed",
      })
    }
  }

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: "REGISTER_REQUEST" })
    try {
      const response = await registerUser(credentials)
      if (response.success) {
        dispatch({ type: "REGISTER_SUCCESS" })
        navigate(`/login?role=${credentials.role}`)
      } else {
        dispatch({ type: "REGISTER_FAILURE", payload: response.message })
      }
    } catch (error) {
      dispatch({
        type: "REGISTER_FAILURE",
        payload: error instanceof Error ? error.message : "Registration failed",
      })
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await logoutUser()
      dispatch({ type: "LOGOUT" })
      navigate("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  // Update user data function
  const setUserData = (user: User) => {
    dispatch({ type: "UPDATE_USER", payload: user })
  }

  // Context value
  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    setUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

