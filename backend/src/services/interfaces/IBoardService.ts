import { Board, BoardStructure } from "../../Models";

export interface IBoardService {
    // createBoard(board: Board): Promise<Board>;
    getAll(projectSlug: string): Promise<Board[]>;
    get(projectSlug: string, id: number): Promise<Board | null>;
    getBoardStructure(projectSlug: string): Promise<BoardStructure>;
    open(projectSlug: string, id: number): Promise<void>;
    close(projectSlug: string, id: number): Promise<void>;
    updateSettings(projectSlug: string, settings: Record<string, any>): Promise<void>;
    // getMetadata(slug: string): Promise<Project | null>;
    // updateBoard(slug: string, board: Board): Promise<Board>;
    // deleteBoard(slug: string): Promise<boolean>;
}
