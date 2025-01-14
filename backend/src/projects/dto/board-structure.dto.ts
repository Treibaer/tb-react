import { BoardDto } from "./board.dto";
import { TicketDto } from "./ticket.dto";

export class BoardStructureDto {
  projectId: number;
  activeBoards: BoardDto[];
  closed: string[];
  hideDone: boolean;
  inbox: {
    id: number;
    title: string;
    tickets: TicketDto[];
  };
}
