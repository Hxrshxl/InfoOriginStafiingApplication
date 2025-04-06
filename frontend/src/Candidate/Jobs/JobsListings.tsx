"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, Clock } from "lucide-react"
import { useAuth } from "../../auth/AuthContext"
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

const JobsListings = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Add a new state to track applied job IDs
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])

  // Fetch available jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        // Fetch available jobs
        const jobsResponse = await axios.get("http://localhost:3000/api/v1/job", {
          withCredentials: true,
        })

        if (jobsResponse.data.success) {
          setJobs(jobsResponse.data.jobs)
        } else {
          toast.error("Failed to fetch jobs")
        }

        // Fetch applied jobs to know which ones are already applied
        const appliedResponse = await axios.get("http://localhost:3000/api/v1/application/get", {
          withCredentials: true,
        })

        if (appliedResponse.data.success && appliedResponse.data.applications) {
          // Extract job IDs from applications
          const appliedJobIds = appliedResponse.data.applications.map((app: any) => app.job._id)
          setAppliedJobs(appliedJobIds)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Error fetching data")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Apply for a job
  const handleApply = async (jobId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/application/apply/${jobId}`,
        {},
        { withCredentials: true },
      )

      if (response.data.success) {
        toast.success("Application submitted successfully")
        // Add this job to the applied jobs list
        setAppliedJobs((prev) => [...prev, jobId])
      } else {
        toast.error(response.data.message || "Failed to apply for job")
      }
    } catch (error: any) {
      console.error("Error applying for job:", error)
      toast.error(error.response?.data?.message || "Error applying for job")
    }
  }

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

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Available Jobs</h2>

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {job.companyName}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.jobType}
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{getExperienceLevel(job.experienceLevel)}</Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {formatSalary(job.salary)}
                      </Badge>
                    </div>

                    {job.requirements && job.requirements.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Requirements:</p>
                        <ul className="list-disc list-inside text-sm text-slate-700 ml-2">
                          {job.requirements.slice(0, 3).map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                          {job.requirements.length > 3 && <li>...</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 mt-4 md:mt-0">
                    <Button
                      onClick={() => handleApply(job._id)}
                      disabled={appliedJobs.includes(job._id)}
                      variant={appliedJobs.includes(job._id) ? "secondary" : "default"}
                    >
                      {appliedJobs.includes(job._id) ? "Applied" : "Apply Now"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">No jobs available at the moment.</div>
      )}
    </div>
  )
}

export default JobsListings

