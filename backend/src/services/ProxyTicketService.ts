import { Ticket } from "../Models.js";
import Client from "./Client.js";
import { ITicketService } from "./interfaces/ITicketService.js";

export class ProxyTicketService implements ITicketService {
  private client = Client.shared;
  static shared = new ProxyTicketService();
  private constructor() {}

  async getAll(projectSlug: string): Promise<Ticket[]> {
    return this.client.get<Ticket[]>(`/projects/${projectSlug}/tickets`);
  }
  async get(projectSlug: string, ticketSlug: string): Promise<Ticket | null> {
    const path = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    return this.client.get<Ticket>(path);
  }

  async create(
    projectSlug: string,
    title: string,
    description: string
  ): Promise<Ticket> {
    const path = `/projects/${projectSlug}/tickets`;
    const data = { title, description };
    return this.client.post(path, data);
  }

  async update(
    projectSlug: string,
    ticketSlug: string,
    data: Ticket
  ): Promise<Ticket> {
    const path = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    return this.client.patch(path, data);
  }
  // deleteTicket(projectSlug: string, ticketSlug: string): Promise<boolean> {
  //     throw new Error("Method not implemented.");
  // }
}
