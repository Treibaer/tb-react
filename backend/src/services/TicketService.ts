import { TicketDTO } from "../dtos/ticket-dto.js";
import { Project } from "../models/project.js";
import { TicketComment } from "../models/ticket-comment.js";
import { TicketHistory } from "../models/ticket-history.js";
import { Ticket } from "../models/ticket.js";
import LegacyTicketService from "./LegacyTicketService.js";
import UserService from "./UserService.js";

export class TicketService {
  static shared = new TicketService();
  private constructor() {}

  async get(projectSlug: string, ticketSlug: string): Promise<Ticket> {
    if (!ticketSlug.includes("-")) {
      throw new Error("Invalid ticket slug");
    }
    const project = await Project.getBySlug(projectSlug);
    const ticketId = ticketSlug.split("-")[1];
    const ticket = await Ticket.findOne({
      where: { ticket_id: ticketId, project_id: project.id },
    });
    if (!ticket) {
      const error: any = new Error("Ticket not found");
      error.statusCode = 404;
      throw error;
    }
    return ticket;
  }

  async getAll(projectSlug: string): Promise<Ticket[]> {
    const project = await Project.getBySlug(projectSlug);
    return await Ticket.findAll({
      where: { project_id: project.id },
      order: [["id", "ASC"]],
    });
  }

  async create(projectSlug: string, ticket: TicketDTO): Promise<TicketDTO> {
    return LegacyTicketService.shared.createTicket(projectSlug, ticket);
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
      order: [["id", "DESC"]],
    });
  }

  async getComments(ticketSlug: string): Promise<TicketComment[]> {
    const ticket = await Ticket.getBySlug(ticketSlug);
    return await TicketComment.findAll({
      where: { ticket_id: ticket.id },
      order: [["id", "ASC"]],
    });
  }

  async createComment(
    ticketSlug: string,
    content: string
  ): Promise<TicketComment> {
    const ticket = await Ticket.getBySlug(ticketSlug);
    const user = await UserService.shared.getUser();
    return await TicketComment.create({
      content: content,
      creator_id: user.id,
      ticket_id: ticket.id,
    });
  }

  async removeComment(ticketSlug: string, commentId: number): Promise<void> {
    const ticket = await Ticket.getBySlug(ticketSlug);
    await TicketComment.destroy({
      where: { ticket_id: ticket.id, id: commentId },
    });
  }
}
