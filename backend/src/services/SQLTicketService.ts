import { TicketDTO } from "../dtos/ticket-dto.js";
import { Project } from "../models/project.js";
import { TicketHistory } from "../models/ticket-history.js";
import { Ticket } from "../models/ticket.js";
import LegacyTicketService from "./LegacyTicketService.js";

export class SQLTicketService {
  static shared = new SQLTicketService();
  private constructor() {}

  async get(projectSlug: string, ticketSlug: string): Promise<Ticket> {
    if (!ticketSlug.includes("-")) {
      throw new Error("Invalid ticket slug");
    }
    const project = await Project.getBySlug(projectSlug);
    const ticketId = ticketSlug.split("-")[1];
    const tickets = await project.getTickets({
      where: { ticketId },
    });
    if (tickets.length === 0) {
      const error: any = new Error("Ticket not found");
      error.statusCode = 404;
      throw error;
    }
    return tickets[0];
  }

  async getAll(projectSlug: string): Promise<Ticket[]> {
    const project = await Project.getBySlug(projectSlug);
    return project.getTickets();
  }

  async create(
    projectSlug: string,
    ticket: TicketDTO,
  ): Promise<TicketDTO> {
    return LegacyTicketService.shared.createTicket(
      projectSlug,
      ticket
    );
  }

  async update(
    projectSlug: string,
    ticketSlug: string,
    data: TicketDTO
  ): Promise<TicketDTO> {
    return LegacyTicketService.shared.updateTicket(
      projectSlug,
      ticketSlug,
      data
    );
  }

  async getHistory(ticketSlug: string): Promise<TicketHistory[]> {
    const ticket = await Ticket.getBySlug(ticketSlug);
    return await TicketHistory.findAll({
      where: { ticket_id: ticket.id },
      order: [["createdAt", "DESC"]],
    });
  }
}
