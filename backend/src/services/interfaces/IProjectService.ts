import { Project } from "../../Models";

export interface IProjectService {
  createProject(project: Project): Promise<Project>;
  getProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | null>;
  getMetadata(slug: string): Promise<Project | null>;
  updateProject(slug: string, project: Project): Promise<Project>;
  deleteProject(slug: string): Promise<boolean>;
}
