import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
  getAllJobs, 
  getJobById, 
  postJob, 
  getAdminJobs,
  updateJobByRecruiter,
  deleteJobByRecruiter,
  getRecruiterJobById,
  getRecruiterJobs
} from "../controllers/job.controller.js";

const router = express.Router();

// Public routes
router.route("/").get(getAllJobs);
router.route("/:id").get(getJobById);

// Admin routes
router.route("/create").post(isAuthenticated, postJob);
router.route("/admin").get(isAuthenticated, getAdminJobs);

// Recruiter routes
router.route("/recruiter").get(isAuthenticated, getRecruiterJobs);
router.route("/recruiter/:jobId").get(isAuthenticated, getRecruiterJobById);
router.route("/recruiter/:jobId").put(isAuthenticated, updateJobByRecruiter);
router.route("/recruiter/:jobId").delete(isAuthenticated, deleteJobByRecruiter);

export default router;