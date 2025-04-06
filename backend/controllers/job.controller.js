import { Job } from "../models/job.model.js"

//admin
export const postJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experienceLevel, position, companyName } =
      req.body
    const userId = req.id

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experienceLevel ||
      !position ||
      !companyName
    ) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      })
    }

    // Handle requirements whether it's a string or already an array
    const requirementsArray = requirements ? (Array.isArray(requirements) ? requirements : requirements.split(",")) : []

    const job = await Job.create({
      title,
      description,
      requirements: requirementsArray,
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: Number(experienceLevel),
      position,
      companyName,
      created_by: userId, // Make sure to include the created_by field
    })

    return res.status(201).json({
      message: "New job created successfully",
      job,
      success: true,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Error creating job",
      success: false,
    })
  }
}

//student
export const getAllJobs = async (req, res) => {
  try {
    const Keyword = req.query.keyword || ""
    const query = {
      $or: [
        { title: { $regex: Keyword, $options: "i" } },
        { description: { $regex: Keyword, $options: "i" } },
        { companyName: { $regex: Keyword, $options: "i" } }, // Added company name to search
      ],
    }
    const jobs = await Job.find(query).sort({ createdAt: -1 })

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      })
    }
    return res.status(200).json({
      jobs,
      success: true,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Error fetching jobs",
      success: false,
    })
  }
}

// //student
// export const getJobById = async (req, res) => {
//   try {
//     const jobId = req.params.id
//     const job = await Job.findById(jobId).populate({
//       path: "applications",
//     })
//     if (!job) {
//       return res.status(404).json({
//         message: "Job not found",
//         success: false,
//       })
//     }
//     return res.status(200).json({
//       job,
//       success: true,
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       message: "Error fetching job",
//       success: false,
//     })
//   }
// }

//admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id
    const jobs = await Job.find({ created_by: adminId }).sort({ createdAt: -1 })

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      })
    }
    return res.status(200).json({
      jobs,
      success: true,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Error fetching admin jobs",
      success: false,
    })
  }
}

// Function to update a job by a recruiter
export const updateJobByRecruiter = async (req, res) => {
  try {
    const jobId = req.params.jobId
    const recruiterId = req.id // From auth middleware
    const { title, description, requirements, salary, location, jobType, experienceLevel, position, companyName } =
      req.body

    // Find the job first
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Ensure the recruiter can only update their own jobs
    if (job.created_by.toString() !== recruiterId) {
      return res.status(403).json({
        success: false,
        message: "You can only update jobs that you created",
      })
    }

    // Handle requirements whether it's a string or already an array
    const requirementsArray = requirements
      ? Array.isArray(requirements)
        ? requirements
        : requirements.split(",")
      : job.requirements

    // Update job fields (only update provided fields)
    const updatedFields = {
      ...(title && { title }),
      ...(description && { description }),
      ...(requirementsArray && { requirements: requirementsArray }),
      ...(salary && { salary: Number(salary) }),
      ...(location && { location }),
      ...(jobType && { jobType }),
      ...(experienceLevel && { experienceLevel: Number(experienceLevel) }),
      ...(position && { position: Number(position) }),
      ...(companyName && { companyName }),
    }

    // Update the job
    const updatedJob = await Job.findByIdAndUpdate(jobId, { $set: updatedFields }, { new: true })

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    })
  } catch (error) {
    console.error("Error updating job:", error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the job",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

// Function to delete a job by a recruiter
export const deleteJobByRecruiter = async (req, res) => {
  try {
    const jobId = req.params.jobId
    const recruiterId = req.id // From auth middleware

    // Find the job first
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Ensure the recruiter can only delete their own jobs
    if (job.created_by.toString() !== recruiterId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete jobs that you created",
      })
    }

    // Delete the job
    await Job.findByIdAndDelete(jobId)

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting job:", error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the job",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

// Function to get a specific job by ID for a recruiter (with more details than the public view)
export const getRecruiterJobById = async (req, res) => {
  try {
    const jobId = req.params.jobId
    const recruiterId = req.id

    // Find the job
    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "candidate",
        model: "User",
        select: "-password", // Exclude password field
      },
    })

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Check if the job belongs to the recruiter
    if (job.created_by.toString() !== recruiterId) {
      return res.status(403).json({
        success: false,
        message: "You can only view detailed information for jobs you created",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      job,
    })
  } catch (error) {
    console.error("Error fetching job:", error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the job",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

// Function to get all jobs created by a specific recruiter
export const getRecruiterJobs = async (req, res) => {
  try {
    const recruiterId = req.id

    // Get filter parameters from query
    const keyword = req.query.keyword || ""
    const status = req.query.status // For future use if you implement job status

    // Build query
    const query = {
      created_by: recruiterId,
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { companyName: { $regex: keyword, $options: "i" } },
      ],
    }

    // Add status filter if provided
    if (status) {
      query.status = status
    }

    // Find jobs created by this recruiter
    const jobs = await Job.find(query).sort({ createdAt: -1 }).populate({
      path: "applications",
      select: "status createdAt",
    })

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found",
        success: false,
      })
    }

    // Count applications for each job
    const jobsWithCounts = jobs.map((job) => {
      const applicationCount = job.applications ? job.applications.length : 0

      // Convert to POJO and add the count
      const jobObj = job.toObject()
      jobObj.applicationCount = applicationCount

      return jobObj
    })

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      jobCount: jobsWithCounts.length,
      jobs: jobsWithCounts,
    })
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching jobs",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

