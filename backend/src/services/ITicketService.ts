import { Ticket } from "../Models";

export interface ITicketService {
    getAll(projectSlug: string): Promise<Ticket[]>;
    get(projectSlug: string, ticketSlug: string): Promise<Ticket | null>;
    // create(projectSlug: string, ticketSlug: number, ticket: Ticket): Promise<Ticket>;
    update(projectSlug: string, ticketSlug: string, data: Ticket): Promise<Ticket>;
    // deleteTicket(projectSlug: string, ticketSlug: string): Promise<boolean>;
}
