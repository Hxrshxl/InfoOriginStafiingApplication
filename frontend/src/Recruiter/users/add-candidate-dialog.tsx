"use client"

import type React from "react"

import { useState } from "react"
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

interface AddCandidateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCandidateAdded: () => void
}

export default function AddCandidateDialog({ open, onOpenChange, onCandidateAdded }: AddCandidateDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    phoneNumber: "",
    password: "",
    city: "",
    skills: [] as string[],
  })
  const [skillInput, setSkillInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      !formData.password ||
      !formData.city ||
      formData.skills.length === 0
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)

      const response = await axios.post(
        "http://localhost:3000/api/v1/user/recruiter/candidates",
        {
          ...formData,
          phoneNumber: Number(formData.phoneNumber),
        },
        { withCredentials: true },
      )

      if (response.data.success) {
        toast.success("Candidate added successfully")
        onCandidateAdded()
        resetForm()
      }
    } catch (error: any) {
      console.error("Error adding candidate:", error)
      toast.error(error.response?.data?.message || "Failed to add candidate")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      username: "",
      phoneNumber: "",
      password: "",
      city: "",
      skills: [],
    })
    setSkillInput("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogDescription>
            Create a new candidate account. The candidate will be able to log in with these credentials.
          </DialogDescription>
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
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
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
              {isSubmitting ? "Adding..." : "Add Candidate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

