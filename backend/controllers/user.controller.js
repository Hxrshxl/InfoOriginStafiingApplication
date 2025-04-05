import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, email, username, phoneNumber, password, city, skills, role } = req.body;
    console.log(fullName, email, username, phoneNumber, city, skills, role);

    if (!fullName || !email || !username || !phoneNumber || !city || !skills || !role) {
      return res.status(400).json({
        message: "Required field is missing",
        success: false,
      });
    }

    // Check if user exists with email or username
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username is already taken",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    await User.create({
      fullName,
      email,
      username,
      phoneNumber,
      password: hashedPassword,
      city,
      skills,
      role,
    });
    
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error during registration",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        message: "Username or password is missing",
        success: false,
      });
    }
    
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect username or password",
        success: false,
      });
    }
    
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect username or password",
        success: false,
      });
    }
    
    const tokenData = {
      userId: user._id,
    };
    
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

    // Create user object without password
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber,
      city: user.city,
      skills: user.skills,
      role: user.role,
    };
    
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        user,
        token,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error during login",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error during logout",
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID not found.",
        success: false,
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id; // Assuming this is set by auth middleware
    const { fullName, email, username, phoneNumber, city, skills } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email or username already exists (if being updated)
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another account",
        });
      }
    }

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    // Update basic fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (username) user.username = username;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (city) user.city = city;
    if (skills) user.skills = skills;

    // Save the updated user
    await user.save();

    // Prepare the response object
    const responseUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber,
      city: user.city,
      skills: user.skills,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: responseUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

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

export const updateCandidateByRecruiter = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const recruiterId = req.id; // From auth middleware
    const { fullName, email, username, phoneNumber, city, skills } = req.body;

    // Verify the authenticated user is a recruiter
    const recruiter = await User.findById(recruiterId);
    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can update candidate details",
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

    // Check if email or username already exists (if being updated)
    if (email && email !== candidate.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another account",
        });
      }
    }

    if (username && username !== candidate.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    // Update candidate fields
    if (fullName) candidate.fullName = fullName;
    if (email) candidate.email = email;
    if (username) candidate.username = username;
    if (phoneNumber) candidate.phoneNumber = phoneNumber;
    if (city) candidate.city = city;
    if (skills) candidate.skills = skills;

    // Save the updated candidate
    await candidate.save();

    // Prepare the response object
    const responseCandidate = {
      _id: candidate._id,
      fullName: candidate.fullName,
      email: candidate.email,
      username: candidate.username,
      phoneNumber: candidate.phoneNumber,
      city: candidate.city,
      skills: candidate.skills,
      role: candidate.role,
    };

    return res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      candidate: responseCandidate,
    });
  } catch (error) {
    console.error("Error updating candidate:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the candidate",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteCandidateByRecruiter = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const recruiterId = req.id; // From auth middleware

    // Verify the authenticated user is a recruiter
    const recruiter = await User.findById(recruiterId);
    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can delete candidates",
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

    // Delete the candidate
    await User.findByIdAndDelete(candidateId);

    return res.status(200).json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the candidate",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const addCandidateByRecruiter = async (req, res) => {
  try {
    const recruiterId = req.id; // From auth middleware
    const { fullName, email, username, phoneNumber, password, city, skills } = req.body;

    // Verify the authenticated user is a recruiter
    const recruiter = await User.findById(recruiterId);
    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can add candidates",
      });
    }

    // Validate required fields
    if (!fullName || !email || !username || !phoneNumber || !password || !city || !skills) {
      return res.status(400).json({
        message: "Required field is missing",
        success: false,
      });
    }

    // Check if user exists with email or username
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username is already taken",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new candidate
    const newCandidate = await User.create({
      fullName,
      email,
      username,
      phoneNumber,
      password: hashedPassword,
      city,
      skills,
      role: "candidate", // Force role to be candidate
    });
    
    // Prepare the response object
    const responseCandidate = {
      _id: newCandidate._id,
      fullName: newCandidate.fullName,
      email: newCandidate.email,
      username: newCandidate.username,
      phoneNumber: newCandidate.phoneNumber,
      city: newCandidate.city,
      skills: newCandidate.skills,
      role: newCandidate.role,
    };

    return res.status(201).json({
      message: "Candidate added successfully",
      candidate: responseCandidate,
      success: true,
    });
  } catch (error) {
    console.error("Error adding candidate:", error);
    return res.status(500).json({
      message: "Server error while adding candidate",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
