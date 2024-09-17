import express from "express";
import {
  createProject,
  createProjectValidations,
  getAllProjects,
  getProject,
  getProjectMetadata,
  getProjectsDashboardData,
} from "../controllers/projects.js";

const router = express.Router();

router.get("/", getAllProjects);
router.post("/", createProjectValidations, createProject);
router.get("/:slug", getProject);
router.get("/:slug/metadata", getProjectMetadata);
router.get("/:slug/dashboard", getProjectsDashboardData);

export default router;
