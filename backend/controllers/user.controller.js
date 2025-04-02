import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body
    console.log(fullName, email, phoneNumber, password, role)

    if (!fullName || !email || !phoneNumber || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      })
    }

    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({
        message: "User already exist with the email",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    })
    return res.status(201).json({
      message: "Account creted successfully.",
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      })
    }
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or pssword",
        success: false,
      })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "inccorect email or password",
        success: false,
      })
    }
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      })
    }
    const tokenData = {
      userId: user._id,
    }
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" })

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    }
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        user,
        token,  
        success: true,
      })
  } catch (error) {
    console.log(error)
  }
}

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully",
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.id

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID not found.",
        success: false,
      })
    }

    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      })
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
      success: true,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Server error",
      success: false,
    })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id // Assuming this is set by auth middleware
    const { fullName, email, phoneNumber, profile } = req.body

    // Find the user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update basic fields
    if (fullName) user.fullName = fullName
    if (email) user.email = email
    if (phoneNumber) user.phoneNumber = phoneNumber

    // Update profile fields if they exist
    if (profile) {
      // Initialize profile object if it doesn't exist
      if (!user.profile) {
        user.profile = {}
      }

      // Update basic profile fields
      if (profile.bio !== undefined) user.profile.bio = profile.bio
      if (profile.date_of_birth !== undefined) user.profile.date_of_birth = profile.date_of_birth
      if (profile.address !== undefined) user.profile.address = profile.address
      if (profile.city !== undefined) user.profile.city = profile.city
      if (profile.state !== undefined) user.profile.state = profile.state
      if (profile.country !== undefined) user.profile.country = profile.country

      // Explicitly handle profile_picture
      if (profile.profile_picture !== undefined) user.profile.profile_picture = profile.profile_picture

      // Update arrays (ensuring they're arrays before assigning)
      if (Array.isArray(profile.technical_skills)) {
        user.profile.technical_skills = profile.technical_skills
      }
      if (Array.isArray(profile.soft_skills)) {
        user.profile.soft_skills = profile.soft_skills
      }
      if (Array.isArray(profile.languages_known)) {
        user.profile.languages_known = profile.languages_known
      }
      if (Array.isArray(profile.additional_certifications)) {
        user.profile.additional_certifications = profile.additional_certifications
      }

      // Update education
      if (profile.education) {
        user.profile.education = {
          degree: profile.education.degree || user.profile.education?.degree,
          institution: profile.education.institution || user.profile.education?.institution,
          year_of_passing: profile.education.year_of_passing || user.profile.education?.year_of_passing,
        }
      }

      // Update experience
      if (profile.experience) {
        user.profile.experience = {
          position: profile.experience.position || user.profile.experience?.position,
          company_name: profile.experience.company_name || user.profile.experience?.company_name,
          duration: profile.experience.duration || user.profile.experience?.duration,
          description: profile.experience.description || user.profile.experience?.description,
        }
      }

      // Update professional links
      if (profile.portfolio !== undefined) user.profile.portfolio = profile.portfolio
      if (profile.linkedin_profile !== undefined) user.profile.linkedin_profile = profile.linkedin_profile
      if (profile.github_profile !== undefined) user.profile.github_profile = profile.github_profile
    }

    // Save the updated user
    await user.save()

    // Prepare the response object
    const responseUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: responseUser,
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await User.find({ role: "candidate" }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Candidates fetched successfully",
      candidates
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching candidates",
      error: error.message
    });
  }
};



export const editCandidateByRecruiter = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { fullName, email, phoneNumber, profile } = req.body;
    const recruiterId = req.id; // From auth middleware

    // Verify the authenticated user is a recruiter
    const recruiter = await User.findById(recruiterId);
    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can edit candidate profiles",
      });
    }

    // Find the candidate
    const candidate = await User.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (candidate.role !== "candidate") {
      return res.status(400).json({
        success: false,
        message: "The specified user is not a candidate",
      });
    }

    // Update basic fields
    if (fullName) candidate.fullName = fullName;
    if (email) candidate.email = email;
    if (phoneNumber) candidate.phoneNumber = phoneNumber;

    // Update profile fields if they exist
    if (profile) {
      // Initialize profile object if it doesn't exist
      if (!candidate.profile) {
        candidate.profile = {};
      }

      // Update basic profile fields
      if (profile.bio !== undefined) candidate.profile.bio = profile.bio;
      if (profile.date_of_birth !== undefined) candidate.profile.date_of_birth = profile.date_of_birth;
      if (profile.address !== undefined) candidate.profile.address = profile.address;
      if (profile.city !== undefined) candidate.profile.city = profile.city;
      if (profile.state !== undefined) candidate.profile.state = profile.state;
      if (profile.country !== undefined) candidate.profile.country = profile.country;
      if (profile.profile_picture !== undefined) candidate.profile.profile_picture = profile.profile_picture;

      // Update arrays (ensuring they're arrays before assigning)
      if (Array.isArray(profile.technical_skills)) {
        candidate.profile.technical_skills = profile.technical_skills;
      }
      if (Array.isArray(profile.soft_skills)) {
        candidate.profile.soft_skills = profile.soft_skills;
      }
      if (Array.isArray(profile.languages_known)) {
        candidate.profile.languages_known = profile.languages_known;
      }
      if (Array.isArray(profile.additional_certifications)) {
        candidate.profile.additional_certifications = profile.additional_certifications;
      }

      // Update education
      if (profile.education) {
        candidate.profile.education = {
          degree: profile.education.degree || candidate.profile.education?.degree,
          institution: profile.education.institution || candidate.profile.education?.institution,
          year_of_passing: profile.education.year_of_passing || candidate.profile.education?.year_of_passing,
        };
      }

      // Update experience
      if (profile.experience) {
        candidate.profile.experience = {
          position: profile.experience.position || candidate.profile.experience?.position,
          company_name: profile.experience.company_name || candidate.profile.experience?.company_name,
          duration: profile.experience.duration || candidate.profile.experience?.duration,
          description: profile.experience.description || candidate.profile.experience?.description,
        };
      }

      // Update professional links
      if (profile.portfolio !== undefined) candidate.profile.portfolio = profile.portfolio;
      if (profile.linkedin_profile !== undefined) candidate.profile.linkedin_profile = profile.linkedin_profile;
      if (profile.github_profile !== undefined) candidate.profile.github_profile = profile.github_profile;
    }

    // Save the updated candidate
    await candidate.save();

    // Prepare the response object (excluding password)
    const responseCandidate = {
      _id: candidate._id,
      fullName: candidate.fullName,
      email: candidate.email,
      phoneNumber: candidate.phoneNumber,
      role: candidate.role,
      profile: candidate.profile,
    };

    return res.status(200).json({
      success: true,
      message: "Candidate profile updated successfully",
      candidate: responseCandidate,
    });
  } catch (error) {
    console.error("Error updating candidate profile:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the candidate profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getCandidateById = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const recruiterId = req.id; // From auth middleware

    // Verify the authenticated user is a recruiter
    const recruiter = await User.findById(recruiterId);
    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can access candidate details",
      });
    }

    // Find the candidate (excluding password)
    const candidate = await User.findById(candidateId).select("-password");
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (candidate.role !== "candidate") {
      return res.status(400).json({
        success: false,
        message: "The specified user is not a candidate",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Candidate fetched successfully",
      candidate,
    });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the candidate",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};