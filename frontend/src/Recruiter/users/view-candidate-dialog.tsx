"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Candidate {
  _id: string
  fullName: string
  email: string
  username: string
  phoneNumber: number
  city: string
  skills: string[]
  role: "candidate"
}

interface ViewCandidateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: Candidate
}

export default function ViewCandidateDialog({ open, onOpenChange, candidate }: ViewCandidateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Candidate Details</DialogTitle>
          <DialogDescription>View detailed information about this candidate.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <Label className="text-sm font-medium">Full Name</Label>
              <div className="mt-1 p-2 bg-slate-50 rounded-md">{candidate.fullName}</div>
            </div>

            <div className="col-span-4">
              <Label className="text-sm font-medium">Email</Label>
              <div className="mt-1 p-2 bg-slate-50 rounded-md">{candidate.email}</div>
            </div>

            <div className="col-span-4">
              <Label className="text-sm font-medium">Username</Label>
              <div className="mt-1 p-2 bg-slate-50 rounded-md">{candidate.username}</div>
            </div>

            <div className="col-span-2">
              <Label className="text-sm font-medium">Phone Number</Label>
              <div className="mt-1 p-2 bg-slate-50 rounded-md">{candidate.phoneNumber}</div>
            </div>

            <div className="col-span-2">
              <Label className="text-sm font-medium">City</Label>
              <div className="mt-1 p-2 bg-slate-50 rounded-md">{candidate.city}</div>
            </div>

            <div className="col-span-4">
              <Label className="text-sm font-medium">Skills</Label>
              <div className="mt-1 p-2 bg-slate-50 rounded-md min-h-[60px]">
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span key={index} className="bg-slate-200 px-2 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

