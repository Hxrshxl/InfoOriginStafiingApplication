"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
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

interface EditCandidateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: Candidate
  onCandidateUpdated: () => void
}

export default function EditCandidateDialog({
  open,
  onOpenChange,
  candidate,
  onCandidateUpdated,
}: EditCandidateDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    phoneNumber: "",
    city: "",
    skills: [] as string[],
  })
  const [skillInput, setSkillInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (candidate) {
      setFormData({
        fullName: candidate.fullName,
        email: candidate.email,
        username: candidate.username,
        phoneNumber: candidate.phoneNumber.toString(),
        city: candidate.city,
        skills: [...candidate.skills],
      })
    }
  }, [candidate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault()
      const newSkill = skillInput.trim()
      if (!formData.skills.includes(newSkill)) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }))
      }
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.username ||
      !formData.phoneNumber ||
      !formData.city ||
      formData.skills.length === 0
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)

      const response = await axios.put(
        `http://localhost:3000/api/v1/user/recruiter/candidates/${candidate._id}`,
        {
          ...formData,
          phoneNumber: Number(formData.phoneNumber),
        },
        { withCredentials: true },
      )

      if (response.data.success) {
        toast.success("Candidate updated successfully")
        onCandidateUpdated()
      }
    } catch (error: any) {
      console.error("Error updating candidate:", error)
      toast.error(error.response?.data?.message || "Failed to update candidate")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Candidate</DialogTitle>
          <DialogDescription>Make changes to the candidate's information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">
                Skills
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Type a skill and press Enter"
                />

                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="bg-slate-100 px-2 py-1 rounded-md flex items-center">
                        <span className="text-sm">{skill}</span>
                        <button
                          type="button"
                          className="ml-1 text-slate-500 hover:text-slate-700"
                          onClick={() => removeSkill(skill)}
                          aria-label={`Remove ${skill}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

