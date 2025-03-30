"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { cn } from "../../lib/utils"
import type { UserRole } from "../../lib/types"

import coding from "../../assets/coding.svg"
import interview from "../../assets/interview.svg"

const AuthPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const roleParam = queryParams.get("role") as UserRole | null

  const { login, error, isLoading, clearError, isAuthenticated, user } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole | "">(roleParam || "")

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === "candidate" ? "/candidate-dashboard" : "/recruiter-dashboard"
      navigate(redirectPath)
    }
  }, [isAuthenticated, user, navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!role) return

    await login({ email, password, role })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex w-full max-w-6xl flex-col md:flex-row">
        {/* Role Selection - Show Only if Role is Not Chosen */}
        {!role ? (
          <>
            {/* Left Side - Candidate */}
            <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <h2 className="text-2xl font-bold">Looking for a Job?</h2>
                </CardHeader>
                <div className="flex flex-col items-center p-6">
                  <img src={coding || "/placeholder.svg"} alt="Candidate Icon" className="w-64 h-64 mb-6" />
                  <Button className="w-full" onClick={() => setRole("candidate")}>
                    Login as Candidate
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Side - Recruiter */}
            <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <h2 className="text-2xl font-bold">Hiring Talent?</h2>
                </CardHeader>
                <div className="flex flex-col items-center p-6">
                  <img src={interview || "/placeholder.svg"} alt="Recruiter Icon" className="w-64 h-64 mb-6" />
                  <Button className="w-full" onClick={() => setRole("recruiter")}>
                    Login as Recruiter
                  </Button>
                </div>
              </Card>
            </div>
          </>
        ) : (
          // Login Form - Shown if a Role is Selected
          <div className="w-full max-w-md p-4 mx-auto">
            <div className="shadow-lg rounded-lg bg-white p-6 dark:bg-gray-800">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Login as {role === "candidate" ? "Candidate" : "Recruiter"}
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Enter your credentials to access your account
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <LabelInputContainer>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </LabelInputContainer>

                <Button className="w-full" type="submit" disabled={isLoading || !role}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <div className="mt-4 text-center text-sm">
                  Don't have an account?{" "}
                  <Link
                    to={`/signup?role=${role}`}
                    className="font-medium text-primary hover:underline"
                    onClick={clearError}
                  >
                    Sign up
                  </Link>
                </div>

                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => setRole("")}>
                    Back to Role Selection
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
}

export default AuthPage

