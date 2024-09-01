import { TicketDTO } from "../models/dtos.js";
import { ProjectEntity } from "../models/project.js";
import { TicketEntity } from "../models/ticket.js";
import Transformer from "../utils/Transformer.js";
import { ITicketService } from "./interfaces/ITicketService.js";
import LegacyTicketService from "./LegacyTicketService.js";

export class SQLTicketService implements ITicketService {
  static shared = new SQLTicketService();

  async get(
    projectSlug: string,
    ticketSlug: string
  ): Promise<TicketDTO | null> {
    const project = await ProjectEntity.findOne({
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
    return Transformer.ticket(projectSlug, tickets[0]);
  }

  async getAll(projectSlug: string): Promise<TicketDTO[]> {
    const project = await ProjectEntity.findOne({
      where: { slug: projectSlug },
    });
    if (!project) {
      throw new Error("Project not found");
    }
    let tickets = await project.getTickets();
    return await Promise.all(
      tickets.map(async (ticket: TicketEntity) =>
        Transformer.ticket(projectSlug, ticket)
      )
    );
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
