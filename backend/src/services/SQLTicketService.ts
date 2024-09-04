import { TicketDTO } from "../dtos/ticket-dto.js";
import { Project } from "../models/project.js";
import { Ticket } from "../models/ticket.js";
import LegacyTicketService from "./LegacyTicketService.js";

export class SQLTicketService {
  static shared = new SQLTicketService();
  private constructor() {}

  async get(
    projectSlug: string,
    ticketSlug: string
  ): Promise<Ticket | null> {
    const project = await Project.findOne({
      where: { slug: projectSlug },
    });
    if (!project) {
      return null;
    }
    if (!ticketSlug.includes("-")) {
      return null;
    }
    const tickets = await project.getTickets({
      where: { ticketId: ticketSlug.split("-")[1] },
    });
    if (tickets.length === 0) {
      return null;
    }
    return tickets[0];
  }

  async getAll(projectSlug: string): Promise<Ticket[]> {
    const project = await Project.findOne({
      where: { slug: projectSlug },
    });
    if (!project) {
      throw new Error("Project not found");
    }
    return await project.getTickets();
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
