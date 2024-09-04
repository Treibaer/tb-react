import { ProjectDTO } from "../dtos/project-dto.js";
import { Project } from "../models/project.js";

export default class Validator {
  static async validateNewProject(project: ProjectDTO) {
    if (!project.title) {
      throw new Error("Title is invalid");
    }
    if (!project.slug || project.slug.length !== 2) {
      throw new Error("Slug is invalid");
    }

    const projectWithTitle = await Project.findOne({
      where: { title: project.title },
    });
    if (projectWithTitle) {
      throw new Error("Project with this title already exists");
    }
    const projectWithSlug = await Project.findOne({
      where: { slug: project.slug },
    });
    if (projectWithSlug) {
      throw new Error("Project with this slug already exists");
    }
  }
}
