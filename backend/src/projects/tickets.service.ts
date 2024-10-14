import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Project } from './entities/project';
import { ProjectDto } from './dto/project.dto';
import { ProjectMetaDto } from './dto/project-meta.dto';
import { User } from 'src/users/entities/user.entity';
import { ticketStates } from './models/ticket-states';
import { ticketTypes } from './models/ticket-types';
import { Board } from './entities/board';
import { BoardsService } from './boards.service';
import { ProjectDashboardDataDto } from './dto/project-dashboard-data.dto';
import { Ticket } from './entities/ticket';
import { TicketStatus } from './models/ticket-status';
import { TicketDto } from './dto/ticket.dto';
import { TicketHistory } from './entities/ticket-history';
import { TicketHistoryDto } from './dto/ticket-history.dto';
import { TicketCommentDto } from './dto/ticket-comment.dto';
import { TicketComment } from './entities/ticket-comment';
import { Transformer } from './transformer';

@Injectable()
export class TicketsService {
  constructor(
    private readonly userService: UsersService,
    private readonly boardService: BoardsService,
    private readonly transformer: Transformer,
  ) {}

  async getAll(projectSlug: string): Promise<Ticket[]> {
    const project = await Project.findOne({ where: { slug: projectSlug } });
    return await Ticket.findAll({
      where: { project_id: project.id },
      order: [['id', 'ASC']],
    });
  }

  async create(
    projectSlug: string,
    ticket: TicketDto & {
      assigneeId?: number;
      boardId?: number;
    },
  ): Promise<TicketDto> {
    const project = await this.findProjectBySlug(projectSlug);
    const user = this.userService.user;
    const boardId = ticket.boardId === 0 ? null : ticket.boardId;

    if (!ticket.title) {
      throw new Error('Title is required');
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
      closedAt: ticket.status === 'done' ? Math.floor(Date.now() / 1000) : null,
    });
    await this.createHistoryEntry(createdTicket);
    return await this.transformer.ticket(projectSlug, createdTicket);
  }

  async get(projectSlug: string, ticketSlug: string): Promise<Ticket> {
    if (!ticketSlug.includes('-')) {
      throw new Error('Invalid ticket slug');
    }
    const project = await Project.findOne({ where: { slug: projectSlug } });
    const ticketId = ticketSlug.split('-')[1];
    const ticket = await Ticket.findOne({
      where: { ticket_id: ticketId, project_id: project.id },
    });
    if (!ticket) {
      const error: any = new Error('Ticket not found');
      error.statusCode = 404;
      throw error;
    }
    return ticket;
  }

  async update(
    projectSlug: string,
    ticketSlug: string,
    data: TicketDto & {
      assigneeId?: number;
      boardId?: number;
      position?: number;
    },
  ): Promise<TicketDto> {
    const project = await this.findProjectBySlug(projectSlug);
    const ticket = await Ticket.findOne({
      where: { project_id: project.id, ticketId: ticketSlug.split('-')[1] },
    });
    if (!ticket) {
      throw new Error('Ticket not found');
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
      if (
        data.assigneeId === undefined &&
        ticket.assigned_id === null &&
        data.status === 'inProgress'
      ) {
        ticket.assigned_id = this.userService.user.id;
      }
      ticket.status = data.status;
      if (data.status === 'done' && ticket.closedAt === null) {
        ticket.closedAt = Math.floor(Date.now() / 1000);
      }
    }
    if (data.type !== undefined) {
      ticket.type = data.type;
    }
    if (data.boardId !== undefined) {
      if (data.boardId !== 0) {
        const board = await this.boardService.get(data.boardId);
        if (!board) {
          throw new Error('Board not found');
        }
        if (board.project_id !== project.id) {
          throw new Error('Board does not belong to this project');
        }
      }
      ticket.board_id = data.boardId === 0 ? null : data.boardId;
      ticket.position = 10000;
      // update position of all tickets in the board

      await ticket.save();
      const tickets = await Ticket.findAll({
        where: { board_id: ticket.board_id, project_id: project.id },
        order: [['position', 'ASC']],
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
        order: [['position', 'ASC']],
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
    return this.transformer.ticket(projectSlug, ticket);
  }

  async getHistory(ticketSlug: string): Promise<TicketHistory[]> {
    const ticket = await this.getBySlug(ticketSlug);
    return await TicketHistory.findAll({
      where: { ticket_id: ticket.id },
      order: [['id', 'DESC']],
    });
  }

  async getComments(ticketSlug: string): Promise<TicketComment[]> {
    const ticket = await this.getBySlug(ticketSlug);
    return await TicketComment.findAll({
      where: { ticket_id: ticket.id },
      order: [['id', 'ASC']],
    });
  }

  async createComment(
    ticketSlug: string,
    content: string,
  ): Promise<TicketComment> {
    const ticket = await this.getBySlug(ticketSlug);
    const user = this.userService.user;
    return await TicketComment.create({
      content: content,
      creator_id: user.id,
      ticket_id: ticket.id,
    });
  }

  async removeComment(ticketSlug: string, commentId: number): Promise<void> {
    const ticket = await this.getBySlug(ticketSlug);
    await TicketComment.destroy({
      where: { ticket_id: ticket.id, id: commentId },
    });
  }

  private async getBySlug(slug: string): Promise<Ticket> {
    const projectSlug = slug.split('-')[0];
    const ticketId = slug.split('-')[1];
    const project = await Project.findOne({ where: { slug: projectSlug } });
    const ticket = await Ticket.findOne({
      where: { ticket_id: ticketId, project_id: project.id },
    });
    if (!ticket) {
      const error = new Error('Ticket not found') as any;
      error.statusCode = 404;
      throw error;
    }
    return ticket;
  }

  async ticketHistory(ticketHistory: TicketHistory): Promise<TicketHistoryDto> {
    const creator = await User.findByPk(ticketHistory.creator_id);
    return {
      createdAt: ticketHistory.createdAt,
      description: ticketHistory.description,
      versionNumber: ticketHistory.versionNumber,
      creator: this.userService.transform(creator),
    };
  }

  async ticketComment(ticketComment: TicketComment): Promise<TicketCommentDto> {
    const creator = await User.findByPk(ticketComment.creator_id);
    return {
      id: ticketComment.id,
      createdAt: ticketComment.createdAt,
      content: ticketComment.content,
      creator: this.userService.transform(creator),
    };
  }

  private async findProjectBySlug(slug: string): Promise<Project> {
    const project = await Project.findOne({ where: { slug } });
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  private async createHistoryEntry(ticket: Ticket) {
    const user = this.userService.user;
    const lastHistory = await TicketHistory.findOne({
      where: { ticket_id: ticket.id },
      order: [['versionNumber', 'DESC']],
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
