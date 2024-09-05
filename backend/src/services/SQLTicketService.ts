import { TicketDTO } from "../dtos/ticket-dto.js";
import { Project } from "../models/project.js";
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
      throw new Error("Ticket not found");
    }
    return tickets[0];
  }

  async getAll(projectSlug: string): Promise<Ticket[]> {
    const project = await Project.getBySlug(projectSlug);
    return project.getTickets();
  }

  async create(
    projectSlug: string,
    title: string,
    description: string
  ): Promise<TicketDTO> {
    return LegacyTicketService.shared.createTicket(
      projectSlug,
      title,
      description
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
}
