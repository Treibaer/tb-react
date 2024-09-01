import { Board } from "../models/board.js";
import {
  BoardDTO,
  ProjectDTO,
  SmallBoardDTO,
  TicketDTO,
  TicketStatus,
  UserDTO,
} from "../models/dtos.js";
import { ProjectEntity } from "../models/project.js";
import { TicketEntity } from "../models/ticket.js";
import { User } from "../models/user.js";
import UserService from "../services/UserService.js";
import { global } from "./global.js";

export default class Transformer {
  static async ticket(
    projectSlug: String,
    ticket: TicketEntity
  ): Promise<TicketDTO> {
    const creator = await UserService.shared.getUserById(ticket.creator_id);
    const assignee = await UserService.shared.getUserById(ticket.assigned_id);
    const board = ticket.board_id
      // ? await SQLBoardService.shared.get("", ticket.board_id)
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
      creator: this.user(creator.toJSON()),
      assignee: assignee ? this.user(assignee.toJSON()) : null,
      createdAt: ticket.createdAt,
      updatedAt: ticket.changedAt,
    };
  }

  static user(user: User): UserDTO {
    return {
      id: user.id,
      firstName: user.firstName,
      avatar: `${global.host}${user.avatar}`,
    };
  }

  static project(project: ProjectEntity): ProjectDTO {
    return {
      id: project.id,
      slug: project.slug,
      icon: project.icon,
      title: project.title,
      description: project.description,
    };
  }

  static async board(board: Board): Promise<BoardDTO> {
    const project = await ProjectEntity.findByPk(board.project_id);
    const tickets = await TicketEntity.findAll({
      where: { board_id: board.id },
    });
    const ticketDTOs = await Promise.all(
      tickets.map(async (ticket: TicketEntity) =>
        Transformer.ticket(project!.slug, ticket)
      )
    );
    const creator: User = await UserService.shared.getUserById(
      board.creator_id
    );
    const creatorDTO = Transformer.user(creator);
    return {
      id: board.id,
      title: board.title,
      startDate: board.startDate,
      endDate: board.endDate,
      tickets: ticketDTOs,
      creator: creatorDTO,
    };
  }

  static smallBoard(board: Board): SmallBoardDTO {
    return {
      id: board.id,
      title: board.title,
    };
  }
}
