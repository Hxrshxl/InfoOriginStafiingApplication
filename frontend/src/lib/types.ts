// User and authentication related types
export type UserRole = "candidate" | "recruiter"

export interface Education {
  highest_qualification: string
  university: string
  passing_year: number
  cgpa_or_percentage: number
}

export interface Experience {
  type: "fresher" | "experienced"
  years?: number
}

export interface UserProfile {
  bio?: string
  date_of_birth?: string
  address?: string
  city?: string
  state?: string
  country?: string
  profile_picture?: string
  education?: Education
  additional_certifications?: string[]
  experience?: Experience
  technical_skills?: string[]
  soft_skills?: string[]
  languages_known?: string[]
  resume?: string
  resumeOriginalName?: string
  portfolio?: string
  linkedin_profile?: string
  github_profile?: string
  company?: string
}

export interface User {
  _id: string
  fullName: string
  email: string
  phoneNumber: string
  role: UserRole
  profile: UserProfile
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  role: UserRole
}

export interface RegisterCredentials {
  fullName: string
  email: string
  phoneNumber: string
  password: string
  role: UserRole
}

export interface ProfileUpdateData {
  fullName?: string
  email?: string
  phoneNumber?: string
  profile?: Partial<UserProfile>
}

export interface ApiResponse<T = any> {
  message: string
  success: boolean
  user?: T
}

// Job related types
export interface Job {
  _id: string
  title: string
  company: string
  location: string
  type: "full-time" | "part-time" | "contract" | "internship"
  description: string
  requirements: string[]
  salary_range?: {
    min: number
    max: number
    currency: string
  }
  posted_by: string
  posted_date: string
  deadline?: string
  status: "active" | "closed"
}

export interface JobApplication {
  _id: string
  job_id: string
  candidate_id: string
  status: "pending" | "reviewing" | "accepted" | "rejected"
  applied_date: string
  cover_letter?: string
}

