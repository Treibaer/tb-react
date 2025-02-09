import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/user.service';
import { BoardService } from './board.service';
import { TicketCommentDto } from './dto/ticket-comment.dto';
import { TicketHistoryDto } from './dto/ticket-history.dto';
import { TicketLinkDto } from './dto/ticket-link.dto';
import { TicketDto } from './dto/ticket.dto';
import { Project } from './entities/project';
import { Ticket } from './entities/ticket';
import { TicketComment } from './entities/ticket-comment';
import { TicketHistory } from './entities/ticket-history';
import { TicketRelation } from './entities/ticket-relation';
import { TransformService } from './transform.service';

@Injectable()
export class TicketService {
  constructor(
    private readonly userService: UserService,
    private readonly boardService: BoardService,
    private readonly transformer: TransformService,
  ) {}

  async fetchTickets(projectSlug: string): Promise<Ticket[]> {
    const project = await Project.findOne({ where: { slug: projectSlug } });
    return await Ticket.findAll({
      where: { project_id: project.id, parentId: null },
      order: [['id', 'ASC']],
    });
  }

  async getTransformedTickets(projectSlug: string): Promise<TicketDto[]> {
    const tickets = await this.fetchTickets(projectSlug);
    return await Promise.all(
      tickets.map(async (ticket) =>
        this.transformer.ticket(projectSlug, ticket),
      ),
    );
  }

