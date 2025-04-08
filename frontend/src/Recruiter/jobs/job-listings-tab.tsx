"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2, Plus, Users } from "lucide-react"
import { toast } from "sonner"
import AddJobDialog from "./add-job-dialog"
import ViewJobDialog from "./view-job-dialog"
import EditJobDialog from "./edit-job-dialog"
import DeleteJobDialog from "./delete-job-dialog"
import ViewApplicantsDialog from "./view-applicants-dialog"
import { Badge } from "@/components/ui/badge"

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
  applications: string[]
}

export default function JobListingsTab() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string>("")

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3000/api/v1/job", {
        withCredentials: true,
      })

      if (response.data.success) {
        setJobs(response.data.jobs)
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
      toast.error("Failed to fetch jobs")
    } finally {
      setLoading(false)
    }
  }

  const handleViewJob = (job: Job) => {
    setSelectedJob(job)
    setViewDialogOpen(true)
  }

  const handleEditJob = (job: Job) => {
    setSelectedJob(job)
    setEditDialogOpen(true)
  }

  const handleDeleteJob = (job: Job) => {
    setSelectedJob(job)
    setDeleteDialogOpen(true)
  }

  const handleViewApplicants = (jobId: string) => {
    setSelectedJobId(jobId)
    setApplicantsDialogOpen(true)
  }

  const handleJobAdded = () => {
    fetchJobs()
    setAddDialogOpen(false)
  }

  const handleJobUpdated = () => {
    fetchJobs()
    setEditDialogOpen(false)
  }

  const handleJobDeleted = (deletedId: string) => {
    setJobs(jobs.filter((j) => j._id !== deletedId))
    setDeleteDialogOpen(false)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Job Listings</h2>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No jobs found.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.companyName}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>${job.salary.toLocaleString()}</TableCell>
                    <TableCell>{job.jobType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {job.applications?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewApplicants(job._id)}
                          className="flex items-center gap-1"
                        >
                          <Users className="h-4 w-4 mr-1" />
                          View Applicants
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleViewJob(job)} title="View job">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEditJob(job)} title="Edit job">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteJob(job)}
                          className="text-red-500 hover:text-red-600"
                          title="Delete job"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Dialogs */}
      <AddJobDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onJobAdded={handleJobAdded} />

      {selectedJob && (
        <>
          <ViewJobDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} job={selectedJob} />

          <EditJobDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            job={selectedJob}
            onJobUpdated={handleJobUpdated}
          />

          <DeleteJobDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            job={selectedJob}
            onJobDeleted={handleJobDeleted}
          />
        </>
      )}

      {/* View Applicants Dialog */}
      <ViewApplicantsDialog open={applicantsDialogOpen} onOpenChange={setApplicantsDialogOpen} jobId={selectedJobId} />
    </Card>
  )
}
