"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CandidateTabBar } from "./CandidateTabBar"
import { Button } from "@/components/ui/button"
import { ProfileEditDialog } from "./profile-edit-dialog"
// import { ProfileEditDialog } from "./profile-edit-dialog"
import { Card, CardDescription } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { User, Code, GraduationCap, Briefcase, FileText, Link, LayoutDashboard, Linkedin, Github } from "lucide-react"

// full user profile schema
interface Candidate {
  _id: string
  fullName: string
  email: string
  phoneNumber?: string
  role: string
  profile?: {
    bio?: string
    date_of_birth?: string
    address?: string
    city?: string
    state?: string
    country?: string
    technical_skills?: string[]
    soft_skills?: string[]
    languages_known?: string[]
    education?: {
      degree: string
      institution: string
      year_of_passing: string
    }
    experience?: {
      position: string
      company_name: string
      duration: string
      description?: string
    }
    additional_certifications?: string[]
    resume?: string
    resumeOriginalName?: string
    portfolio?: string
    linkedin_profile?: string
    github_profile?: string
    profile_picture?: string
  }
}

const CandidateDashboard = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<{
    fullName: string
    email: string
    phoneNumber: string
    bio: string
    date_of_birth: string
    address: string
    city: string
    state: string
    country: string
    technical_skills: string
    soft_skills: string
    languages_known: string
    portfolio: string
    linkedin_profile: string
    github_profile: string
    degree: string
    institution: string
    year_of_passing: string
    company_name: string
    position: string
    duration: string
    description: string
    additional_certifications: string
    profile_picture: string
  }>({
    fullName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    date_of_birth: "",
    address: "",
    city: "",
    state: "",
    country: "",
    technical_skills: "",
    soft_skills: "",
    languages_known: "",
    portfolio: "",
    linkedin_profile: "",
    github_profile: "",
    degree: "",
    institution: "",
    year_of_passing: "",
    company_name: "",
    position: "",
    duration: "",
    description: "",
    additional_certifications: "",
    profile_picture: "",
  })

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        setLoading(true)

        const endpoint = "http://localhost:3000/api/v1/user/getprofile"
        const response = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch candidate details")
        }

        const data = await response.json()

        if (data.success) {
          setCandidate(data.user)
          // Initialize form data with existing values
          setFormData({
            fullName: data.user.fullName || "",
            email: data.user.email || "",
            phoneNumber: data.user.phoneNumber || "",
            bio: data.user.profile?.bio || "",
            date_of_birth: data.user.profile?.date_of_birth || "",
            address: data.user.profile?.address || "",
            city: data.user.profile?.city || "",
            state: data.user.profile?.state || "",
            country: data.user.profile?.country || "",
            technical_skills: data.user.profile?.technical_skills?.join(", ") || "",
            soft_skills: data.user.profile?.soft_skills?.join(", ") || "",
            languages_known: data.user.profile?.languages_known?.join(", ") || "",
            portfolio: data.user.profile?.portfolio || "",
            linkedin_profile: data.user.profile?.linkedin_profile || "",
            github_profile: data.user.profile?.github_profile || "",
            degree: data.user.profile?.education?.degree || "",
            institution: data.user.profile?.education?.institution || "",
            year_of_passing: data.user.profile?.education?.year_of_passing || "",
            company_name: data.user.profile?.experience?.company_name || "",
            position: data.user.profile?.experience?.position || "",
            duration: data.user.profile?.experience?.duration || "",
            description: data.user.profile?.experience?.description || "",
            additional_certifications: data.user.profile?.additional_certifications?.join(", ") || "",
            profile_picture: data.user.profile?.profile_picture || "",
          })
          localStorage.setItem("userId", data.user._id)
        } else {
          throw new Error(data.message || "Failed to fetch candidate details")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching candidate details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCandidateDetails()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      // Convert comma-separated strings to arrays
      const technicalSkills = formData.technical_skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
      const softSkills = formData.soft_skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
      const languagesKnown = formData.languages_known
        .split(",")
        .map((lang) => lang.trim())
        .filter(Boolean)
      const certifications = formData.additional_certifications
        .split(",")
        .map((cert) => cert.trim())
        .filter(Boolean)

      // Create the update data object
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        profile: {
          bio: formData.bio,
          date_of_birth: formData.date_of_birth,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          technical_skills: technicalSkills,
          soft_skills: softSkills,
          languages_known: languagesKnown,
          education: {
            degree: formData.degree,
            institution: formData.institution,
            year_of_passing: formData.year_of_passing,
          },
          experience: {
            company_name: formData.company_name,
            position: formData.position,
            duration: formData.duration,
            description: formData.description,
          },
          additional_certifications: certifications,
          portfolio: formData.portfolio,
          linkedin_profile: formData.linkedin_profile,
          github_profile: formData.github_profile,
          profile_picture: formData.profile_picture, // Ensure this is included
        },
      }

      console.log(
        "Sending update with profile picture:",
        formData.profile_picture ? "Image data present" : "No image data",
      )

      // Send the update request
      const response = await fetch("http://localhost:3000/api/v1/user/profile/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const data = await response.json()

      if (data.success) {
        // Update the local state with the returned user data
        setCandidate(data.user)

        // Force a re-render by updating the state with the new profile picture
        if (data.user.profile?.profile_picture) {
          setFormData((prev) => ({
            ...prev,
            profile_picture: data.user.profile.profile_picture,
          }))
        }

        setOpen(false)
      } else {
        throw new Error(data.message || "Failed to update profile")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error updating profile:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CandidateTabBar />

      {/* <div className="p-6 bg-white rounded-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Candidate Details</h2>

        {loading && <p className="text-gray-500">Loading candidate details...</p>}
        {error && <div className="p-4 bg-red-50 text-red-600 rounded-md">Error: {error}</div>}

        {!loading && !error && candidate && (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {candidate.fullName || "Not provided"}
            </p>
            <p>
              <strong>Email:</strong> {candidate.email || "Not provided"}
            </p>
            <p>
              <strong>Phone:</strong> {candidate.phoneNumber || "Not provided"}
            </p>
            <p>
              <strong>Role:</strong> {candidate.role || "Not provided"}
            </p>

            <p>
              <strong>Bio:</strong> {candidate.profile?.bio || "Not provided"}
            </p>
            <p>
              <strong>Date of Birth:</strong> {candidate.profile?.date_of_birth || "Not provided"}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {candidate.profile?.address
                ? `${candidate.profile.address}, ${candidate.profile.city || ""}, ${candidate.profile.state || ""}, ${candidate.profile.country || ""}`
                : "Not provided"}
            </p>

            <p>
              <strong>Technical Skills:</strong>{" "}
              {candidate.profile?.technical_skills?.length
                ? candidate.profile.technical_skills.join(", ")
                : "Not provided"}
            </p>

            <p>
              <strong>Soft Skills:</strong>{" "}
              {candidate.profile?.soft_skills?.length ? candidate.profile.soft_skills.join(", ") : "Not provided"}
            </p>

            <p>
              <strong>Languages Known:</strong>{" "}
              {candidate.profile?.languages_known?.length
                ? candidate.profile.languages_known.join(", ")
                : "Not provided"}
            </p>

            <p>
              <strong>Education:</strong>{" "}
              {candidate.profile?.education
                ? `${candidate.profile.education.degree} from ${candidate.profile.education.institution} (Year: ${candidate.profile.education.year_of_passing})`
                : "Not provided"}
            </p>

            <p>
              <strong>Experience:</strong>{" "}
              {candidate.profile?.experience
                ? `${candidate.profile.experience.position} at ${candidate.profile.experience.company_name} (${candidate.profile.experience.duration})`
                : "Not provided"}
            </p>

            <p>
              <strong>Certifications:</strong>{" "}
              {candidate.profile?.additional_certifications?.length
                ? candidate.profile.additional_certifications.join(", ")
                : "Not provided"}
            </p>

            <p>
              <strong>Portfolio:</strong>{" "}
              {candidate.profile?.portfolio ? (
                <a
                  href={candidate.profile.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Portfolio
                </a>
              ) : (
                "Not provided"
              )}
            </p>

            <p>
              <strong>LinkedIn:</strong>{" "}
              {candidate.profile?.linkedin_profile ? (
                <a
                  href={candidate.profile.linkedin_profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn Profile
                </a>
              ) : (
                "Not provided"
              )}
            </p>

            <p>
              <strong>GitHub:</strong>{" "}
              {candidate.profile?.github_profile ? (
                <a
                  href={candidate.profile.github_profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub Profile
                </a>
              ) : (
                "Not provided"
              )}
            </p>

            <div className="mt-4">
              <strong>Profile Photo:</strong>
              <div className="mt-2">
                <img
                  src={candidate.profile?.profile_picture || "/placeholder.svg?height=96&width=96"}
                  alt={candidate.fullName ? `${candidate.fullName}'s profile` : "Profile Photo"}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div> */}

      <div className="mt-6 space-y-6">
        {loading && <p className="text-gray-500">Loading candidate details...</p>}
        {error && <div className="p-4 bg-red-50 text-red-600 rounded-md">Error: {error}</div>}

        {!loading && !error && candidate && (
          <>
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">{candidate.fullName || "Candidate"}</CardTitle>
                    <CardDescription className="text-lg">{candidate.role || "Role not specified"}</CardDescription>
                  </div>
                  <div className="relative ">
                    <img
                      src={candidate.profile?.profile_picture || "/placeholder.svg?height=96&width=96"}
                      alt={candidate.fullName ? `${candidate.fullName}'s profile` : "Profile Photo"}
                      className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-md ml-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <div className="grid grid-cols-3">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="col-span-2 font-medium">{candidate.email || "Not provided"}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="col-span-2 font-medium">{candidate.phoneNumber || "Not provided"}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-muted-foreground">Date of Birth:</span>
                        <span className="col-span-2 font-medium">
                          {candidate.profile?.date_of_birth || "Not provided"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-muted-foreground">Address:</span>
                        <span className="col-span-2 font-medium">
                          {candidate.profile?.address
                            ? `${candidate.profile.address}, ${candidate.profile.city || ""}, ${candidate.profile.state || ""}, ${candidate.profile.country || ""}`
                            : "Not provided"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Skills & Languages
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <div className="grid grid-cols-3">
                        <span className="text-muted-foreground">Technical:</span>
                        <div className="col-span-2">
                          {candidate.profile?.technical_skills?.length ? (
                            <div className="flex flex-wrap gap-1">
                              {candidate.profile.technical_skills.map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Not provided</span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-muted-foreground">Soft Skills:</span>
                        <div className="col-span-2">
                          {candidate.profile?.soft_skills?.length ? (
                            <div className="flex flex-wrap gap-1">
                              {candidate.profile.soft_skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Not provided</span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-muted-foreground">Languages:</span>
                        <div className="col-span-2">
                          {candidate.profile?.languages_known?.length ? (
                            <div className="flex flex-wrap gap-1">
                              {candidate.profile.languages_known.map((lang, index) => (
                                <span key={index} className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Not provided</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Education */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Education & Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-4">
                      {candidate.profile?.education ? (
                        <div className="border-l-2 border-primary pl-4 py-1">
                          <div className="font-semibold">{candidate.profile.education.degree}</div>
                          <div>{candidate.profile.education.institution}</div>
                          <div className="text-xs text-muted-foreground">
                            Year: {candidate.profile.education.year_of_passing}
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground italic">No education details provided</div>
                      )}

                      <div>
                        <div className="font-medium mb-2">Certifications</div>
                        {candidate.profile?.additional_certifications?.length ? (
                          <ul className="list-disc list-inside space-y-1">
                            {candidate.profile.additional_certifications.map((cert, index) => (
                              <li key={index}>{cert}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-muted-foreground italic">No certifications provided</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Experience */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Work Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      {candidate.profile?.experience ? (
                        <div className="border-l-2 border-secondary pl-4 py-1">
                          <div className="font-semibold">{candidate.profile.experience.position}</div>
                          <div>{candidate.profile.experience.company_name}</div>
                          <div className="text-xs text-muted-foreground">{candidate.profile.experience.duration}</div>
                          {candidate.profile.experience.description && (
                            <div className="mt-2 text-muted-foreground">{candidate.profile.experience.description}</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-muted-foreground italic">No experience details provided</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Bio Section */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Bio
                </CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.profile?.bio ? (
                  <p className="text-sm">{candidate.profile.bio}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No bio provided</p>
                )}
              </CardContent>
            </Card>

            {/* Links Section */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  Professional Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href={candidate.profile?.portfolio || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-3 rounded-lg border ${candidate.profile?.portfolio ? "hover:bg-muted cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <div>
                      <div className="font-medium">Portfolio</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {candidate.profile?.portfolio || "Not provided"}
                      </div>
                    </div>
                  </a>

                  <a
                    href={candidate.profile?.linkedin_profile || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-3 rounded-lg border ${candidate.profile?.linkedin_profile ? "hover:bg-muted cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <Linkedin className="w-4 h-4" />
                    <div>
                      <div className="font-medium">LinkedIn</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {candidate.profile?.linkedin_profile || "Not provided"}
                      </div>
                    </div>
                  </a>

                  <a
                    href={candidate.profile?.github_profile || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-3 rounded-lg border ${candidate.profile?.github_profile ? "hover:bg-muted cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <Github className="w-4 h-4" />
                    <div>
                      <div className="font-medium">GitHub</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {candidate.profile?.github_profile || "Not provided"}
                      </div>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Floating Button to Open Edit Dialog */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={() => setOpen(true)} className="shadow-lg bg-primary hover:bg-primary/90">
          Edit Profile
        </Button>
      </div>

      {/* Edit Profile Dialog */}
      <ProfileEditDialog
        open={open}
        onOpenChange={setOpen}
        formData={formData}
        onChange={handleChange}
        onSave={handleSave}
        loading={loading}
      />
    </>
  )
}

export default CandidateDashboard

