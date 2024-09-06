import { BoardDTO } from "../dtos/board-dto.js";
import { BoardStructureDTO } from "../dtos/board-structure-dto.js";
import { Board } from "../models/board.js";
import { Ticket } from "../models/ticket.js";
import Transformer from "../utils/Transformer.js";
import { SQLProjectService } from "./SQLProjectService.js";
import UserService from "./UserService.js";

export default class SQLBoardService {
  static shared = new SQLBoardService();
  private userService = UserService.shared;
  private constructor() {}

  async create(projectSlug: string, board: BoardDTO): Promise<BoardDTO> {
    const user = await this.userService.getUser();
    const project = await SQLProjectService.shared.get(projectSlug);

    // calculate position
    const boards = await this.getAll(projectSlug);

    // await Validator.validateNewProject(project);
    const createdBoard = await Board.create({
      title: board.title,
      startDate: 0,
      endDate: 0,
      isActive: true,
      project_id: project.id,
      creator_id: user.id,
      position: boards.length,
    });
    return Transformer.board(createdBoard);
  }

  async getAll(projectSlug: string): Promise<Board[]> {
    const project = await SQLProjectService.shared.get(projectSlug);
    return await Board.findAll({
      where: { project_id: project.id },
      order: [["position", "ASC"]],
    });
  }

  async get(boardId: number): Promise<Board | null> {
    return await Board.findByPk(boardId);
  }

  async getBoardStructure(projectSlug: string): Promise<BoardStructureDTO> {
    const project = await SQLProjectService.shared.get(projectSlug);
    const activeBoards = await Board.findAll({
      where: { project_id: project.id, isActive: true },
      order: [["position", "ASC"]],
    });
    activeBoards.sort((a, b) => a.startDate - b.startDate);
    const backlog = await Ticket.findAll({
      where: { project_id: project.id, board_id: null },
      order: [["position", "ASC"]],
    });
    backlog.sort((a, b) => a.position - b.position);
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

    await board.save();

    return Transformer.board(board);
  }

  async save(board: BoardDTO): Promise<BoardDTO> {
    const oldBoard = await Board.findByPk(board.id);
    if (!oldBoard) {
      throw new Error("Board not found");
    }
    oldBoard.title = board.title;
    oldBoard.position = board.position;
    await oldBoard.save();
    return Transformer.board(oldBoard);
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
    const project = await SQLProjectService.shared.get(projectSlug);
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
}
