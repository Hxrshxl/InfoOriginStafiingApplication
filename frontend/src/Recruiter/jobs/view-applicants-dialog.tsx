"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { UserRound, Calendar } from "lucide-react"

interface Applicant {
  _id: string
  name: string
  email: string
}

interface Application {
  _id: string
  applicant: Applicant
  status: "pending" | "accepted" | "rejected"
  createdAt: string
}

interface Job {
  _id: string
  title: string
  companyName: string
  applications: Application[]
}

interface ViewApplicantsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobId: string
}

export default function ViewApplicantsDialog({ open, onOpenChange, jobId }: ViewApplicantsDialogProps) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    if (open && jobId) {
      fetchApplicants()
    }
  }, [open, jobId])

  const fetchApplicants = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:3000/api/v1/application/${jobId}/applicants`, {
        withCredentials: true,
      })

      if (response.data.success) {
        setJob(response.data.job)
      }
    } catch (error) {
      console.error("Error fetching applicants:", error)
      toast.error("Failed to fetch applicants")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (applicationId: string, status: string) => {
    try {
      setUpdatingStatus(applicationId)
      const response = await axios.post(
        `http://localhost:3000/api/v1/application/status/${applicationId}/update`,
        { status },
        { withCredentials: true },
      )

      if (response.data.success) {
        toast.success("Application status updated")
        // Update local state to reflect the change
        if (job) {
          const updatedApplications = job.applications.map((app) =>
            app._id === applicationId ? { ...app, status } : app,
          )
          setJob({ ...job, applications: updatedApplications })
        }
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update application status")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job ? `Applicants for ${job.title} at ${job.companyName}` : "Applicants"}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : !job || job.applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No applicants found for this job.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {job.applications.map((application) => (
                  <TableRow key={application._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <UserRound className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">{application.applicant.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{application.applicant.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {formatDate(application.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={application.status}
                        onValueChange={(value) => handleStatusChange(application._id, value)}
                        disabled={updatingStatus === application._id}
                      >
                        <SelectTrigger className="w-[130px] ml-auto">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="accepted">Accept</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
