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

  async loadProjects() {
    return await this.client.get("/projects");
  }

  async loadTickets(projectId: number) {
    return await this.client.get(`/projects/${projectId}/tickets`);
  }

  async loadTicket(projectId: number, ticketId: number) {
    const tickets = await this.client.get(`/projects/${projectId}/tickets`);
    return tickets.find((d: Ticket) => d.ticketId === ticketId);
  }
  
  async createTicket(projectId: number, ticket: Ticket) {
    return await this.client.post(`/projects/${projectId}/tickets`, JSON.stringify(ticket));
  }
}
