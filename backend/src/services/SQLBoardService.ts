import { Board } from "../models/board.js";
import { BoardDTO } from "../models/dtos.js";
import Transformer from "../utils/Transformer.js";
import { IBoardService } from "./interfaces/IBoardService.js";
import { ProxyBoardService } from "./ProxyBoardService.js";
import { SQLProjectService } from "./SQLProjectService.js";

export default class SQLBoardService
  extends ProxyBoardService
  implements IBoardService
{
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
}
