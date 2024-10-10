import { BoardDTO } from "../dtos/board-dto.js";
import { BoardStructureDTO } from "../dtos/board-structure-dto.js";
import { Board } from "../models/board.js";
import { Ticket } from "../models/ticket.js";
import Transformer from "../utils/Transformer.js";
import { ProjectService } from "./ProjectService.js";
import UserService from "./UserService.js";

export default class BoardService {
  static shared = new BoardService();
  private userService = UserService.shared;
  private constructor() {}

  async create(projectSlug: string, board: BoardDTO): Promise<BoardDTO> {
    const user = await this.userService.getUser();
    const project = await ProjectService.shared.get(projectSlug);

    const boards = await this.getAll(projectSlug);

    const createdBoard = await Board.create({
      title: board.title,
      isActive: true,
      project_id: project.id,
      creator_id: user.id,
      position: boards.length,
    });
    return Transformer.board(createdBoard);
  }

  async getAll(projectSlug: string): Promise<Board[]> {
    const project = await ProjectService.shared.get(projectSlug);
    return await Board.findAll({
      where: { project_id: project.id },
      order: [["position", "ASC"]],
    });
  }

  async get(boardId: number): Promise<Board | null> {
    return await Board.findByPk(boardId);
  }

  async getBoardStructure(projectSlug: string): Promise<BoardStructureDTO> {
    const project = await ProjectService.shared.get(projectSlug);
    const activeBoards = await Board.findAll({
      where: { project_id: project.id, isActive: true },
      order: [["position", "ASC"]],
    });
    const backlog = await Ticket.findAll({
      where: { project_id: project.id, board_id: null },
      order: [["position", "ASC"]],
    });
    const backlogTicketDTOs = await Promise.all(
      backlog.map((ticket) => Transformer.ticket(projectSlug, ticket))
    );
    const activeBoardDTOs = await Promise.all(
      activeBoards.map(Transformer.board)
    );
    const user = await UserService.shared.getUser();
    return {
      projectId: project.id,
      activeBoards: activeBoardDTOs,
      backlog: {
        id: 0,
        title: "Backlog",
        tickets: backlogTicketDTOs,
      },
      hideDone: user.hideDoneProjects
        .split("_")
        .map(Number)
        .includes(project.id),
      closed: user.closedBoards.split("_"),
    };
  }

  async update(
    projectSlug: string,
    boardId: number,
    data: BoardDTO
  ): Promise<BoardDTO> {
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
    return Transformer.board(board);
  }

  async open(id: number): Promise<void> {
    const user = await UserService.shared.getUser();
    user.closedBoards = user.closedBoards
      .split("_")
      .filter((b) => b !== "" + id)
      .join("_");
    await user.save();
  }

  async close(id: number): Promise<void> {
    const user = await UserService.shared.getUser();
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
    const project = await ProjectService.shared.get(projectSlug);
    const hideDone = settings.hideDone;
    const user = await UserService.shared.getUser();
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
    const project = await ProjectService.shared.get(projectSlug);
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
}
