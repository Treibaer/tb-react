import { TicketDTO } from "../models/dtos.js";
import Client from "./Client.js";
import { ITicketService } from "./interfaces/ITicketService.js";

export class ProxyTicketService implements ITicketService {
  client = Client.shared;
  static shared = new ProxyTicketService();

  async getAll(projectSlug: string): Promise<TicketDTO[]> {
    return this.client.get<TicketDTO[]>(`/projects/${projectSlug}/tickets`);
  }
  async get(projectSlug: string, ticketSlug: string): Promise<TicketDTO | null> {
    const path = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    return this.client.get<TicketDTO>(path);
  }

  async create(
    projectSlug: string,
    title: string,
    description: string
  ): Promise<TicketDTO> {
    const path = `/projects/${projectSlug}/tickets`;
    const data = { title, description };
    return this.client.post(path, data);
  }

  async update(
    projectSlug: string,
    ticketSlug: string,
    data: TicketDTO
  ): Promise<TicketDTO> {
    const path = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    return this.client.patch(path, data);
  }
  // deleteTicket(projectSlug: string, ticketSlug: string): Promise<boolean> {
  //     throw new Error("Method not implemented.");
  // }
}
