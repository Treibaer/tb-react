import express, { NextFunction, Request, Response } from "express";
import { SQLProjectService } from "../services/SQLProjectService.js";
import { getLogin } from "../controllers/projects.js";
import { body, check, validationResult } from "express-validator";
import { User } from "../models/user.js";
import { ProjectDTO } from "../dtos/project-dto.js";
import Transformer from "../utils/Transformer.js";

const projectsService = SQLProjectService.shared;
const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const projects = await projectsService.getAll();
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:slug", async (req, res, next) => {
  const projectSlug = req.params.slug;
  try {
    const project = await projectsService.get(projectSlug);
    res.status(200).json(Transformer.project(project));
  } catch (error: any) {
    next(error);
  }
});

router.post(
  "/test",
  [
    check("email")
      .isEmail()
      .withMessage("please enter a valid email")
      .notEmpty()
      .withMessage("email is required")
      .isAlphanumeric()
      .withMessage("please enter an alphanumeric email")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ where: { email: value } });
        if (user) {
          console.log(req == null);
          throw new Error("email already in use");
        }
        return true;
      })
      .isLength({ min: 5, max: 255 }),
    body("password", "password is required").isLength({ min: 5, max: 255 }),
    // .withMessage("password must be at least 5 characters long")
  ],

  getLogin
);

router.post(
  "/",
  [
    body("title")
      .isLength({ min: 2, max: 255 })
      .withMessage("Title is too short"),
    body("slug")
      .isLength({ min: 2, max: 2 })
      .withMessage("slug must be exactly 2 characters"),
    body("slug").custom(async (value) => {
      const project = await projectsService.get(value);
      if (project) {
        throw new Error("Slug already in use");
      }
      return true;
    }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: "validation error", errors: errors.array() });
    }
    try {
      const project = await projectsService.create(req.body as ProjectDTO);
      res.status(201).json(project);
    } catch (error: any) {
      return next(new Error(error.message));
    }
  }
);

router.get("/:slug/metadata", async (req, res, next) => {
  try {
    const projectSlug = req.params.slug;
    const project = await projectsService.getMetadata(projectSlug);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.status(200).json(project);
  } catch (error: any) {
    next(new Error(error.message));
  }
});

export default router;
