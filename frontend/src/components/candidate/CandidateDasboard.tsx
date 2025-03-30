"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CandidateTabBar } from "./CandidateTabBar"
import { Button } from "@/components/ui/button"
import { ProfileEditDialog } from "./profile-edit-dialog"
// import { ProfileEditDialog } from "./profile-edit-dialog"

// Updated interface to match the full user profile schema
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

      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio,
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
        },
      }

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
        setCandidate(data.user)
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

      <div className="p-6 bg-white rounded-md mt-6">
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

