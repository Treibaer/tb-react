import { BoardDTO } from "./board-dto";
import { TicketDTO } from "./ticket-dto";

export type BoardStructureDTO = {
  projectId: number;
  activeBoards: BoardDTO[];
  closed: string[];
  hideDone: boolean;
  backlog: {
    id: number;
    title: string;
    tickets: TicketDTO[];
  }
};
