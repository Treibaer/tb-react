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
    const url = `/projects/${projectSlug}/boards/${boardId}`;
    return this.client.get<Board>(url);
  }

  /**
   * Retrieves the structure of all tickets for a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @returns A promise that resolves to the board structure.
   */
  async getBoardStructure(projectSlug: string) {
    const url = `/projects/${projectSlug}/tickets-board-structure`;
    return this.client.get<BoardStructure>(url);
  }


  /**
   * Opens a specific board by its ID within a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @param boardId - The identifier of the board.
   * @returns A promise that resolves when the board is successfully opened.
   */
  async open(projectSlug: string, boardId: number) {
    const url = `/projects/${projectSlug}/boards/${boardId}/open`;
    return this.client.post(url, {});
  }

  /**
   * Closes a specific board by its ID within a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @param boardId - The identifier of the board.
   * @returns A promise that resolves when the board is successfully closed.
   */
  async close(projectSlug: string, boardId: number) {
    const url = `/projects/${projectSlug}/boards/${boardId}/close`;
    return this.client.post(url, {});
  }

  /**
   * Toggles the visibility of completed tasks in a project's board settings.
   * @param projectSlug - The slug identifier of the project.
   * @param value - A boolean indicating whether to hide completed tasks.
   * @returns A promise that resolves when the setting is successfully updated.
   */
  async toggleHideDone(projectSlug: string, value: boolean) {
    const url = `/projects/${projectSlug}/settings`;
    return this.client.post(url, { hideDone: value });
  }
}
