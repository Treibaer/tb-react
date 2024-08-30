import { Ticket } from "../Models.js";
import Client from "./Client.js";
import { ITicketService } from "./ITicketService.js";

export class ProxyTicketService implements ITicketService {
  private client = Client.shared;
    static shared = new ProxyTicketService();
    private constructor() {}

    getAll(projectSlug: string): Promise<Ticket[]> {
      return this.client.get<Ticket[]>(`/projects/${projectSlug}/tickets`);
    }
    get(projectSlug: string, ticketSlug: string): Promise<Ticket | null> {
      return this.client.get<Ticket>(`/projects/${projectSlug}/tickets/${ticketSlug}`);
    }
    // create(projectSlug: string, ticketSlug: number, ticket: Ticket): Promise<Ticket> {
    //     throw new Error("Method not implemented.");
    // }
    update(projectSlug: string, ticketSlug: string, data: Ticket): Promise<Ticket> {
      return this.client.patch(`/projects/${projectSlug}/tickets/${ticketSlug}`, data);
    }
    // deleteTicket(projectSlug: string, ticketSlug: string): Promise<boolean> {
    //     throw new Error("Method not implemented.");
    // }
}
