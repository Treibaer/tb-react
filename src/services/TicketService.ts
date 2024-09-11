import { Ticket } from "../models/ticket";
import { TicketComment } from "../models/ticket-comment";
import { TicketHistory } from "../models/ticket-history";
import { TicketStatus } from "../models/ticket-status";
import Client from "./Client";

/**
 * Service class for managing tickets within projects.
 */
export default class TicketService {
  static shared = new TicketService();
  private client = Client.shared;
  private constructor() {}

  /**
   * Creates a new ticket within a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @param title - The title of the ticket.
   * @param description - The description of the ticket.
   * @returns A promise that resolves to the created ticket.
   */
  async create(
    projectSlug: string,
    data: {
      status?: TicketStatus;
      assigneeId?: number;
      type?: string;
      boardId?: number;
      position?: number;
      title?: string;
      description?: string;
    }
  ) {
    const ticket = this.createTicketObject(data);
    return this.client.post(`/projects/${projectSlug}/tickets`, ticket);
  }

  /**
   * Retrieves all tickets associated with a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @returns A promise that resolves to an array of tickets.
   */
  async getAll(projectSlug: string) {
    return this.client.get<Ticket[]>(`/projects/${projectSlug}/tickets`);
  }

  /**
   * Retrieves a specific ticket by its slug within a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @param ticketSlug - The slug identifier of the ticket.
   * @returns A promise that resolves to the ticket details.
   */
  async get(projectSlug: string, ticketSlug: string) {
    const url = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    return this.client.get<Ticket>(url);
  }

  /**
   * Updates properties of a specific ticket within a project.
   * Supports partial updates.
   * @param projectSlug - The slug identifier of the project.
   * @param ticketSlug - The slug identifier of the ticket.
   * @param data - An object containing ticket properties to update.
   * @returns A promise that resolves to the updated ticket.
   */
  async update(
    projectSlug: string,
    ticketSlug: string,
    data: {
      status?: TicketStatus;
      assigneeId?: number;
      type?: string;
      boardId?: number;
      position?: number;
      title?: string;
      description?: string;
    }
  ) {
    const url = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    return this.client.patch<Ticket>(url, data);
  }

  /**
   * Deletes a specific ticket within a project.
   * @param projectSlug - The slug identifier of the project.
   * @param ticketSlug - The slug identifier of the ticket.
   * @returns A promise that resolves to the deleted ticket.
   */
  async delete(projectSlug: string, ticketSlug: string) {
    // const url = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    throw new Error("Method not implemented.");
    // return this.client.delete(url);
  }

  private createTicketObject(data: {
    status?: TicketStatus;
    assigneeId?: number;
    type?: string;
    boardId?: number;
    position?: number;
    title?: string;
    description?: string;
  }) {
    return {
      id: 0,
      title: data.title,
      description: data.description,
      type: data.type ?? "",
      status: data.status ?? "open",
      boardId: data.boardId ?? 0,
      assigneeId: data.assigneeId,
    };
  }

  async getHistory(projectSlug: string, ticketSlug: string) {
    const url = `/projects/${projectSlug}/tickets/${ticketSlug}/history`;
    return this.client.get<TicketHistory[]>(url);
  }

  async getComments(projectSlug: string, ticketSlug: string) {
    const url = `/projects/${projectSlug}/tickets/${ticketSlug}/comments`;
    return this.client.get<TicketComment[]>(url);
  }

  async addComment(projectSlug: string, ticketSlug: string, content: string) {
    const url = `/projects/${projectSlug}/tickets/${ticketSlug}/comments`;
    return this.client.post(url, { content });
  }

  async removeComment(
    projectSlug: string,
    ticketSlug: string,
    commentId: number
  ) {
    const url = `/projects/${projectSlug}/tickets/${ticketSlug}/comments/${commentId}`;
    await this.client.delete(url);
  }
}
