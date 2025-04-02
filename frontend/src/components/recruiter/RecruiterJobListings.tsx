"use client"

import { useState, useEffect } from "react"
import { MapPinIcon, BriefcaseIcon, BanknoteIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import RecuiterTabbar from "./RecuiterTabbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import JobView from "./actions/JobView"
import JobEdit from "./actions/JobEdit"
import JobDelete from "./actions/JobDelete"

interface Job {
  _id: string
  title: string
  description: string
  salary: number
  experienceLevel: string
  location: string
  jobType: string
  position: string
  company: {
    _id: string
    name: string
  }
}

interface Company {
  _id: string
  name: string
  description?: string
  website?: string
  location?: string
  logo?: string
}

function RecruiterJobListings() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  // Fetch jobs created by the recruiter
  const fetchJobs = async (page: number) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`http://localhost:3000/api/v1/job/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Jobs API response:", result) // Debug log

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch jobs")
      }

      setJobs(result.jobs || [])
      setTotalPages(Math.ceil((result.jobs?.length || 0) / 10) || 1)
      setCurrentPage(page)
    } catch (err: any) {
      console.error("Error fetching jobs:", err)
      setError(err.message || "Failed to fetch jobs")
      toast.error(err.message || "Failed to fetch jobs")
    } finally {
      setLoading(false)
    }
  }

  // Fetch all companies
  const fetchCompanies = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/company/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Companies API response:", result) // Debug log

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch companies")
      }

      setCompanies(result.companies || [])
    } catch (err: any) {
      console.error("Error fetching companies:", err)
      toast.error(err.message || "Failed to fetch companies")
    }
  }

  useEffect(() => {
    fetchJobs(currentPage)
    fetchCompanies()
  }, [currentPage])

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleView = (jobId: string) => {
    navigate(`/recruiter/job/${jobId}`)
  }

  const handleUpdate = (jobId: string) => {
    navigate(`/recruiter/job/edit/${jobId}`)
  }

  const refreshJobs = () => {
    fetchJobs(currentPage)
  }

  // Get company name by ID
  const getCompanyName = (companyId: string): string => {
    const company = companies.find((c) => c._id === companyId)
    return company ? company.name : "N/A"
  }

  return (
    <>
      <RecuiterTabbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Job Listings</h1>
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate("/recruiter/job/create")} className="bg-indigo-600 hover:bg-indigo-700">
                Create New Job
              </Button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}

          {error && (
            <Card className="mb-4 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="text-center py-12">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't created any job listings yet. Click "Create New Job" to get started.
              </p>
            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Position
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Company
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Experience
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Salary
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                            <div className="text-sm text-gray-500">{job.jobType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {job.company && job.company.name
                            ? job.company.name
                            : job.company
                              ? getCompanyName(typeof job.company === "string" ? job.company : job.company._id)
                              : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {job.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{job.experienceLevel} years</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <BanknoteIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />₹
                          {job.salary.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <JobView jobId={job._id} onView={handleView} />
                          <JobEdit jobId={job._id} onEdit={handleUpdate} />
                          <JobDelete jobId={job._id} onJobDeleted={refreshJobs} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default RecruiterJobListings

