"use client"

import type React from "react"
import { EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JobViewProps {
  jobId: string
  onView: (jobId: string) => void
}

const JobView: React.FC<JobViewProps> = ({ jobId, onView }) => {
  return (
    <Button
      onClick={() => onView(jobId)}
      variant="outline"
      size="icon"
      className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-full"
      title="View Job Details"
    >
      <EyeIcon className="h-4 w-4" />
    </Button>
  )
}

export default JobView

