import { Ticket } from "./ticket";

export interface BoardStructure {
  projectId: number;
  activeBoards: Board[];
  closed: string[];
  hideDone: boolean;
  backlog: {
    id: number;
    title: string;
    tickets: Ticket[];
  }
}

export interface Board {
  id: number;
  title: string;
  tickets: Ticket[];
}
