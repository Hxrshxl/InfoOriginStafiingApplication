"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Job {
  _id: string
  title: string
  companyName: string
}

interface DeleteJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job: Job
  onJobDeleted: (id: string) => void
}

export default function DeleteJobDialog({ open, onOpenChange, job, onJobDeleted }: DeleteJobDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const response = await axios.delete(`http://localhost:3000/api/v1/job/recruiter/${job._id}`, {
        withCredentials: true,
      })

      if (response.data.success) {
        toast.success("Job deleted successfully")
        onJobDeleted(job._id)
        onOpenChange(false)
      }
    } catch (error: any) {
      console.error("Error deleting job:", error)
      toast.error(error.response?.data?.message || "Failed to delete job")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the job listing
            {job && ` "${job.title}" at "${job.companyName}"`} and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-500 hover:bg-red-600">
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

