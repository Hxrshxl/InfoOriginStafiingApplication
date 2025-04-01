"use client"

import type React from "react"
import { Edit2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JobEditProps {
  jobId: string
  onEdit: (jobId: string) => void
}

const JobEdit: React.FC<JobEditProps> = ({ jobId, onEdit }) => {
  return (
    <Button
      onClick={() => onEdit(jobId)}
      variant="outline"
      size="icon"
      className="h-8 w-8 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-full"
      title="Edit Job"
    >
      <Edit2Icon className="h-4 w-4" />
    </Button>
  )
}

export default JobEdit

