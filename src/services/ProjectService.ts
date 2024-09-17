import { Project } from "../models/project";
import { ProjectMeta } from "../models/project-meta";
import { ProjectDashboardData } from "../models/projects/project-dashboard-data";
import Client from "./Client";

/**
 * Service class for managing projects.
 */
export default class ProjectService {
  static shared = new ProjectService();
  private client = Client.shared;
  private constructor() {}

  /**
   * Creates a new project.
   * @param project - The project object containing project details.
   * @returns A promise that resolves to the created project.
   */
  async create(project: Project) {
    return this.client.post("/projects", project);
  }

  /**
   * Retrieves all projects.
   * @returns A promise that resolves to an array of projects.
   */
  async getAll() {
    return this.client.get<Project[]>("/projects");
  }

  /**
   * Retrieves a specific project by its slug.
   * @param projectSlug - The slug identifier of the project.
   * @returns A promise that resolves to the project details.
   */
  async get(projectSlug: string) {
    return this.client.get<Project>(`/projects/${projectSlug}`);
  }

  /**
   * Updates a specific project by its slug.
   * Currently not implemented.
   * @param projectSlug - The slug identifier of the project.
   * @param project - The project object containing updated details.
   * @throws Error indicating the method is not implemented.
   */
  async update(projectSlug: string, project: Project) {
    throw new Error("Method not implemented.");
    // return this.client.put(`/projects/${projectSlug}`, project);
  }

  /**
   * Deletes a specific project by its slug.
   * Currently not implemented.
   * @param projectSlug - The slug identifier of the project.
   * @throws Error indicating the method is not implemented.
   */
  async delete(projectSlug: string) {
    throw new Error("Method not implemented.");
    // return this.client.delete(`/projects/${projectSlug}`);
  }

  /**
   * Retrieves metadata for a specific project by its slug.
   * @param projectSlug - The slug identifier of the project.
   * @returns A promise that resolves to the project's metadata.
   */
  async getMetadata(projectSlug: string) {
    return this.client.get<ProjectMeta>(`/projects/${projectSlug}/metadata`);
  }

  async getDashboardData(projectSlug: string) {
    return this.client.get<ProjectDashboardData>(
      `/projects/${projectSlug}/dashboard`
    );
  }
}
