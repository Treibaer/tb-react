import { Ticket } from "./ticket";
import { User } from "./user";

export interface BoardStructure {
  projectId: number;
  activeBoards: Board[];
  closed: string[];
  hideDone: boolean;
  backlog: {
    id: number;
    title: string;
    tickets: Ticket[];
  };
}

export interface Board {
  id: number;
  title: string;
  tickets: Ticket[];
  creator?: User;
  position: number;
  isActive: boolean;
}

export interface SmallBoard {
  id: number;
  title: string;
}
