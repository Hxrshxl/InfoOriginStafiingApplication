"use client"

import { useState } from "react"
import { useAuth } from "../auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Briefcase, FileText, Calendar, Bell, Settings, LogOut } from "lucide-react"

const CandidateDashboard = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Job Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Welcome, {user?.fullName}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="justify-start rounded-none h-12"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant={activeTab === "jobs" ? "default" : "ghost"}
                    className="justify-start rounded-none h-12"
                    onClick={() => setActiveTab("jobs")}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Jobs
                  </Button>
   
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Manage your personal information and skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-slate-500">Full Name</p>
                          <p>{user?.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Username</p>
                          <p>{user?.username}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <p>{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Phone</p>
                          <p>{user?.phoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">City</p>
                          <p>{user?.city}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium">Skills</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user?.skills.map((skill, index) => (
                          <div key={index} className="bg-slate-100 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "jobs" && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Jobs</CardTitle>
                  <CardDescription>Browse and apply for jobs that match your skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500">No jobs available at the moment.</p>
                </CardContent>
              </Card>
            )}   
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateDashboard

