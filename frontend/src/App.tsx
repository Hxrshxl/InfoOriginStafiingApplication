import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import { Signup } from "./components/auth/Signup"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "./components/theme-provider"
import JobListings from "./components/candidate/JobListings"
import RecruiterDashboard from "./components/recruiter/RecruiterDashboard"
import { Login } from "./components/auth/Login"
import AuthPage from "./components/auth/AuthPage"
import CandidateDashboard from "./components/candidate/CandidateDasboard"

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="job-portal-theme">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/" element={<AuthPage />} />

            {/* Protected candidate routes */}
            <Route
              path="/candidate-dashboard"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/candidate-profile"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <CandidateProfile />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/job-listings"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <JobListings />
                </ProtectedRoute>
              }
            />

            {/* Protected recruiter routes */}
            <Route
              path="/recruiter-dashboard"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App

