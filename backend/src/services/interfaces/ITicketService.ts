import { TicketDTO } from "../../models/dtos";

export interface ITicketService {
    getAll(projectSlug: string): Promise<TicketDTO[]>;
    get(projectSlug: string, ticketSlug: string): Promise<TicketDTO | null>;
  create(
    projectSlug: string,
    title: string,
    description: string
  ): Promise<TicketDTO>;
  update(
    projectSlug: string,
    ticketSlug: string,
    data: TicketDTO
  ): Promise<TicketDTO>;
  // deleteTicket(projectSlug: string, ticketSlug: string): Promise<boolean>;
}
