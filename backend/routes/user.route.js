// import express from "express";
// import { login,register, updateProfile,logout, getProfile, getAllCandidates } from "../controllers/user.controller.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// const router = express.Router();

// router.route("/register").post(register);
// router.route("/login").post(login);
// router.route("/logout").get(logout);
// router.route("/getprofile").get(isAuthenticated,getProfile);
// router.route("/profile/update").post(isAuthenticated,updateProfile);
// router.route("/recruiter/candidates").get(isAuthenticated, getAllCandidates);

// export default router;

import express from "express";
import { login, register, updateProfile, logout, getProfile, getAllCandidates, getCandidateById, editCandidateByRecruiter} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/getprofile").get(isAuthenticated, getProfile);
router.route("/profile/update").post(isAuthenticated, updateProfile);
router.route("/recruiter/candidates").get(isAuthenticated, getAllCandidates);

router.route("/recruiter/candidates/:candidateId").get(isAuthenticated, getCandidateById);
router.route("/recruiter/candidates/:candidateId/edit").put(isAuthenticated, editCandidateByRecruiter);




export default router;
