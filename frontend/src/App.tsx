"use client"

import { Routes, Route, Navigate } from "react-router-dom"
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
        <Route path="/register" element={<Register />} />

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

export default App

