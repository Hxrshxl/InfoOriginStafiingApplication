"\"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
}

interface ViewJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job: Job
}

export default function ViewJobDialog({ open, onOpenChange, job }: ViewJobDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{job?.title}</DialogTitle>
          <DialogDescription>
            {job?.companyName} - {job?.location}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <h3 className="text-lg font-semibold">Description</h3>
            <p>{job?.description}</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <h3 className="text-lg font-semibold">Requirements</h3>
            <ul>
              {job?.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <h3 className="text-lg font-semibold">Salary</h3>
            <p>${job?.salary?.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <h3 className="text-lg font-semibold">Job Type</h3>
            <p>{job?.jobType}</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <h3 className="text-lg font-semibold">Experience Level</h3>
            <p>{job?.experienceLevel}+ years</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <h3 className="text-lg font-semibold">Positions Available</h3>
            <p>{job?.position}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

