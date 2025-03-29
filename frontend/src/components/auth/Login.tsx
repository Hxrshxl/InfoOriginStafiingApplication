"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { cn } from "../../lib/utils"
import { useAuth } from "../../context/AuthContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import type { UserRole } from "../../lib/types"

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const roleParam = queryParams.get("role") as UserRole | null

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole | "">("")

  const { login, error, isLoading, clearError, isAuthenticated, user } = useAuth()

  // Set role from URL parameter
  useEffect(() => {
    if (roleParam && (roleParam === "candidate" || roleParam === "recruiter")) {
      setRole(roleParam)
    }
  }, [roleParam])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === "candidate" ? "/candidate-dashboard" : "/recruiter-dashboard"

      navigate(redirectPath)
    }
  }, [isAuthenticated, user, navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!role) {
      return // Prevent submission if role is not selected
    }

    await login({
      email,
      password,
      role,
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-4">
        <div className="shadow-lg rounded-lg bg-white p-6 dark:bg-gray-800">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Login as {role === "candidate" ? "Candidate" : role === "recruiter" ? "Recruiter" : "User"}
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

            {!roleParam && (
              <LabelInputContainer>
                <Label htmlFor="role">Role</Label>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={role === "candidate" ? "default" : "outline"}
                    onClick={() => setRole("candidate")}
                    className="flex-1"
                  >
                    Candidate
                  </Button>
                  <Button
                    type="button"
                    variant={role === "recruiter" ? "default" : "outline"}
                    onClick={() => setRole("recruiter")}
                    className="flex-1"
                  >
                    Recruiter
                  </Button>
                </div>
              </LabelInputContainer>
            )}

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
                to={`/signup${role ? `?role=${role}` : ""}`}
                className="font-medium text-primary hover:underline"
                onClick={clearError}
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
}

