import { Ticket } from "./ticket";

export interface BoardStructure {
  projectId: number;
  activeBoards: Board[];
  closed: string[];
}

export interface Board {
  id: number;
  title: string;
  tickets: Ticket[];
}
