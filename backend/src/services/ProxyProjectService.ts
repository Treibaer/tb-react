import { ProjectDTO, ProjectMetaDTO } from "../models/dtos.js";
import Client from "./Client.js";
import { IProjectService } from "./interfaces/IProjectService.js";

export class ProxyProjectService implements IProjectService {
  client = Client.shared;
  static shared = new ProxyProjectService();

  async create(project: ProjectDTO): Promise<ProjectDTO> {
    return this.client.post("/projects", project);
  }

  async getAll(): Promise<ProjectDTO[]> {
    return this.client.get<ProjectDTO[]>("/projects");
  }

  async get(slug: string): Promise<ProjectDTO | null> {
    return this.client.get<ProjectDTO>(`/projects/${slug}`);
  }

  async getMetadata(slug: string): Promise<ProjectMetaDTO | null> {
    return this.client.get<ProjectMetaDTO>(`/projects/${slug}/metadata`);
  }

  async update(slug: string, project: ProjectDTO): Promise<ProjectDTO> {
    // return this.service.updateProject(id, project);

    throw new Error("Method not implemented." + slug + project.id);
  }

  async deleteProject(slug: string): Promise<boolean> {
    throw new Error("Method not implemented." + slug);
    // return this.service.deleteProject(id);
  }
}
