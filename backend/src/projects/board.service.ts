import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/user.service';
import { BoardStructureDto } from './dto/board-structure.dto';
import { BoardDto } from './dto/board.dto';
import { SmallBoardDto } from './dto/small-board.dto';
import { Board } from './entities/board';
import { Project } from './entities/project';
import { Ticket } from './entities/ticket';
import { TransformService } from './transform.service';

@Injectable()
export class BoardService {
  constructor(
    private readonly userService: UserService,
    private readonly transformer: TransformService,
  ) {}

  smallBoard(board: Board): SmallBoardDto {
    return {
      id: board.id,
      title: board.title,
    };
  }

  async get(boardId: number): Promise<Board | null> {
    return await Board.findByPk(boardId);
  }

  async getBoardStructure(projectSlug: string): Promise<BoardStructureDto> {
    const project = await Project.findOne({ where: { slug: projectSlug } });
    const activeBoards = await Board.findAll({
      where: { project_id: project.id, isActive: true },
      order: [['position', 'ASC']],
    });
    const backlog = await Ticket.findAll({
      where: { project_id: project.id, board_id: null },
      order: [['position', 'ASC']],
    });
    const backlogTicketDTOs = await Promise.all(
      backlog.map((ticket) => this.transformer.ticket(projectSlug, ticket)),
    );
    const activeBoardDTOs = await Promise.all(
      activeBoards.map((board) => this.board(board)),
    );
    const user = this.userService.user;
    return {
      projectId: project.id,
      activeBoards: activeBoardDTOs,
      backlog: {
        id: 0,
        title: 'Backlog',
        tickets: backlogTicketDTOs,
      },
      hideDone: user.hideDoneProjects
        .split('_')
        .map(Number)
        .includes(project.id),
      closed: user.closedBoards.split('_'),
    };
  }

  async getAll(projectSlug: string): Promise<Board[]> {
    const project = await Project.findOne({ where: { slug: projectSlug } });
    return await Board.findAll({
      where: { project_id: project.id },
      order: [["position", "ASC"]],
    });
  }




  async create(projectSlug: string, board: BoardDto): Promise<BoardDto> {
    const user = this.userService.user;
    const project = await Project.findOne({ where: { slug: projectSlug } });

    const boards = await this.getAll(projectSlug);

    const createdBoard = await Board.create({
      title: board.title,
      isActive: true,
      project_id: project.id,
      creator_id: user.id,
      position: boards.length,
    });
    return this.board(createdBoard);
  }


  async update(
    projectSlug: string,
    boardId: number,
    data: BoardDto
  ): Promise<BoardDto> {
    const board = await Board.findByPk(boardId);
    if (!board) {
      throw new Error("Board not found");
    }
    if (data.title !== undefined) {
      board.title = data.title;
    }
    if (data.position !== undefined) {
      let boards = await this.getAll(projectSlug);
      boards = boards.filter((t) => t.id !== board.id);
      // add the ticket at the new position
      boards.splice(data.position, 0, board);
      // update the position of all tickets
      for (let i = 0; i < boards.length; i++) {
        boards[i].position = i;
        await boards[i].save();
      }
    }
    if (data.isActive !== undefined) {
      board.isActive = data.isActive;
    }

    await board.save();
    return this.board(board);
  }



  async open(id: number): Promise<void> {
    const user = this.userService.user;
    user.closedBoards = user.closedBoards
      .split("_")
      .filter((b) => b !== "" + id)
      .join("_");
    await user.save();
  }

  async close(id: number): Promise<void> {
    const user = this.userService.user;
    user.closedBoards = user.closedBoards
      .split("_")
      .filter((b) => b !== "" + id)
      .join("_");
    user.closedBoards += `_${id}`;
    await user.save();
  }

  async updateSettings(
    projectSlug: string,
    settings: Record<string, any>
  ): Promise<void> {
    const project = await Project.findOne({ where: { slug: projectSlug } });
    const hideDone = settings.hideDone;
    const user = this.userService.user;
    user.hideDoneProjects = user.hideDoneProjects
      .split("_")
      .filter((p) => p !== "" + project.id)
      .join("_");
    if (hideDone) {
      user.hideDoneProjects += `_${project.id}`;
    }
    await user.save();
  }

  async moveTicket(
    projectSlug: string,
    boardId: number,
    data: Record<string, any>
  ): Promise<void> {
    const project = await Project.findOne({ where: { slug: projectSlug } });
    let tickets = await Ticket.findAll({
      where: {
        project_id: project.id,
        board_id: boardId === 0 ? null : boardId,
      },
      order: [["position", "ASC"]],
    });

    const origin = data.origin;
    const target: number = data.target;

    const originTicket = tickets.find((t) => t.id === origin);
    const targetTicketIndex = tickets.findIndex((t) => t.id === target);

    if (!originTicket) {
      throw new Error("Ticket not found");
    }

    if (targetTicketIndex === -1) {
      throw new Error("Target ticket not found");
    }

    tickets = tickets.filter((t) => t.id !== origin);
    tickets.splice(targetTicketIndex, 0, originTicket);

    for (let i = 0; i < tickets.length; i++) {
      tickets[i].position = i;
      await tickets[i].save();
    }
  }

  async board(board: Board): Promise<BoardDto> {
    const project = await Project.findByPk(board.project_id);
    const tickets = await Ticket.findAll({
      where: { board_id: board.id },
      order: [['position', 'ASC']],
    });
    const ticketDTOs = await Promise.all(
      tickets.map(async (ticket: Ticket) =>
        this.transformer.ticket(project!.slug, ticket),
      ),
    );
    const creator = await User.findByPk(board.creator_id);
    const creatorDTO = this.userService.transform(creator);
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
}
