import { Injectable, Scope } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { TicketDto } from './dto/ticket.dto';
import { Board } from './entities/board';
import { Ticket } from './entities/ticket';
import { TicketStatus } from './models/ticket-status';
import { UserService } from 'src/users/user.service';
import { Page } from './entities/page';
import { Project } from './entities/project';
import { PageDto } from './dto/page.dto';
import { SmallBoardDto } from './dto/small-board.dto';

@Injectable({ scope: Scope.REQUEST })
export class TransformService {
  private userMap: Map<number, User> = new Map();
  private boardMap: Map<number, Board> = new Map();
  private projectMap: Map<number, Project> = new Map();

  constructor(private readonly userService: UserService) {
    console.log('initializting transfor');

    this.fillCaches();
  }

  async fillCaches() {
    const users = await User.findAll();
    this.userMap = new Map(users.map((user) => [user.id, user]));

    const boards = await Board.findAll();
    this.boardMap = new Map(boards.map((board) => [board.id, board]));

    const projects = await Project.findAll();
    this.projectMap = new Map(projects.map((project) => [project.id, project]));
  }

  async ticket(projectSlug: String, ticket: Ticket): Promise<TicketDto> {
    const creator =
      this.userMap.get(ticket.creator_id) ??
      (await User.findByPk(ticket.creator_id));
    const assignee =
      ticket.assigned_id === -1
        ? null
        : (this.userMap.get(ticket.assigned_id) ??
          (await User.findByPk(ticket.assigned_id)));
    const board = ticket.board_id
      ? (this.boardMap.get(ticket.board_id) ??
        (await Board.findByPk(ticket.board_id)))
      : null;

    const parent = await Ticket.findByPk(ticket.parentId);

    const children = await Ticket.findAll({
      where: {
        parentId: ticket.id,
      },
      order: [['position', 'ASC']],
    });
    const childrenDto = await Promise.all(
      children.map((child) => this.ticket(projectSlug, child)),
    );

    const ticketParentDto = parent
      ? {
          id: parent.id,
          title: parent.title,
          slug: `${projectSlug}-${parent.ticketId}`,
        }
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
      creator: this.userService.transform(creator),
      assignee: assignee ? this.userService.transform(assignee) : null,
      createdAt: ticket.createdAt,
      updatedAt: ticket.changedAt,
      closedAt: ticket.closedAt,
      parent: ticketParentDto,
      children: childrenDto,
    };
  }

  async page(page: Page, userMap?: Map<number, User>): Promise<PageDto> {
    const [creator, updator, enrichedContent] = await Promise.all([
      userMap ? userMap.get(page.creator_id) : User.findByPk(page.creator_id),
      userMap ? userMap.get(page.updator_id) : User.findByPk(page.updator_id),
      TransformService.enrichContent(page.project_id, page.content),
    ]);

    return {
      id: page.id,
      title: page.title,
      icon: page.icon,
      position: page.position,
      content: page.content,
      enrichedContent: enrichedContent,
      updatedAt: page.changedAt,
      creator: this.userService.transform(creator),
      updator: this.userService.transform(updator),
      createdAt: page.createdAt,
      parentId: page.parent_id,
      children: [],
    };
  }

  async pages(pages: Page[]): Promise<PageDto[]> {
    const users = await User.findAll();
    const userMap = new Map(users.map((user) => [user.id, user]));
    return await Promise.all(pages.map((page) => this.page(page, userMap)));
  }
  private static pages: Page[] = [];
  private static pageMap: Record<number, Page> = {};
  private static projects: Project[] = [];
  private static lastCheckTimestamp = 0;

  private static async enrichContent(
    projectId: number,
    content: string,
  ): Promise<string> {
    const now = Date.now();
    if (now - this.lastCheckTimestamp > 1000 * 60 * 5) {
      this.pages = await Page.findAll();
      this.projects = await Project.findAll();
      this.pageMap = this.pages.reduce(
        (acc, page) => {
          acc[page.id] = page;
          return acc;
        },
        {} as Record<number, Page>,
      );
      this.lastCheckTimestamp = now;
    }
    const project = this.projects.find((project) => project.id === projectId);

    const regex = /page\(\d+\)/g;

    const matches = content.match(regex) || [];

    for (const match of matches) {
      const innerMatch = match.match(/\d+/);
      if (innerMatch && innerMatch[0]) {
        const page = this.pageMap[parseInt(innerMatch[0])];
        if (page) {
          let newContent = page.icon + ' ' + page.title;
          const url = `/projects/${project?.slug}/pages/${page.id}`;
          newContent = `<a href="${url}">${newContent}</a>`;
          content = content.replace(match, newContent);
        }
      }
    }
    return content;
  }

  smallBoard(board: Board): SmallBoardDto {
    return {
      id: board.id,
      title: board.title,
    };
  }
}
