"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

interface ProfileEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: {
    profile_picture?: string
    [key: string]: any
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSave: () => void
  loading: boolean
}

export function ProfileEditDialog({ open, onOpenChange, formData, onChange, onSave, loading }: ProfileEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Make changes to your profile information. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="skills">Skills & Links</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={onChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" name="email" value={formData.email} onChange={onChange} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={onChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="profile_picture" className="text-right">
                  Profile Picture
                </Label>
                <div className="col-span-3">
                  <Input
                    id="profile_picture"
                    name="profile_picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0]
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          // Set the base64 string to the formData
                          onChange({
                            target: {
                              name: "profile_picture",
                              value: reader.result as string,
                            },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  {formData.profile_picture && (
                    <div className="mt-2">
                      <img
                        src={formData.profile_picture || "/placeholder.svg"}
                        alt="Profile Preview"
                        className="w-24 h-24 rounded-full object-cover border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date_of_birth" className="text-right">
                  Date of Birth
                </Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={onChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="bio" className="text-right pt-2">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={onChange}
                  className="col-span-3"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={onChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  City
                </Label>
                <Input id="city" name="city" value={formData.city} onChange={onChange} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">
                  State
                </Label>
                <Input id="state" name="state" value={formData.state} onChange={onChange} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={onChange}
                  className="col-span-3"
                />
              </div>
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="degree" className="text-right">
                  Degree
                </Label>
                <Input id="degree" name="degree" value={formData.degree} onChange={onChange} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="institution" className="text-right">
                  Institution
                </Label>
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={onChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year_of_passing" className="text-right">
                  Year of Passing
                </Label>
                <Input
                  id="year_of_passing"
                  name="year_of_passing"
                  value={formData.year_of_passing}
                  onChange={onChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="additional_certifications" className="text-right pt-2">
                  Certifications
                </Label>
                <Textarea
                  id="additional_certifications"
                  name="additional_certifications"
                  value={formData.additional_certifications}
                  onChange={onChange}
                  className="col-span-3"
                  placeholder="Separate multiple certifications with commas"
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company_name" className="text-right">
                  Company Name
                </Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={onChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Position
                </Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={onChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={onChange}
                  className="col-span-3"
                  placeholder="e.g., 2 years, Jan 2020 - Present"
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
                  onChange={onChange}
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="technical_skills" className="text-right pt-2">
                  Technical Skills
                </Label>
                <Textarea
                  id="technical_skills"
                  name="technical_skills"
                  value={formData.technical_skills}
                  onChange={onChange}
                  className="col-span-3"
                  placeholder="Separate skills with commas"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="soft_skills" className="text-right pt-2">
                  Soft Skills
                </Label>
                <Textarea
                  id="soft_skills"
                  name="soft_skills"
                  value={formData.soft_skills}
                  onChange={onChange}
                  className="col-span-3"
                  placeholder="Separate skills with commas"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="languages_known" className="text-right pt-2">
                  Languages Known
                </Label>
                <Textarea
                  id="languages_known"
                  name="languages_known"
                  value={formData.languages_known}
                  onChange={onChange}
                  className="col-span-3"
                  placeholder="Separate languages with commas"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="portfolio" className="text-right">
                  Portfolio URL
                </Label>
                <Input
                  id="portfolio"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={onChange}
                  className="col-span-3"
                  placeholder="https://your-portfolio.com"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linkedin_profile" className="text-right">
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedin_profile"
                  name="linkedin_profile"
                  value={formData.linkedin_profile}
                  onChange={onChange}
                  className="col-span-3"
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="github_profile" className="text-right">
                  GitHub URL
                </Label>
                <Input
                  id="github_profile"
                  name="github_profile"
                  value={formData.github_profile}
                  onChange={onChange}
                  className="col-span-3"
                  placeholder="https://github.com/your-username"
                />
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter>
          <Button type="button" onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

