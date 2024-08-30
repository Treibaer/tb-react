import { Board, BoardStructure, Project } from "../Models.js";
import Client from "./Client.js";
import { IBoardService } from "./IBoardService.js";

export class ProxyBoardService implements IBoardService {
  private client = Client.shared;
  static shared = new ProxyBoardService();
  private constructor() {}

  getAll(projectSlug: string): Promise<Board[]> {
    return this.client.get<Board[]>(`/projects/${projectSlug}/boards`);
  }
  get(projectSlug: string, id: number): Promise<Board | null> {
    return this.client.get<Board>(`/projects/${projectSlug}/boards/${id}`);
  }
  getBoardStructure(projectSlug: string): Promise<BoardStructure> {
    const path = `/projects/${projectSlug}/tickets-board-structure`;
    return this.client.get<BoardStructure>(path);
  }
  open(projectSlug: string, id: number): Promise<void> {
    return this.client.post(`/projects/${projectSlug}/boards/${id}/open`, {});
  }
  close(projectSlug: string, id: number): Promise<void> {
    return this.client.post(`/projects/${projectSlug}/boards/${id}/close`, {});
  }
  updateSettings(projectSlug: string, settings: Record<string, any>): Promise<void> {
    return this.client.post(`/projects/${projectSlug}/settings`, settings);
  }
}
