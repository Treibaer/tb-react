import { Board, BoardStructure } from "../models/board-structure";
import Client from "./Client";

/**
 * Service class for managing boards within projects.
 */
export class BoardService {
  static shared = new BoardService();
  private client = Client.shared;
  private constructor() {}

  /**
   * Retrieves all boards associated with a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @returns A promise that resolves to an array of boards.
   */
  async getAll(projectSlug: string) {
    return this.client.get<Board[]>(`/projects/${projectSlug}/boards`);
  }

  /**
   * Retrieves a specific board by its ID within a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @param boardId - The identifier of the board.
   * @returns A promise that resolves to the board details.
   */
  async get(projectSlug: string, boardId: number) {
    const path = `/projects/${projectSlug}/boards/${boardId}`;
    return this.client.get<Board>(path);
  }

  /**
   * Retrieves the structure of all tickets for a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @returns A promise that resolves to the board structure.
   */
  async getBoardStructure(projectSlug: string) {
    const path = `/projects/${projectSlug}/tickets-board-structure`;
    return this.client.get<BoardStructure>(path);
  }


  /**
   * Opens a specific board by its ID within a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @param boardId - The identifier of the board.
   * @returns A promise that resolves when the board is successfully opened.
   */
  async open(projectSlug: string, boardId: number) {
    const path = `/projects/${projectSlug}/boards/${boardId}/open`;
    return this.client.post(path, {});
  }

  /**
   * Closes a specific board by its ID within a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @param boardId - The identifier of the board.
   * @returns A promise that resolves when the board is successfully closed.
   */
  async close(projectSlug: string, boardId: number) {
    const path = `/projects/${projectSlug}/boards/${boardId}/close`;
    return this.client.post(path, {});
  }

  /**
   * Toggles the visibility of completed tasks in a project's board settings.
   * @param projectSlug - The slug identifier of the project.
   * @param value - A boolean indicating whether to hide completed tasks.
   * @returns A promise that resolves when the setting is successfully updated.
   */
  async toggleHideDone(projectSlug: string, value: boolean) {
    const path = `/projects/${projectSlug}/settings`;
    return this.client.post(path, { hideDone: value });
  }
}
