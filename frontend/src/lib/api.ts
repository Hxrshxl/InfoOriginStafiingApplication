import type {
  LoginCredentials,
  RegisterCredentials,
  ApiResponse,
  User,
  ProfileUpdateData,
  Job,
  JobApplication,
} from "./types"

const API_URL = "http://localhost:3000/api/v1"

// Helper function to handle API responses\
const handleResponse = async <T>(response: Response)
: Promise<T> =>
{
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Something went wrong")
  }
  return response.json();
}

// Authentication API functions
export const loginUser = async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
  const response = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  })

  return handleResponse<ApiResponse<User>>(response)
}

export const registerUser = async (credentials: RegisterCredentials): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  })

  return handleResponse<ApiResponse>(response)
}

export const logoutUser = async (): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/user/logout`, {
    method: "GET",
    credentials: "include",
  })

  return handleResponse<ApiResponse>(response)
}

// Function to check if user is authenticated
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "GET",
      credentials: "include",
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    return null
  }
}

// Function to update user profile
export const updateUserProfile = async (profileData: ProfileUpdateData): Promise<ApiResponse<User>> => {
  const response = await fetch(`${API_URL}/user/profile/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(profileData),
  })

  return handleResponse<ApiResponse<User>>(response)
}

// Job related functions
export const getJobs = async (): Promise<Job[]> => {
  const response = await fetch(`${API_URL}/job`, {
    method: "GET",
    credentials: "include",
  })

  return handleResponse<{ jobs: Job[] }>(response).then((data) => data.jobs || [])
}

export const getJobById = async (jobId: string): Promise<Job> => {
  const response = await fetch(`${API_URL}/job/${jobId}`, {
    method: "GET",
    credentials: "include",
  })

  return handleResponse<{ job: Job }>(response).then((data) => data.job)
}

export const createJob = async (jobData: Omit<Job, "_id" | "posted_by" | "posted_date">): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/job/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(jobData),
  })

  return handleResponse<ApiResponse>(response)
}

export const applyForJob = async (jobId: string, coverLetter?: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/application/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ jobId, coverLetter }),
  })

  return handleResponse<ApiResponse>(response)
}

export const getCandidateApplications = async (): Promise<JobApplication[]> => {
  const response = await fetch(`${API_URL}/application/candidate`, {
    method: "GET",
    credentials: "include",
  })

  return handleResponse<{ applications: JobApplication[] }>(response).then((data) => data.applications || [])
}

export const getRecruiterApplications = async (): Promise<JobApplication[]> => {
  const response = await fetch(`${API_URL}/application/recruiter`, {
    method: "GET",
    credentials: "include",
  })

  return handleResponse<{ applications: JobApplication[] }>(response).then((data) => data.applications || [])
}

export const getAllCandidates = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/user/candidates`, {
    method: "GET",
    credentials: "include",
  })

  return handleResponse<{ candidates: User[] }>(response).then((data) => data.candidates || [])
}

export const updateApplicationStatus = async (
  applicationId: string,
  status: JobApplication["status"],
): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/application/${applicationId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  })

  return handleResponse<ApiResponse>(response)
}

