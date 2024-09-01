import { BoardDTO, BoardStructureDTO } from "../models/dtos.js";
import Client from "./Client.js";
import { IBoardService } from "./interfaces/IBoardService.js";

/**
 * ProxyBoardService is a proxy class for the BoardService.
 * It forwards requests to the old backend API.
 */
export class ProxyBoardService implements IBoardService {
  private client = Client.shared;
  static shared = new ProxyBoardService();
  
  async getAll(projectSlug: string): Promise<BoardDTO[]> {
    return this.client.get<BoardDTO[]>(`/projects/${projectSlug}/boards`);
  }
  async get(projectSlug: string, id: number): Promise<BoardDTO | null> {
    return this.client.get<BoardDTO>(`/projects/${projectSlug}/boards/${id}`);
  }
  async getBoardStructure(projectSlug: string): Promise<BoardStructureDTO> {
    const path = `/projects/${projectSlug}/tickets-board-structure`;
    return this.client.get<BoardStructureDTO>(path);
  }
  async open(projectSlug: string, id: number): Promise<void> {
    return this.client.post(`/projects/${projectSlug}/boards/${id}/open`, {});
  }
  async close(projectSlug: string, id: number): Promise<void> {
    return this.client.post(`/projects/${projectSlug}/boards/${id}/close`, {});
  }
  async updateSettings(
    projectSlug: string,
    settings: Record<string, any>
  ): Promise<void> {
    return this.client.post(`/projects/${projectSlug}/settings`, settings);
  }
}
