import { TicketDTO } from "../models/dtos.js";
import { ProjectEntity } from "../models/project.js";
import { TicketHistory } from "../models/ticket-history.js";
import { TicketEntity } from "../models/ticket.js";
import Transformer from "../utils/Transformer.js";
import UserService from "./UserService.js";

export default class LegacyTicketService {
  static shared = new LegacyTicketService();
  private constructor() {}

  async createTicket(
    projectSlug: string,
    title: string,
    description: string
  ): Promise<TicketDTO> {
    const project = await ProjectEntity.findOne({
      where: { slug: projectSlug },
    });
    if (!project) {
      throw new Error("Project not found");
    }
    const user = await UserService.shared.getUser();

    if (!title) {
      throw new Error("Title is required");
    }

    // calculate new position
    const allProjectTickets = await TicketEntity.findAll({
      where: { project_id: project.id },
    });
    const ticketId = allProjectTickets.length + 1;
    const backlogTickets = allProjectTickets.filter((t) => t.board_id === null);
    // find max position of backlog tickets
    const position =
      backlogTickets.length === 0
        ? 0
        : backlogTickets.reduce((max, t) => {
            return t.position > max ? t.position : max;
          }, 0) + 1;

    const ticket = await TicketEntity.create({
      title,
      description,
      project_id: project.id,
      ticketId: ticketId,
      position: position,
      creator_id: user.id,
    });
    await this.createHistory(ticket);
    return Transformer.ticket(projectSlug, ticket);
  }

  private async createHistory(ticket: TicketEntity) {
    const user = await UserService.shared.getUser();
    const lastHistory = await TicketHistory.findOne({
      where: { ticket_id: ticket.id },
      order: [["versionNumber", "DESC"]],
    });
    const versionNumber = lastHistory ? lastHistory.versionNumber + 1 : 1;
    await TicketHistory.create({
      description: ticket.description,
      versionNumber: versionNumber,
      creator_id: user.id,
      ticket_id: ticket.id,
    });
  }

  async updateTicket(
    projectSlug: string,
    ticketSlug: string,
    data: TicketDTO & {assigneeId?: number, boardId?: number, position?: number}
  ): Promise<TicketDTO> {
    const project = await ProjectEntity.findOne({
      where: { slug: projectSlug },
    });
    if (!project) {
      throw new Error("Project not found");
    }
    const ticket = await TicketEntity.findOne({
      where: { project_id: project.id, ticketId: ticketSlug.split("-")[1] },
    });
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    const user = await UserService.shared.getUser();

    const oldDescription = ticket.description;

    if (data.title !== undefined) {
      ticket.title = data.title;
    }
    if (data.description !== undefined) {
      ticket.description = data.description;
    }
    if (data.status !== undefined) {
      ticket.status = data.status;
      if (data.status === "inProgress" && ticket.assigned_id === null) {
        ticket.assigned_id = user.id;
      }
    }
    if (data.type !== undefined) {
      ticket.type = data.type;
    }
    if (data.boardId !== undefined) {
      ticket.board_id = data.boardId === 0 ? null : data.boardId;
    }

    if (data.position !== undefined) {
      // get all tickets from the same board
      let tickets = await TicketEntity.findAll({
        where: { board_id: ticket.board_id },
        order: [["position", "ASC"]],
      });
      // remove the ticket from the array
      tickets = tickets.filter((t) => t.id !== ticket.id);
      // add the ticket at the new position
      tickets.splice(data.position, 0, ticket);
      // update the position of all tickets
      for (let i = 0; i < tickets.length; i++) {
        tickets[i].position = i;
        await tickets[i].save();
      }
    }
    // todo: find a better way to handle assigneeId
    if (data.assigneeId !== undefined) {
      if (data.assigneeId === 0) {
        ticket.assigned_id = null;
      } else {
        ticket.assigned_id = data.assigneeId;
      }
    }

    // write history entry
    if (ticket.description !== oldDescription) {
      await this.createHistory(ticket);
    }
    await ticket.save();
    return Transformer.ticket(projectSlug, ticket);
  }
}
