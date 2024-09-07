import { BoardDTO } from "../dtos/board-dto.js";
import { ProjectDTO } from "../dtos/project-dto.js";
import { SmallBoardDTO } from "../dtos/small-board-dto.js";
import { TicketDTO } from "../dtos/ticket-dto.js";
import { TicketHistoryDTO } from "../dtos/ticket-history-dto.js";
import { UserDTO } from "../dtos/user-dto.js";
import { Board } from "../models/board.js";
import { Project } from "../models/project.js";
import { TicketHistory } from "../models/ticket-history.js";
import { TicketStatus } from "../models/ticket-status.js";
import { Ticket } from "../models/ticket.js";
import { User } from "../models/user.js";
import UserService from "../services/UserService.js";
import { global } from "./global.js";

export default class Transformer {
  static async ticket(projectSlug: String, ticket: Ticket): Promise<TicketDTO> {
    const creator = await UserService.shared.getUserById(ticket.creator_id);
    const assignee = await UserService.shared.getUserById(
      ticket.assigned_id ?? -1
    );
    const board = ticket.board_id
      ? await Board.findByPk(ticket.board_id)
      : null;

    return {
      id: ticket.id,
      position: ticket.position,
      ticketId: ticket.ticketId,
      slug: `${projectSlug}-${ticket.ticketId}`,
      title: ticket.title,
      description: ticket.description,
      type: ticket.type,
      status: ticket.status as TicketStatus,
      board: board
        ? {
            id: board.id,
            title: board.title,
          }
        : null,
      creator: this.user(creator),
      assignee: assignee ? this.user(assignee) : null,
      createdAt: ticket.createdAt,
      updatedAt: ticket.changedAt,
    };
  }

  static user(user: User): UserDTO {
    const avatar = user.avatar.startsWith("http")
      ? user.avatar
      : `${global.host}${user.avatar}`;
    return {
      id: user.id,
      firstName: user.firstName,
      avatar: avatar,
    };
  }

  static project(project: Project): ProjectDTO {
    return {
      id: project.id,
      slug: project.slug,
      icon: project.icon,
      title: project.title,
      description: project.description,
    };
  }

  static async ticketHistory(ticketHistory: TicketHistory): Promise<TicketHistoryDTO> {
    const creator = await UserService.shared.getUserById(ticketHistory.creator_id);
    return {
      createdAt: ticketHistory.createdAt,
      description: ticketHistory.description,
      versionNumber: ticketHistory.versionNumber,
      creator: this.user(creator),
    };
  }

  static async board(board: Board): Promise<BoardDTO> {
    const project = await Project.findByPk(board.project_id);
    const tickets = await Ticket.findAll({
      where: { board_id: board.id },
      order: [["position", "ASC"]],
    });
    const ticketDTOs = await Promise.all(
      tickets.map(async (ticket: Ticket) =>
        Transformer.ticket(project!.slug, ticket)
      )
    );
    const creator: User = await UserService.shared.getUserById(
      board.creator_id
    );
    const creatorDTO = Transformer.user(creator);
    return {
      id: board.id,
      projectId: board.project_id,
      title: board.title,
      tickets: ticketDTOs,
      creator: creatorDTO,
      position: board.position,
      isActive: board.isActive,
    };
  }

  static smallBoard(board: Board): SmallBoardDTO {
    return {
      id: board.id,
      title: board.title,
    };
  }
}
