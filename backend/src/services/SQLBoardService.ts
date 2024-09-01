import { Board } from "../models/board.js";
import { BoardDTO, BoardStructureDTO } from "../models/dtos.js";
import { TicketEntity } from "../models/ticket.js";
import Transformer from "../utils/Transformer.js";
import { IBoardService } from "./interfaces/IBoardService.js";
import { SQLProjectService } from "./SQLProjectService.js";
import UserService from "./UserService.js";

export default class SQLBoardService implements IBoardService {
  static shared = new SQLBoardService();

  async getAll(projectSlug: string): Promise<BoardDTO[]> {
    const project = await SQLProjectService.shared.get(projectSlug);
    if (!project) {
      throw new Error("Project not found");
    }
    const boards = await Board.findAll({ where: { project_id: project.id } });
    return await Promise.all(boards.map(Transformer.board));
  }

  async get(_: string, boardId: number): Promise<BoardDTO | null> {
    const board = await Board.findByPk(boardId);
    return board ? Transformer.board(board) : null;
  }

  async getBoardStructure(projectSlug: string): Promise<BoardStructureDTO> {
    const project = await SQLProjectService.shared.get(projectSlug);
    if (!project) {
      throw new Error("Project not found");
    }
    const activeBoards = await Board.findAll({
      where: { project_id: project.id, isActive: true },
    });
    activeBoards.sort((a, b) => a.startDate - b.startDate);
    const backlog = await TicketEntity.findAll({
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
      closed: user.closedBords.split("_"),
    };
  }

  async open(_: string, id: number): Promise<void> {
    const user = await UserService.shared.getUser();
    user.closedBords = user.closedBords
      .split("_")
      .filter((b) => b !== "" + id)
      .join("_");
    await user.save();
  }

  async close(_: string, id: number): Promise<void> {
    const user = await UserService.shared.getUser();
    user.closedBords = user.closedBords
      .split("_")
      .filter((b) => b !== "" + id)
      .join("_");
    user.closedBords += `_${id}`;
    await user.save();
  }

  async updateSettings(
    projectSlug: string,
    settings: Record<string, any>
  ): Promise<void> {
    const project = await SQLProjectService.shared.get(projectSlug);
    if (!project) {
      throw new Error("Project not found");
    }
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
