import { BoardStructure } from "../models/board-structure";
import { Project } from "../models/project";
import { Ticket } from "../models/ticket";
import Client from "./Client";

export default class ProjectService {
  static shared = new ProjectService();
  private client = Client.shared;
  private constructor() {}

  async createProject(project: Project) {
    return this.client.post("/projects", project);
  }

  async loadProject(projectId: number) {
    return this.client.get<Project>(`/projects/${projectId}`);
  }

  async loadProjectBySlug(slug: string) {
    return this.client.get<Project>(`/projects/bySlug/${slug}`);
  }

  async loadProjects() {
    return this.client.get<Project[]>("/projects");
  }

  async loadTickets(projectId: number) {
    return this.client.get<Ticket[]>(`/projects/${projectId}/tickets`);
  }

  async loadBoardStructure(projectSlug: string) {
    return this.client.get<BoardStructure>(
      `/projects/${projectSlug}/tickets-board-structure`
    );
  }

  async loadTicket(projectSlug: string, ticketSlug: string) {
    return this.client.get<Ticket>(
      `/projects/${projectSlug}/tickets/${ticketSlug}`
    );
  }

  async createTicket(projectId: number, ticket: Ticket) {
    return this.client.post(`/projects/${projectId}/tickets`, ticket);
  }

  async openBoard(boardId: number) {
    return this.client.post(`/projects/boards/${boardId}/open`, {});
  }

  async closeBoard(boardId: number) {
    return this.client.post(`/projects/boards/${boardId}/close`, {});
  }

  async toggleHideDone(projectSlug: string, value: boolean) {
    return this.client.post(`/projects/${projectSlug}/settings`, {
      hideDone: value,
    });
  }
}
