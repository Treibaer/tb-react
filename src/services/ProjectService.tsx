import { BoardStructure } from "../models/board-structure";
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

  async loadProjectBySlug(slug: string): Promise<Project> {
    return await this.client.get(`/projects/bySlug/${slug}`);
  }

  async loadProjects(): Promise<Project[]> {
    return await this.client.get("/projects");
  }

  async loadTickets(projectId: number) {
    return await this.client.get(`/projects/${projectId}/tickets`);
  }

  async loadBoardStructure(projectSlug: string): Promise<BoardStructure> {
    return await this.client.get(
      `/projects/${projectSlug}/tickets-board-structure`
    );
  }

  async loadTicket(projectSlug: string, ticketSlug: string) {
    return await this.client.get(
      `/projects/${projectSlug}/tickets/${ticketSlug}`
    );
    // const tickets = await this.client.get(`/projects/${projectId}/tickets`);
    // return tickets.find((d: Ticket) => d.ticketId === ticketId);
  }

  async createTicket(projectId: number, ticket: Ticket) {
    return await this.client.post(
      `/projects/${projectId}/tickets`,
      JSON.stringify(ticket)
    );
  }

  async openBoard(boardId: number) {
    return await this.client.post(`/projects/boards/${boardId}/open`, "{}");
  }

  async closeBoard(boardId: number) {
    return await this.client.post(`/projects/boards/${boardId}/close`, "{}");
  }

  async toggleHideDone(projectSlug: string, value: boolean) {
    return await this.client.post(
      `/projects/${projectSlug}/settings`,
      JSON.stringify({ hideDone: value })
    );
  }
}
