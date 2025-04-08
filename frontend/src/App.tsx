// 

"use client"

import { useEffect } from "react"

import { Routes, Route, Navigate, useSearchParams, useNavigate } from "react-router-dom"
import { useAuth } from "./auth/AuthContext"
import Login from "./auth/Login"
import Register from "./auth/Register"
import CandidateDashboard from "./Candidate/CandidateDashboard"
import RecruiterDashboard from "./Recruiter/RecruiterDashboard"
import LandingPage from "./auth/LandingPage"
import "./App.css"

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterGuard />} />

        {/* Protected Routes */}
        <Route
          path="/candidate/dashboard"
          element={user && user.role === "candidate" ? <CandidateDashboard /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/recruiter/dashboard"
          element={user && user.role === "recruiter" ? <RecruiterDashboard /> : <Navigate to="/login" replace />}
        />

        {/* Redirect to appropriate dashboard if logged in */}
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === "candidate" ? (
                <Navigate to="/candidate/dashboard" replace />
              ) : (
                <Navigate to="/recruiter/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

// Guard component to prevent recruiter registration
function RegisterGuard() {
  const [searchParams] = useSearchParams()
  const role = searchParams.get("role")
  const navigate = useNavigate()

  useEffect(() => {
    // If role is recruiter, redirect to login
    if (role === "recruiter") {
      navigate("/login?role=recruiter", { replace: true })
    }
  }, [role, navigate])

  // Only render Register component if role is not recruiter
  return role === "recruiter" ? null : <Register />
}

export default App
