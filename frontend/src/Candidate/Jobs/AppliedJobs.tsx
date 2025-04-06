"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, Calendar } from "lucide-react"
import { toast } from "sonner"

// Job type definition based on the model
interface Job {
  _id: string
  title: string
  description: string
  requirements: string[]
  salary: number
  location: string
  jobType: string
  experienceLevel: number
  position: number
  companyName: string
  createdAt: string
}

// Application type definition
interface Application {
  _id: string
  job: Job
  status: string
  createdAt: string
}

const AppliedJobs = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch applied jobs
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:3000/api/v1/application/get", {
          withCredentials: true,
        })

        if (response.data.success) {
          setApplications(response.data.applications)
        } else {
          toast.error("Failed to fetch applications")
        }
      } catch (error) {
        console.error("Error fetching applications:", error)
        toast.error("Error fetching applications")
      } finally {
        setLoading(false)
      }
    }

    fetchAppliedJobs()
  }, [])

  // Format salary for display
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary)
  }

  // Get experience level text
  const getExperienceLevel = (level: number) => {
    switch (level) {
      case 0:
        return "Entry Level"
      case 1:
        return "Junior"
      case 2:
        return "Mid-Level"
      case 3:
        return "Senior"
      case 4:
        return "Lead"
      default:
        return "Not Specified"
    }
  }

  // Get application status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "reviewing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Reviewing
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Applications</h2>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{application.job.title}</h3>
                      {getStatusBadge(application.status)}
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {application.job.companyName}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {application.job.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">{application.job.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{getExperienceLevel(application.job.experienceLevel)}</Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {formatSalary(application.job.salary)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-4 md:mt-0">
                    <Button variant="outline">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">You haven't applied to any jobs yet.</div>
      )}
    </div>
  )
}

export default AppliedJobs

