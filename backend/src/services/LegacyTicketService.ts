import { TicketDTO } from "../dtos/ticket-dto.js";
import { Project } from "../models/project.js";
import { TicketHistory } from "../models/ticket-history.js";
import { Ticket } from "../models/ticket.js";
import Transformer from "../utils/Transformer.js";
import { ProjectNotFoundError } from "./Errors.js";
import SQLBoardService from "./SQLBoardService.js";
import UserService from "./UserService.js";

export default class LegacyTicketService {
  static shared = new LegacyTicketService();
  private constructor() {}

  async createTicket(
    projectSlug: string,
    ticket: TicketDTO & {
      assigneeId?: number;
      boardId?: number;
    }
  ): Promise<TicketDTO> {
    const project = await this.findProjectBySlug(projectSlug);
    const user = await UserService.shared.getUser();
    const boardId = ticket.boardId === 0 ? null : ticket.boardId;

    if (!ticket.title) {
      throw new Error("Title is required");
    }

    const allTickets = await Ticket.findAll({
      where: { project_id: project.id },
    });
    const ticketId = allTickets.length + 1;
    const boardTickets = allTickets.filter((t) => t.board_id === boardId);

    const position = boardTickets.length;

    const createdTicket = await Ticket.create({
      title: ticket.title,
      description: ticket.description,
      project_id: project.id,
      ticketId,
      position,
      creator_id: user.id,
      assigned_id: ticket.assigneeId,
      type: ticket.type,
      status: ticket.status,
      board_id: boardId,
    });
    await this.createHistoryEntry(createdTicket);
    return await Transformer.ticket(projectSlug, createdTicket);
  }

  async updateTicket(
    projectSlug: string,
    ticketSlug: string,
    data: TicketDTO & {
      assigneeId?: number;
      boardId?: number;
      position?: number;
    }
  ): Promise<TicketDTO> {
    const project = await this.findProjectBySlug(projectSlug);
    const ticket = await Ticket.findOne({
      where: { project_id: project.id, ticketId: ticketSlug.split("-")[1] },
    });
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    const oldDescription = ticket.description;

    if (data.title !== undefined) {
      ticket.title = data.title;
    }
    if (data.description !== undefined) {
      ticket.description = data.description;
      ticket.changedAt = Math.floor(Date.now() / 1000);
    }
    if (data.status !== undefined) {
      ticket.status = data.status;
    }
    if (data.type !== undefined) {
      ticket.type = data.type;
    }
    if (data.boardId !== undefined) {
      if (data.boardId !== 0) {
        const board = await SQLBoardService.shared.get(data.boardId);
        if (!board) {
          throw new Error("Board not found");
        }
        if (board.project_id !== project.id) {
          throw new Error("Board does not belong to this project");
        }
      }
      ticket.board_id = data.boardId === 0 ? null : data.boardId;
      ticket.position = 10000;
      // update position of all tickets in the board

      await ticket.save();
      const tickets = await Ticket.findAll({
        where: { board_id: ticket.board_id, project_id: project.id },
        order: [["position", "ASC"]],
      });
      for (let i = 0; i < tickets.length; i++) {
        tickets[i].position = i;
        await tickets[i].save();
      }
    }

    if (data.position !== undefined) {
      // get all tickets from the same board
      let tickets = await Ticket.findAll({
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

    if (ticket.description !== oldDescription) {
      await this.createHistoryEntry(ticket);
    }
    await ticket.save();
    return Transformer.ticket(projectSlug, ticket);
  }

  private async findProjectBySlug(slug: string): Promise<Project> {
    const project = await Project.findOne({ where: { slug } });
    if (!project) {
      throw new ProjectNotFoundError();
    }
    return project;
  }

  private async createHistoryEntry(ticket: Ticket) {
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
}
