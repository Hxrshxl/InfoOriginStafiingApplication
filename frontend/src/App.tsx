import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import Page from "./components/auth/Page"
import { Signup } from "./components/auth/Signup"


import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "./components/theme-provider"
import CandidateDashboard from "./components/candidate/CandidateDashboard"
import CandidateProfile from "./components/candidate/CandidateProfile"
import JobListings from "./components/candidate/JobListings"
import RecruiterDashboard from "./components/recruiter/RecruiterDashboard"
import { Login } from "./components/auth/Login"

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="job-portal-theme">
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Page />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login/>} />

          {/* Protected candidate routes */}
          <Route
            path="/candidate-dashboard"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate-profile"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <CandidateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate-requirements"
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
          <Route
            path="/addrequirements"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <JobListings />
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

