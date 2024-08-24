import { Board, BoardStructure } from "../models/board-structure";
import { Project } from "../models/project";
import { ProjectMeta } from "../models/project-meta";
import { Ticket } from "../models/ticket";
import { User } from "../models/user";
import Client from "./Client";

export default class ProjectService {
  static shared = new ProjectService();
  private client = Client.shared;
  private constructor() {}

  async createProject(project: Project) {
    console.log(project);

    // throw new Error("Method not implemented.");
    return this.client.post("/projects", project);
  }

  async getProjects() {
    return this.client.get<Project[]>("/projects");
  }

  async getProject(projectSlug: string) {
    return this.client.get<Project>(`/projects/${projectSlug}`);
  }

  async updateProject(projectSlug: string, project: Project) {
    throw new Error("Method not implemented.");
    // return this.client.put(`/projects/${projectSlug}`, project);
  }

  async deleteProject(projectSlug: string) {
    throw new Error("Method not implemented.");
    // return this.client.delete(`/projects/${projectSlug}`);
  }

  async createTicket(projectSlug: string, ticket: Ticket) {
    return this.client.post(`/projects/${projectSlug}/tickets`, ticket);
  }

  async getTickets(projectSlug: string) {
    return this.client.get<Ticket[]>(`/projects/${projectSlug}/tickets`);
  }

  async getTicket(projectSlug: string, ticketSlug: string) {
    const url = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    return this.client.get<Ticket>(url);
  }

  async getBoards(projectSlug: string) {
    return this.client.get<Board[]>(`/projects/${projectSlug}/boards`);
  }

  async getBoard(projectSlug: string, boardId: number) {
    const url = `/projects/${projectSlug}/boards/${boardId}`;
    return this.client.get<Board>(url);
  }

  async getBoardStructure(projectSlug: string) {
    const url = `/projects/${projectSlug}/tickets-board-structure`;
    return this.client.get<BoardStructure>(url);
  }

  async openBoard(projectSlug: string, boardId: number) {
    const url = `/projects/${projectSlug}/boards/${boardId}/open`;
    return this.client.post(url, {});
  }

  async closeBoard(projectSlug: string, boardId: number) {
    const url = `/projects/${projectSlug}/boards/${boardId}/close`;
    return this.client.post(url, {});
  }

  async toggleHideDone(projectSlug: string, value: boolean) {
    const url = `/projects/${projectSlug}/settings`;
    return this.client.post(url, { hideDone: value });
  }

  async updateTicketStatus(
    projectSlug: string,
    ticketSlug: string,
    status: string
  ) {
    const url = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    return this.client.patch<Ticket>(url, { status });
  }

  async updateAssignee(
    projectSlug: string,
    ticketSlug: string,
    userId: number
  ) {
    const url = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    return this.client.patch<Ticket>(url, { assigneeId: userId });
  }

  async updateType(projectSlug: string, ticketSlug: string, type: string) {
    const url = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    return this.client.patch<Ticket>(url, { type });
  }

  async updatePosition(
    projectSlug: string,
    ticketSlug: string,
    position: number
  ) {
    const url = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    return this.client.patch<Ticket>(url, { position });
  }

  async updateBoard(projectSlug: string, ticketSlug: string, boardId: number) {
    const url = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    return this.client.patch<Ticket>(url, { boardId });
  }

  async updateDescription(
    projectSlug: string,
    ticketSlug: string,
    description: string
  ) {
    const url = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    return this.client.patch<Ticket>(url, { description });
  }

  async getProjectMetadata(projectSlug: string) {
    return this.client.get<ProjectMeta>(`/projects/${projectSlug}/metadata`);
  }

  async getUsers() {
    return this.client.get<User[]>("/users");
  }
}
