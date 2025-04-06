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

interface Candidate {
  _id: string
  fullName: string
}

interface DeleteCandidateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: Candidate
  onCandidateDeleted: (id: string) => void
}

export default function DeleteCandidateDialog({
  open,
  onOpenChange,
  candidate,
  onCandidateDeleted,
}: DeleteCandidateDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const response = await axios.delete(`http://localhost:3000/api/v1/user/recruiter/candidates/${candidate._id}`, {
        withCredentials: true,
      })

      if (response.data.success) {
        toast.success("Candidate deleted successfully")
        onCandidateDeleted(candidate._id)
      }
    } catch (error: any) {
      console.error("Error deleting candidate:", error)
      toast.error(error.response?.data?.message || "Failed to delete candidate")
      onOpenChange(false)
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
            This action cannot be undone. This will permanently delete the candidate
            {candidate && ` "${candidate.fullName}"`} and remove their data from our servers.
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

