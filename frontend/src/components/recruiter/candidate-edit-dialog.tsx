"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "../../lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CandidateEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: User
  onSave: (updatedData: any) => void
}

export function CandidateEditDialog({ open, onOpenChange, candidate, onSave }: CandidateEditDialogProps) {
  const [formData, setFormData] = useState({
    fullName: candidate.fullName || "",
    email: candidate.email || "",
    phoneNumber: candidate.phoneNumber || "",
    profile: {
      bio: candidate.profile?.bio || "",
      date_of_birth: candidate.profile?.date_of_birth || "",
      address: candidate.profile?.address || "",
      city: candidate.profile?.city || "",
      state: candidate.profile?.state || "",
      country: candidate.profile?.country || "",

      education: {
        degree: candidate.profile?.education?.degree || "",
        institution: candidate.profile?.education?.institution || "",
        year_of_passing: candidate.profile?.education?.year_of_passing || "",
      },

      experience: {
        company_name: candidate.profile?.experience?.company_name || "",
        position: candidate.profile?.experience?.position || "",
        duration: candidate.profile?.experience?.duration || "",
        description: candidate.profile?.experience?.description || "",
      },

      technical_skills: candidate.profile?.technical_skills?.join(", ") || "",
      soft_skills: candidate.profile?.soft_skills?.join(", ") || "",
      languages_known: candidate.profile?.languages_known?.join(", ") || "",

      portfolio: candidate.profile?.portfolio || "",
      linkedin_profile: candidate.profile?.linkedin_profile || "",
      github_profile: candidate.profile?.github_profile || "",
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [section, field] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [section]: {
            ...prev.profile[section as keyof typeof prev.profile],
            [field]: value,
          },
        },
      }))
    } else if (name.startsWith("profile.")) {
      const field = name.replace("profile.", "")
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Process arrays from comma-separated strings
    const processedData = {
      ...formData,
      profile: {
        ...formData.profile,
        technical_skills: formData.profile.technical_skills
          ? formData.profile.technical_skills.split(",").map((skill) => skill.trim())
          : [],
        soft_skills: formData.profile.soft_skills
          ? formData.profile.soft_skills.split(",").map((skill) => skill.trim())
          : [],
        languages_known: formData.profile.languages_known
          ? formData.profile.languages_known.split(",").map((lang) => lang.trim())
          : [],
      },
    }

    onSave(processedData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Candidate Profile</DialogTitle>
          <DialogDescription>Update information for {candidate.fullName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[70vh] pr-4">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="skills">Skills & Links</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile.date_of_birth">Date of Birth</Label>
                    <Input
                      id="profile.date_of_birth"
                      name="profile.date_of_birth"
                      value={formData.profile.date_of_birth}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile.bio">Bio</Label>
                  <Textarea
                    id="profile.bio"
                    name="profile.bio"
                    value={formData.profile.bio}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile.address">Address</Label>
                    <Input
                      id="profile.address"
                      name="profile.address"
                      value={formData.profile.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile.city">City</Label>
                    <Input
                      id="profile.city"
                      name="profile.city"
                      value={formData.profile.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile.state">State</Label>
                    <Input
                      id="profile.state"
                      name="profile.state"
                      value={formData.profile.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile.country">Country</Label>
                    <Input
                      id="profile.country"
                      name="profile.country"
                      value={formData.profile.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="education.degree">Degree</Label>
                  <Input
                    id="education.degree"
                    name="education.degree"
                    value={formData.profile.education.degree}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education.institution">Institution</Label>
                  <Input
                    id="education.institution"
                    name="education.institution"
                    value={formData.profile.education.institution}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education.year_of_passing">Year of Passing</Label>
                  <Input
                    id="education.year_of_passing"
                    name="education.year_of_passing"
                    value={formData.profile.education.year_of_passing}
                    onChange={handleChange}
                  />
                </div>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience.company_name">Company Name</Label>
                    <Input
                      id="experience.company_name"
                      name="experience.company_name"
                      value={formData.profile.experience.company_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience.position">Position</Label>
                    <Input
                      id="experience.position"
                      name="experience.position"
                      value={formData.profile.experience.position}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience.duration">Duration</Label>
                  <Input
                    id="experience.duration"
                    name="experience.duration"
                    value={formData.profile.experience.duration}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience.description">Description</Label>
                  <Textarea
                    id="experience.description"
                    name="experience.description"
                    value={formData.profile.experience.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile.technical_skills">Technical Skills (comma-separated)</Label>
                  <Textarea
                    id="profile.technical_skills"
                    name="profile.technical_skills"
                    value={formData.profile.technical_skills}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile.soft_skills">Soft Skills (comma-separated)</Label>
                  <Textarea
                    id="profile.soft_skills"
                    name="profile.soft_skills"
                    value={formData.profile.soft_skills}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile.languages_known">Languages Known (comma-separated)</Label>
                  <Textarea
                    id="profile.languages_known"
                    name="profile.languages_known"
                    value={formData.profile.languages_known}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile.portfolio">Portfolio URL</Label>
                    <Input
                      id="profile.portfolio"
                      name="profile.portfolio"
                      type="url"
                      value={formData.profile.portfolio}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile.linkedin_profile">LinkedIn URL</Label>
                    <Input
                      id="profile.linkedin_profile"
                      name="profile.linkedin_profile"
                      type="url"
                      value={formData.profile.linkedin_profile}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile.github_profile">GitHub URL</Label>
                    <Input
                      id="profile.github_profile"
                      name="profile.github_profile"
                      type="url"
                      value={formData.profile.github_profile}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

