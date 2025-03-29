"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import coding from "../../assets/coding.svg"
import interview from "../../assets/interview.svg"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useEffect } from "react"
import { clsx } from 'clsx';

const Page = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === "candidate" ? "/candidate-dashboard" : "/recruiter-dashboard"

      navigate(redirectPath)
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex w-full max-w-6xl flex-col md:flex-row">
        {/* Left Side - Candidate */}
        <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <h2 className="text-2xl font-bold">Looking for a Job?</h2>
            </CardHeader>
            <div className="flex flex-col items-center p-6">
              <img src={coding || "/placeholder.svg"} alt="Candidate Icon" className="w-64 h-64 mb-6" />
              <div className="space-y-4 w-full">
                <Button className="w-full" onClick={() => navigate("/login?role=candidate")}>
                  Login as Candidate
                </Button>
              </div>
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
              <div className="space-y-4 w-full">
                <Button className="w-full" onClick={() => navigate("/login?role=recruiter")}>
                  Login as Recruiter
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page

