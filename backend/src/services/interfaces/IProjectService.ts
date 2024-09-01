import { ProjectDTO, ProjectMetaDTO } from "../../models/dtos";

export interface IProjectService {
  getAll(): Promise<ProjectDTO[]>;
  get(slug: string): Promise<ProjectDTO | null>;
  getMetadata(slug: string): Promise<ProjectMetaDTO | null>;
  create(project: ProjectDTO): Promise<ProjectDTO>;
  update(slug: string, project: ProjectDTO): Promise<ProjectDTO>;
  deleteProject(slug: string): Promise<boolean>;
}