  async create(
    projectSlug: string,
    ticket: TicketDto & {
      assigneeId?: number;
      boardId?: number;
      parentId?: number;
    },
  ): Promise<TicketDto> {
    const project = await this.findProjectBySlug(projectSlug);
    const user = this.userService.user;
    const boardId = ticket.boardId === 0 ? null : ticket.boardId;

    if (!ticket.title) {
      throw new Error('Title is required');
    }

    let position: number;

    if (ticket.parent === null) {
      const maxPosition: number = await Ticket.max('position', {
        where: { project_id: project.id, board_id: boardId, parentId: null },
      });
      position = maxPosition !== null ? maxPosition + 1 : 0;
    } else {
      const maxPosition: number = await Ticket.max('position', {
        where: { project_id: project.id, parentId: ticket.parentId ?? null },
      });
      position = maxPosition !== null ? maxPosition + 1 : 0;
    }

    const maxTicketId: number = await Ticket.max('ticket_id', {
      where: { project_id: project.id },
    });

    const ticketId = maxTicketId ? maxTicketId + 1 : 1;

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
      parentId: ticket.parentId ?? null,
    });
    await this.createHistoryEntry(createdTicket);
    return await this.transformer.ticket(projectSlug, createdTicket);
  }

  async fetchTicket(projectSlug: string, ticketSlug: string): Promise<Ticket> {
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

  async getTransformedTicket(
    projectSlug: string,
    ticketSlug: string,
  ): Promise<TicketDto> {
    const ticket = await this.fetchTicket(projectSlug, ticketSlug);
    return await this.transformer.ticket(projectSlug, ticket);
  }

  async update(
    projectSlug: string,
    ticketSlug: string,
    data: TicketDto & {
      assigneeId?: number;
      boardId?: number;
      position?: number;
      parentId?: number;
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
        const board = await this.boardService.fetchBoard(data.boardId);
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
        where: {
          board_id: ticket.board_id,
          project_id: project.id,
          parentId: null,
        },
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
        where: {
          board_id: ticket.board_id,
          project_id: project.id,
          parentId: null,
        },
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

  async remove(projectSlug: string, ticketSlug: string): Promise<void> {
    const project = await this.findProjectBySlug(projectSlug);
    const ticket = await Ticket.findOne({
      where: { project_id: project.id, ticketId: ticketSlug.split('-')[1] },
    });
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // check if children exists
    const children = await Ticket.findAll({
      where: { parentId: ticket.id },
    });
    if (children.length > 0) {
      throw new Error('Ticket has subtasks');
    }
    // destroy all history tickets
    await TicketHistory.destroy({ where: { ticket_id: ticket.id } });
    await Ticket.destroy({ where: { id: ticket.id } });
  }

  async fetchHistory(ticketSlug: string): Promise<TicketHistory[]> {
    const ticket = await this.getBySlug(ticketSlug);
    return await TicketHistory.findAll({
      where: { ticket_id: ticket.id },
      order: [['id', 'DESC']],
    });
  }

  async getTransformedHistory(ticketSlug: string): Promise<TicketHistoryDto[]> {
    const historyList = await this.fetchHistory(ticketSlug);
    return await Promise.all(
      historyList.map((history) => this.ticketHistory(history)),
    );
  }

  async getLinkedTickets(
    projectSlug: string,
    ticketSlug: string,
  ): Promise<TicketLinkDto[]> {
    const ticket = await this.getBySlug(ticketSlug);
    const links = await TicketRelation.findAll({
      where: {
        [Op.or]: [{ source_id: ticket.id }, { target_id: ticket.id }],
      },
      include: [
        {
          model: Ticket,
          as: 'source',
        },
        {
          model: Ticket,
          as: 'target',
        },
      ],
    });
    // switch source and target if target == ticket
    links.forEach((link) => {
      if (link.target_id === ticket.id) {
        const source = link.source;
        link.source = link.target;
        link.target = source;
      }
    });
    return await Promise.all(
      links.map(async (link) => {
        return {
          id: link.id,
          type: link.type,
          source: await this.transformer.ticket(projectSlug, link.source),
          target: await this.transformer.ticket(projectSlug, link.target),
        };
      }),
    );
  }

  async createLink(
    projectSlug: string,
    sourceSlug: string,
    targetSlug: string,
    type: string = 'blocks',
  ): Promise<TicketLinkDto> {
    const source = await this.getBySlug(sourceSlug);
    const target = await this.getBySlug(targetSlug);

    // check if they are already linked
    const existingLinks = await TicketRelation.findAll({
      where: {
        [Op.or]: [
          { source_id: source.id, target_id: target.id },
          { source_id: target.id, target_id: source.id },
        ],
      },
    });
    if (existingLinks.length > 0) {
      throw new Error('Tickets are already linked');
    }
    const user = this.userService.user;
    const link = await TicketRelation.create({
      source_id: source.id,
      target_id: target.id,
      creator_id: user.id,
      type,
    });
    return {
      id: link.id,
      type: link.type,
      source: await this.transformer.ticket(projectSlug, source),
      target: await this.transformer.ticket(projectSlug, target),
    };
  }

  async unlink(linkId: number): Promise<void> {
    const link = await TicketRelation.findByPk(linkId);
    if (!link) {
      throw new Error('Link not found');
    }
    await link.destroy();
  }

  async fetchComments(ticketSlug: string): Promise<TicketComment[]> {
    const ticket = await this.getBySlug(ticketSlug);
    return await TicketComment.findAll({
      where: { ticket_id: ticket.id },
      order: [['id', 'ASC']],
    });
  }

  async getTransformedComments(
    ticketSlug: string,
  ): Promise<TicketCommentDto[]> {
    const comments = await this.fetchComments(ticketSlug);
    return await Promise.all(
      comments.map(async (comment) => this.ticketComment(comment)),
    );
  }

  async createComment(
    ticketSlug: string,
    content: string,
  ): Promise<TicketCommentDto> {
    const ticket = await this.getBySlug(ticketSlug);
    const user = this.userService.user;
    const comment = await TicketComment.create({
      content: content,
      creator_id: user.id,
      ticket_id: ticket.id,
    });
    return this.ticketComment(comment);
  }

  async removeComment(ticketSlug: string, commentId: number): Promise<void> {
    const ticket = await this.getBySlug(ticketSlug);
    await TicketComment.destroy({
      where: { ticket_id: ticket.id, id: commentId },
    });
  }

  async moveSubtask(
    ticketSlug: string,
    origin: number,
    target: number,
  ): Promise<void> {
    const ticket = await this.getBySlug(ticketSlug);
    const children = await Ticket.findAll({
      where: { parentId: ticket.id },
      order: [['position', 'ASC']],
    });
    const targetTicket = children.find((t) => t.id === target);
    if (!targetTicket) {
      throw new Error('Target ticket not found');
    }
    const originTicket = children.find((t) => t.id === origin);
    if (!originTicket) {
      throw new Error('Origin ticket not found');
    }
    const originPosition = originTicket.position;
    const targetPosition = targetTicket.position;
    if (originPosition < targetPosition) {
      for (let i = originPosition + 1; i <= targetPosition; i++) {
        children[i].position = i - 1;
        await children[i].save();
      }
      originTicket.position = targetPosition;
      await originTicket.save();
    } else {
      for (let i = targetPosition; i < originPosition; i++) {
        children[i].position = i + 1;
        await children[i].save();
      }
      originTicket.position = targetPosition;
      await originTicket.save();
    }
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
