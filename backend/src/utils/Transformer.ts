import { AccessTokenDTO } from "../dtos/access-token-dto.js";
import { BoardDTO } from "../dtos/board-dto.js";
import { AccountDTO } from "../dtos/finances/account-dto.js";
import { AccountEntryDTO } from "../dtos/finances/account-entry-dto.js";
import { AccountTagDTO } from "../dtos/finances/account-tag-dto.js";
import { PageDTO } from "../dtos/page-dto.js";
import { ProjectDTO } from "../dtos/project-dto.js";
import { SmallBoardDTO } from "../dtos/small-board-dto.js";
import { TicketCommentDTO } from "../dtos/ticket-comment-dto.js";
import { TicketDTO } from "../dtos/ticket-dto.js";
import { TicketHistoryDTO } from "../dtos/ticket-history-dto.js";
import { UserDTO } from "../dtos/user-dto.js";
import { AccessToken } from "../models/access-token.js";
import { Board } from "../models/board.js";
import { AccountEntry } from "../models/finances/account-entry.js";
import { AccountTag } from "../models/finances/account-tag.js";
import { Account } from "../models/finances/account.js";
import { Page } from "../models/page.js";
import { Project } from "../models/project.js";
import { TicketComment } from "../models/ticket-comment.js";
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

  static async ticketHistory(
    ticketHistory: TicketHistory
  ): Promise<TicketHistoryDTO> {
    const creator = await UserService.shared.getUserById(
      ticketHistory.creator_id
    );
    return {
      createdAt: ticketHistory.createdAt,
      description: ticketHistory.description,
      versionNumber: ticketHistory.versionNumber,
      creator: this.user(creator),
    };
  }

  static async ticketComment(
    ticketComment: TicketComment
  ): Promise<TicketCommentDTO> {
    const creator = await UserService.shared.getUserById(
      ticketComment.creator_id
    );
    return {
      id: ticketComment.id,
      createdAt: ticketComment.createdAt,
      content: ticketComment.content,
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

  static accessToken(token: AccessToken): AccessTokenDTO {
    return {
      value: token.value,
    };
  }

  static account(account: Account): AccountDTO {
    return {
      id: account.id,
      title: account.title,
      valueInCents: account.valueInCents,
    };
  }

  static async page(page: Page): Promise<PageDTO> {
    const creator = await UserService.shared.getUserById(page.creator_id);
    const updator = await UserService.shared.getUserById(page.updator_id);
    return {
      id: page.id,
      title: page.title,
      icon: page.icon,
      position: page.position,
      content: page.content,
      updatedAt: page.changedAt,
      creator: this.user(creator),
      updator: this.user(updator),
      createdAt: page.createdAt,
      parentId: page.parent_id,
      children: []
    };
  }

  static tags: AccountTagDTO[] = [];

  static async accountEntry(
    accountEntry: AccountEntry
  ): Promise<AccountEntryDTO> {
    if (!this.tags.length) {
      this.tags = await AccountTag.findAll();
    }
    const tag = this.tags.find((tag) => tag.id === accountEntry.tag_id);
    return {
      id: accountEntry.id,
      title: accountEntry.title,
      createdAt: accountEntry.createdAt,
      valueInCents: accountEntry.valueInCents,
      purchasedAt: accountEntry.purchasedAt,
      tagId: accountEntry.tag_id,
      icon: tag?.icon ?? "",
      tag: tag?.title ?? "",
    };
  }

  static accountTag(accountTag: AccountTag): AccountTagDTO {
    return {
      id: accountTag.id,
      title: accountTag.title,
      icon: accountTag.icon,
    };
  }
}
