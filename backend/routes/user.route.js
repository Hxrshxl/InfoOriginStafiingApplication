import express from "express";
import { 
  login, 
  register, 
  updateProfile, 
  logout, 
  getProfile, 
  getAllCandidates,
  updateCandidateByRecruiter,
  deleteCandidateByRecruiter,
  addCandidateByRecruiter
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Auth routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

// Profile routes
router.route("/profile").get(isAuthenticated, getProfile);  
router.route("/profile/update").put(isAuthenticated, updateProfile);

// Recruiter-specific routes
router.route("/recruiter/candidates").get(isAuthenticated, getAllCandidates);
router.route("/recruiter/candidates/:candidateId").put(isAuthenticated, updateCandidateByRecruiter);
router.route("/recruiter/candidates/:candidateId").delete(isAuthenticated, deleteCandidateByRecruiter);
router.route("/recruiter/candidates").post(isAuthenticated, addCandidateByRecruiter);

export default router;