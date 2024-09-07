import { NextFunction, Request, Response } from "express";
import { SQLProjectService } from "../services/SQLProjectService.js";
import Transformer from "../utils/Transformer.js";
import { body, validationResult } from "express-validator";
import { ProjectDTO } from "../dtos/project-dto.js";

const projectsService = SQLProjectService.shared;

export const getAllProjects = async (_: Request, res: Response) => {
  try {
    const projects = await projectsService.getAll();
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectSlug = req.params.slug;
  try {
    const project = await projectsService.get(projectSlug);
    res.status(200).json(Transformer.project(project));
  } catch (error: any) {
    next(error);
  }
};

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

export const createProjectValidations = [
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
];

export async function getProjectMetadata(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
}
