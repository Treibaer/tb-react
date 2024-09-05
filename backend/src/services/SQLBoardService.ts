import { BoardStructureDTO } from "../dtos/board-structure-dto.js";
import { Board } from "../models/board.js";
import { Ticket } from "../models/ticket.js";
import Transformer from "../utils/Transformer.js";
import { SQLProjectService } from "./SQLProjectService.js";
import UserService from "./UserService.js";

export default class SQLBoardService {
  static shared = new SQLBoardService();
  private constructor() {}

  async getAll(projectSlug: string): Promise<Board[]> {
    const project = await SQLProjectService.shared.get(projectSlug);
    return await Board.findAll({ where: { project_id: project.id } });
  }

  async get(boardId: number): Promise<Board | null> {
    return await Board.findByPk(boardId);
  }

  async getBoardStructure(projectSlug: string): Promise<BoardStructureDTO> {
    const project = await SQLProjectService.shared.get(projectSlug);
    const activeBoards = await Board.findAll({
      where: { project_id: project.id, isActive: true },
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
