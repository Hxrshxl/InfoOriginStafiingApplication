"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface EditJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job: Job
  onJobUpdated: () => void
}

export default function EditJobDialog({ open, onOpenChange, job, onJobUpdated }: EditJobDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: [] as string[],
    salary: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    position: "",
    companyName: "",
  })
  const [requirementInput, setRequirementInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        requirements: [...job.requirements],
        salary: job.salary.toString(),
        location: job.location,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel.toString(),
        position: job.position.toString(),
        companyName: job.companyName,
      })
    }
  }, [job])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddRequirement = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && requirementInput.trim()) {
      e.preventDefault()
      const newRequirement = requirementInput.trim()
      if (!formData.requirements.includes(newRequirement)) {
        setFormData((prev) => ({
          ...prev,
          requirements: [...prev.requirements, newRequirement],
        }))
      }
      setRequirementInput("")
    }
  }

  const removeRequirement = (requirementToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((req) => req !== requirementToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.title ||
      !formData.description ||
      !formData.salary ||
      !formData.location ||
      !formData.companyName ||
      formData.requirements.length === 0
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)

      const response = await axios.put(
        `http://localhost:3000/api/v1/job/recruiter/${job._id}`,
        {
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          salary: Number(formData.salary),
          location: formData.location,
          jobType: formData.jobType,
          experienceLevel: Number(formData.experienceLevel),
          position: Number(formData.position),
          companyName: formData.companyName,
        },
        { withCredentials: true },
      )

      if (response.data.success) {
        toast.success("Job updated successfully")
        onJobUpdated()
        onOpenChange(false)
      }
    } catch (error: any) {
      console.error("Error updating job:", error)
      toast.error(error.response?.data?.message || "Failed to update job")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
          <DialogDescription>Make changes to the job listing.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Job Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="companyName" className="text-right">
                Company Name
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3 min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requirements" className="text-right">
                Requirements
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="requirements"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyDown={handleAddRequirement}
                  placeholder="Type a requirement and press Enter"
                />

                {formData.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="bg-slate-100 px-2 py-1 rounded-md flex items-center">
                        <span className="text-sm">{req}</span>
                        <button
                          type="button"
                          className="ml-1 text-slate-500 hover:text-slate-700"
                          onClick={() => removeRequirement(req)}
                          aria-label={`Remove ${req}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary" className="text-right">
                Salary
              </Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobType" className="text-right">
                Job Type
              </Label>
              <Select value={formData.jobType} onValueChange={(value) => handleSelectChange("jobType", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="experienceLevel" className="text-right">
                Experience (Years)
              </Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) => handleSelectChange("experienceLevel", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Entry Level (0 years)</SelectItem>
                  <SelectItem value="1">Junior (1+ years)</SelectItem>
                  <SelectItem value="3">Mid-Level (3+ years)</SelectItem>
                  <SelectItem value="5">Senior (5+ years)</SelectItem>
                  <SelectItem value="8">Expert (8+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Positions Available
              </Label>
              <Select value={formData.position} onValueChange={(value) => handleSelectChange("position", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select number of positions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

