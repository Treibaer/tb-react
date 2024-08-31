import { Project } from "../Models.js";
import Client from "./Client.js";
import { IProjectService } from "./interfaces/IProjectService.js";

export class ProxyProjectService implements IProjectService {
  private client = Client.shared;
  static shared = new ProxyProjectService();
  private constructor() {}

  async createProject(project: Project): Promise<Project> {
    return this.client.post("/projects", project);
  }

  async getProjects(): Promise<Project[]> {
    return this.client.get<Project[]>("/projects");
  }

  async getProject(slug: string): Promise<Project | null> {
    return this.client.get<Project>(`/projects/${slug}`);
  }

  async getMetadata(slug: string): Promise<Project | null> {
    return this.client.get<Project>(`/projects/${slug}/metadata`);
  }

  async updateProject(slug: string, project: Project): Promise<Project> {
    // return this.service.updateProject(id, project);

    throw new Error("Method not implemented." + slug + project.id);
  }

  async deleteProject(slug: string): Promise<boolean> {
    throw new Error("Method not implemented." + slug);
    // return this.service.deleteProject(id);
  }
}
