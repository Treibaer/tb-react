import express from "express";
import {
  createProject,
  createProjectValidations,
  getAllProjects,
  getProject,
  getProjectMetadata,
} from "../controllers/projects.js";

const router = express.Router();

router.get("/", getAllProjects);
router.post("/", createProjectValidations, createProject);
router.get("/:slug", getProject);
router.get("/:slug/metadata", getProjectMetadata);

export default router;
