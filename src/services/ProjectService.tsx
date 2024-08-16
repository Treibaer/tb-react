import { title } from "process";
import { Project } from "../models/project";
import { Ticket } from "../models/ticket";
import Client from "./Client";

export default class ProjectService {
  static shared = new ProjectService();
  private client = Client.shared;
  private constructor() {}

  async createProject(project: Project) {
    return await this.client.post("/projects", JSON.stringify(project));
  }

  async loadProject(projectId: number) {
    return await this.client.get(`/projects/${projectId}`);
  }

  async loadProjectBySlug(slug: string) {
    return await this.client.get(`/projects/bySlug/${slug}`);
  }

  async loadProjects(): Promise<Project[]> {
    const rawProjects = await this.client.get("/projects");
    return rawProjects;
    console.log("rawProjects", rawProjects);
    return rawProjects.projects.map((p: Project) => {
      return {
        id: 0,
        slug: p.slug,
        title: p.title,
        description: "",
      };
    });
  }

  async loadTickets(projectId: number) {
    return await this.client.get(`/projects/${projectId}/tickets`);
  }

  async loadTicket(projectSlug: string, ticketSlug: string) {
    return await this.client.get(`/projects/${projectSlug}/tickets/${ticketSlug}`);
    // const tickets = await this.client.get(`/projects/${projectId}/tickets`);
    // return tickets.find((d: Ticket) => d.ticketId === ticketId);
  }
  
  async createTicket(projectId: number, ticket: Ticket) {
    return await this.client.post(`/projects/${projectId}/tickets`, JSON.stringify(ticket));
  }
}
